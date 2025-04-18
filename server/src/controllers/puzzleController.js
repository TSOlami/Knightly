import Puzzle from '../models/Puzzle.js';

// Get puzzles with pagination and filters
export const getPuzzles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      theme,
      difficulty,
      rating_min,
      rating_max,
      ordering = 'rating'
    } = req.query;
    
    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Build query object
    const query = {};
    
    // Apply filters if provided
    if (theme) {
      query.themes = theme;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (rating_min || rating_max) {
      query.rating = {};
      if (rating_min) query.rating.$gte = parseInt(rating_min);
      if (rating_max) query.rating.$lte = parseInt(rating_max);
    }
    
    // Determine sorting order
    let sort = {};
    
    // Handle different ordering options
    switch (ordering) {
      case 'rating':
        sort = { rating: 1 };
        break;
      case '-rating':
        sort = { rating: -1 };
        break;
      case 'popularity':
        sort = { popularity: -1 };
        break;
      case 'plays':
        sort = { nbPlays: -1 };
        break;
      default:
        sort = { rating: 1 };
    }
    
    // Get total count for pagination
    const total = await Puzzle.countDocuments(query);
    
    // Retrieve puzzles
    const puzzles = await Puzzle.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    // Get available themes from puzzles
    const availableThemes = await Puzzle.distinct('themes');
    
    // Get available difficulties from puzzles
    const availableDifficulties = await Puzzle.distinct('difficulty');
    
    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      total_pages: Math.ceil(total / limitNum),
      filters: {
        themes: availableThemes,
        difficulties: availableDifficulties,
      },
      puzzles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get puzzle categories (themes)
export const getThemes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30; // Default to 30 themes, or use query parameter
    
    // Get themes with counts, sorted by popularity
    const themes = await Puzzle.aggregate([
      { $unwind: '$themes' },
      { $group: { _id: '$themes', count: { $sum: 1 } } },
      { $match: { count: { $gt: 50 } } }, // Only include themes with more than 50 puzzles
      { $sort: { count: -1 } },
      { $limit: limit } // Limit to avoid overwhelming the client
    ]);
    
    // Map to the format expected by the client
    const formattedThemes = themes.map(theme => ({
      id: theme._id,
      name: theme._id,
      count: theme.count,
    }));
    
    res.json(formattedThemes);
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get puzzle categories (openings)
export const getOpenings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30; // Default to 30 openings

    const openings = await Puzzle.aggregate([
      { $unwind: '$openingTags' },
      { $group: { _id: '$openingTags', count: { $sum: 1 } } },
      { $match: { count: { $gt: 20 } } }, // Only include openings with more than 20 puzzles
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    
    res.json(openings.map(opening => ({
      id: opening._id,
      name: opening._id,
      count: opening.count,
    })));
  } catch (error) {
    console.error('Error fetching openings:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get puzzle statistics
export const getPuzzleStats = async (req, res) => {
  try {
    const stats = {
      totalPuzzles: await Puzzle.countDocuments(),
      byDifficulty: {},
      byTheme: {},
      ratingDistribution: {
        beginner: await Puzzle.countDocuments({ rating: { $lt: 1200 } }),
        intermediate: await Puzzle.countDocuments({ rating: { $gte: 1200, $lt: 1600 } }),
        advanced: await Puzzle.countDocuments({ rating: { $gte: 1600, $lt: 2000 } }),
        expert: await Puzzle.countDocuments({ rating: { $gte: 2000 } }),
      },
    };
    
    // Get puzzle counts by difficulty
    const difficulties = await Puzzle.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    ]);
    
    difficulties.forEach(difficulty => {
      if (difficulty._id) {
        stats.byDifficulty[difficulty._id] = difficulty.count;
      }
    });
    
    // Get top themes
    const themes = await Puzzle.aggregate([
      { $unwind: '$themes' },
      { $group: { _id: '$themes', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    
    themes.forEach(theme => {
      stats.byTheme[theme._id] = theme.count;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific puzzle by ID
export const getPuzzleById = async (req, res) => {
  try {
    const { puzzleId } = req.params;
    
    const puzzle = await Puzzle.findOne({ puzzleId });
    
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }
    
    // Increment play count
    await Puzzle.findByIdAndUpdate(puzzle._id, { $inc: { nbPlays: 1 } });
    
    res.json(puzzle);
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    res.status(500).json({ message: error.message });
  }
}; 