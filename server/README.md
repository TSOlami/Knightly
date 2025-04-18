# Knightly Chess Puzzle Server

This is a RESTful API server for the Knightly chess puzzle application. It provides endpoints for user authentication, puzzle retrieval, and user data management.

## Features

- User authentication with JWT (Email/Password and Google OAuth)
- Guest user support with conversion to regular accounts
- Puzzle retrieval with pagination and filtering
- User progress tracking
- User preferences management

## Prerequisites

- Node.js (v14+)
- MongoDB
- Chess puzzle dataset in CSV format

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/knightly
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:19000
   ```
4. Place the puzzle CSV file in the `data` folder (note: the file can be large, up to 5 million puzzles)
5. Import puzzles to MongoDB:
   ```
   # Standard import (for smaller datasets)
   node src/utils/importPuzzles.js
   
   # Optimized import for large datasets (5+ million puzzles)
   node src/utils/optimizedImport.js
   ```
6. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/guest` - Create a guest user account
- `GET /api/auth/google` - Initiate Google OAuth authentication
- `GET /api/auth/google/callback` - Google OAuth callback

### Users

- `GET /api/users/me` - Get current user data
- `PATCH /api/users/preferences` - Update user preferences
- `POST /api/users/solved-puzzle` - Mark a puzzle as solved
- `POST /api/users/convert-guest` - Convert guest user to regular account

### Puzzles

- `GET /api/puzzles` - Get puzzles with pagination and filtering
- `GET /api/puzzles/:puzzleId` - Get a specific puzzle by ID
- `GET /api/puzzles/categories/themes` - Get puzzle themes
- `GET /api/puzzles/categories/openings` - Get puzzle openings
- `GET /api/puzzles/stats/overview` - Get puzzle statistics

## License

MIT 