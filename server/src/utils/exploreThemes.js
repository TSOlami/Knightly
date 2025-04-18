import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Puzzle from '../models/Puzzle.js';

// Configure environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/knightly')
  .then(() => {
    console.log('Connected to MongoDB');
    exploreThemes();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Function to explore themes
const exploreThemes = async () => {
  try {
    // Count total puzzles
    const totalPuzzles = await Puzzle.countDocuments();
    console.log(`Total puzzles in database: ${totalPuzzles}`);
    
    // Sample a puzzle to see its structure
    const samplePuzzle = await Puzzle.findOne();
    console.log('Sample puzzle structure:');
    console.log(JSON.stringify(samplePuzzle, null, 2));
    
    // Get all unique themes
    const themes = await Puzzle.distinct('themes');
    console.log(`\nFound ${themes.length} unique themes in the database`);
    
    // For each theme, get the count of puzzles
    const themeCounts = await Puzzle.aggregate([
      { $unwind: '$themes' },
      { $group: { _id: '$themes', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Display top 20 themes
    console.log('\nTop 20 themes by puzzle count:');
    themeCounts.slice(0, 20).forEach((theme, index) => {
      console.log(`${index + 1}. ${theme._id}: ${theme.count} puzzles`);
    });
    
    // Check if theme field exists and is an array
    const nonArrayThemes = await Puzzle.countDocuments({
      $or: [
        { themes: { $exists: false } },
        { themes: { $not: { $type: 'array' } } }
      ]
    });
    
    console.log(`\nPuzzles without themes array: ${nonArrayThemes}`);
    
    // Check for empty themes arrays
    const emptyThemes = await Puzzle.countDocuments({ themes: { $size: 0 } });
    console.log(`Puzzles with empty themes array: ${emptyThemes}`);
    
    // Look for fields that might contain theme information with different names
    const allFields = Object.keys(samplePuzzle._doc).filter(key => !['_id', '__v'].includes(key));
    console.log('\nAll fields in puzzle documents:');
    console.log(allFields);
    
    // Exit the process
    console.log('\nExploration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error exploring themes:', error);
    process.exit(1);
  }
}; 