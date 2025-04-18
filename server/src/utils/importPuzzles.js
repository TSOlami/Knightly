import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Puzzle from '../models/Puzzle.js';

// Configure environment variables
dotenv.config();

// Get file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvFilePath = path.join(__dirname, '../../data/puzzles.csv');

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

// Function to import puzzles
const importPuzzles = async () => {
  try {
    // Check if puzzles already exist in the database
    const existingCount = await Puzzle.countDocuments();
    
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} puzzles. Skipping import.`);
      console.log('To reimport, drop the puzzles collection first.');
      process.exit(0);
    }
    
    console.log('Starting import process...');
    
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
    const batchSize = 1000;
    let batch = [];
    let totalProcessed = 0;
    
    // Process each line
    for await (const line of rl) {
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
      
      // Parse CSV line, handling potential commas within quoted fields
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
      
      // Create puzzle object
      const puzzleData = {
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
      
      // Add to batch
      batch.push(puzzleData);
      
      // Process batch when it reaches the batch size
      if (batch.length >= batchSize) {
        await Puzzle.insertMany(batch);
        totalProcessed += batch.length;
        console.log(`Processed ${totalProcessed} puzzles...`);
        batch = [];
      }
    }
    
    // Process any remaining puzzles
    if (batch.length > 0) {
      await Puzzle.insertMany(batch);
      totalProcessed += batch.length;
    }
    
    console.log(`Import completed. Total puzzles imported: ${totalProcessed}`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing puzzles:', error);
    process.exit(1);
  }
}; 