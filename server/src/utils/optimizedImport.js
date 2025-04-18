import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Puzzle from '../models/Puzzle.js';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import os from 'os';

// Configure environment variables
dotenv.config();

// Get file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvFilePath = path.join(__dirname, '../../data/puzzles.csv');

// Function to determine puzzle difficulty based on rating
const getDifficulty = (rating) => {
  if (rating < 1200) return 'beginner';
  if (rating < 1600) return 'easy';
  if (rating < 2000) return 'medium';
  if (rating < 2400) return 'hard';
  return 'expert';
};

// Function to count number of moves in the solution
const countMoves = (movesString) => {
  return movesString.split(' ').length;
};

// Worker thread code
if (!isMainThread) {
  const { puzzles, columnIndexes } = workerData;
  
  // Process puzzles in the worker thread
  const processedPuzzles = puzzles.map(columns => {
    return {
      puzzleId: columns[columnIndexes['PuzzleId']],
      fen: columns[columnIndexes['FEN']],
      moves: columns[columnIndexes['Moves']],
      rating: parseInt(columns[columnIndexes['Rating']], 10),
      ratingDeviation: parseInt(columns[columnIndexes['RatingDeviation']], 10),
      popularity: parseInt(columns[columnIndexes['Popularity']], 10),
      nbPlays: parseInt(columns[columnIndexes['NbPlays']], 10),
      themes: columns[columnIndexes['Themes']].split(' '),
      gameUrl: columns[columnIndexes['GameUrl']],
      openingTags: columns[columnIndexes['OpeningTags']]?.split(' ') || [],
      // Calculate derived fields
      difficulty: getDifficulty(parseInt(columns[columnIndexes['Rating']], 10)),
      numMoves: countMoves(columns[columnIndexes['Moves']]),
    };
  });
  
  // Send processed data back to the main thread
  parentPort.postMessage(processedPuzzles);
}
// Main thread code
else {
  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/knightly')
    .then(() => {
      console.log('Connected to MongoDB');
      importPuzzles();
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });

  // Function to import puzzles with multi-threading
  const importPuzzles = async () => {
    try {
      // Check if puzzles already exist in the database
      const existingCount = await Puzzle.countDocuments();
      
      if (existingCount > 0) {
        console.log(`Database already contains ${existingCount} puzzles.`);
        const response = await promptYesNo('Do you want to continue with the import? This may create duplicates. (y/n): ');
        
        if (!response) {
          console.log('Import cancelled by user.');
          process.exit(0);
        }
      }
      
      console.log('Starting optimized import process...');
      
      // Get file size to estimate total lines
      const stats = fs.statSync(csvFilePath);
      const fileSizeInBytes = stats.size;
      const estimatedLines = Math.floor(fileSizeInBytes / 200); // Rough estimate based on average line size
      
      console.log(`File size: ${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`Estimated number of lines: ~${estimatedLines}`);
      
      // Create read stream and interface
      const fileStream = fs.createReadStream(csvFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      
      // Process header to get column indexes
      let headerProcessed = false;
      let columnIndexes = {};
      
      // Batch processing variables
      const batchSize = 1000000; // Larger batch size for efficiency
      let batch = [];
      let totalProcessed = 0;
      let lineCount = 0;
      
      // Calculate optimal number of worker threads (1 per CPU core but not more than 4)
      const numWorkers = Math.min(os.cpus().length, 4);
      console.log(`Using ${numWorkers} worker threads for parsing...`);
      
      // Create worker pool
      const workerPool = [];
      for (let i = 0; i < numWorkers; i++) {
        workerPool.push(new Worker(new URL(import.meta.url)));
      }
      
      // Process lines in batches
      const lineBatches = [];
      let currentBatch = [];
      
      // Process the CSV file line by line
      for await (const line of rl) {
        lineCount++;
        
        // Skip empty lines
        if (!line.trim()) continue;
        
        // Process header
        if (!headerProcessed) {
          const headers = line.split(',');
          headers.forEach((header, index) => {
            columnIndexes[header.trim()] = index;
          });
          headerProcessed = true;
          console.log('CSV headers processed:', Object.keys(columnIndexes));
          continue;
        }
        
        // Parse CSV line with handling for quoted fields
        let columns = [];
        let insideQuotes = false;
        let currentValue = '';
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            columns.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        columns.push(currentValue);
        
        // Add to current line batch
        currentBatch.push(columns);
        
        // When current batch is full, add to lineBatches and start a new batch
        if (currentBatch.length >= batchSize) {
          lineBatches.push(currentBatch);
          currentBatch = [];
          
          // Show progress
          if (lineCount % 100000 === 0) {
            console.log(`Read ${lineCount} lines so far...`);
          }
        }
      }
      
      // Add the last batch if not empty
      if (currentBatch.length > 0) {
        lineBatches.push(currentBatch);
      }
      
      console.log(`CSV file read complete. Total lines: ${lineCount}`);
      console.log(`Distributing processing across ${numWorkers} workers...`);
      
      // Process batches using worker threads
      for (let i = 0; i < lineBatches.length; i++) {
        const batch = lineBatches[i];
        console.log(`Processing batch ${i+1}/${lineBatches.length} (${batch.length} lines)...`);
        
        // Distribute batches to worker threads
        const workerPromises = [];
        const batchSize = Math.ceil(batch.length / numWorkers);
        
        for (let w = 0; w < numWorkers; w++) {
          const start = w * batchSize;
          const end = Math.min(start + batchSize, batch.length);
          const workerBatch = batch.slice(start, end);
          
          if (workerBatch.length === 0) continue;
          
          const promise = new Promise((resolve) => {
            workerPool[w].postMessage({ 
              puzzles: workerBatch, 
              columnIndexes 
            });
            
            workerPool[w].once('message', (processedPuzzles) => {
              resolve(processedPuzzles);
            });
          });
          
          workerPromises.push(promise);
        }
        
        // Wait for all workers to finish
        const results = await Promise.all(workerPromises);
        
        // Flatten results from all workers
        const processedBatch = results.flat();
        
        // Insert batch to MongoDB
        console.log(`Inserting batch of ${processedBatch.length} puzzles...`);
        await Puzzle.insertMany(processedBatch, { ordered: false });
        
        totalProcessed += processedBatch.length;
        console.log(`Progress: ${totalProcessed} puzzles imported (${((totalProcessed / (lineCount - 1)) * 100).toFixed(2)}%)`);
      }
      
      // Clean up workers
      for (const worker of workerPool) {
        worker.terminate();
      }
      
      console.log(`Import completed. Total puzzles imported: ${totalProcessed}`);
      process.exit(0);
    } catch (error) {
      console.error('Error importing puzzles:', error);
      process.exit(1);
    }
  };

  // Helper function to prompt for yes/no in the console
  function promptYesNo(question) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question(question, (answer) => {
        readline.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }
} 