# Knightly - Chess Puzzle App

Knightly is a mobile chess puzzle application that helps users improve their chess skills through daily puzzles. This monorepo contains both the server and mobile application code.

## Project Structure

- `/server` - Express.js API server with MongoDB for puzzle data and user management
- `/mobile` - React Native mobile app with Expo

## Features

- **User Authentication**
  - Email/password registration and login
  - Google OAuth integration
  - Guest user support
  - User profile management

- **Chess Puzzles**
  - Puzzles sourced from Lichess database
  - Puzzle filtering by theme, difficulty, and rating
  - Pagination for efficient data loading
  - Puzzle statistics and analytics

- **User Progress**
  - Progress tracking and statistics
  - Streak tracking for daily puzzles
  - Rating system based on puzzle performance

## Quick Start Guide

### Prerequisites

- Node.js (v14+)
- MongoDB
- Expo CLI (for mobile development)

### Server Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   # Server Configuration
   PORT=5000
   
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/knightly
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Client Application URL (for redirect)
   CLIENT_URL=http://localhost:19006  # Use 19006 for web version
   ```

4. Import puzzles to MongoDB:
   - Place the puzzle CSV file in the `data` folder (note: the file can be large, up to 5 million puzzles)
   - Run one of these commands based on your dataset size:

   ```
   # Standard import for smaller datasets
   node src/utils/importPuzzles.js
   
   # Optimized import for large datasets (5+ million puzzles)
   node src/utils/optimizedImport.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Mobile App Setup

1. Navigate to the mobile directory:
   ```
   cd mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the mobile directory with the following variables:
   ```
   # API Base URL (required)
   EXPO_PUBLIC_API_URL=http://localhost:5000/api
   
   # Google OAuth Credentials (required for Google Sign-In)
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   
   # Expo app scheme for deep linking (used for OAuth flows)
   EXPO_PUBLIC_SCHEME=knightly
   ```

4. Choose how to run the app:

   **For Web Browser:**
   ```
   npm run web
   ```
   This will open your app in a web browser at http://localhost:19006

   **For Mobile Emulator/Simulator:**
   ```
   npx expo start
   ```
   
   **For Physical Device:**
   - Find your computer's IP address:
     ```
     # On Linux/Mac
     ifconfig
     
     # On Windows
     ipconfig
     ```
   - Update your mobile app's `.env` file:
     ```
     EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:5000/api
     ```
   - Make sure your phone and computer are on the same network
   - Run `npm start` and scan the QR code with your phone's camera or Expo Go app

## Environment Variables

### Server Environment Variables

1. **PORT**: The port number your server will listen on.

2. **MONGO_URI**: MongoDB connection string. Format: `mongodb://username:password@host:port/database`
   - For local development: `mongodb://localhost:27017/knightly`
   - For production: Your MongoDB Atlas or other hosted MongoDB URI

3. **JWT_SECRET**: Secret key used to sign JWT tokens. This should be a strong, unique secret in production.

4. **GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET**: Required for Google OAuth integration. Obtain these from the Google Developer Console.

5. **CLIENT_URL**: The URL where your client application is running. For Expo, this is typically `http://localhost:19006` when running the web version.

Server environment variables are loaded automatically using `dotenv` at application startup:

```javascript
import dotenv from 'dotenv';
dotenv.config();

// Then access anywhere as:
const port = process.env.PORT || 5000;
```

### Mobile Environment Variables

1. **EXPO_PUBLIC_API_URL**: This should point to your server's API endpoint.
   - For local web development: `http://localhost:5000/api`
   - For emulator/simulator: Platform-specific values (Android emulator uses `10.0.2.2` instead of `localhost`)
   - For physical devices: Use your computer's actual IP address like `http://192.168.1.100:5000/api`

2. **EXPO_PUBLIC_GOOGLE_CLIENT_ID**: Obtain this from the Google Developer Console. Required for Google Sign-in.

3. **EXPO_PUBLIC_SCHEME**: Used for OAuth deep linking. Should match the `scheme` value in your `app.json`.

Environment variables are imported in the mobile app services as follows:

```javascript
// In modern Expo projects:
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// If using react-native-dotenv:
import { EXPO_PUBLIC_API_URL } from '@env';
const API_URL = EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
```

## API Documentation

The server exposes several RESTful endpoints:

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

## Troubleshooting

- **API Connection Issues**: If your app can't connect to the server, check that:
  - Server is running
  - IP addresses are correct
  - Your phone and computer are on the same network
  - No firewalls are blocking the connection

- **Backend URL Issue**: When running on a physical device, `localhost` resolves to the phone's local IP, not your computer. Use your computer's actual IP address in the `.env` file.

- **Database Import Issues**: For large datasets (5+ million puzzles):
  - Use the optimized import script `optimizedImport.js`
  - Ensure you have sufficient RAM available
  - The import process uses worker threads to speed up processing

- **Environment Variables Issues**:
  - If you get errors about undefined environment variables, make sure you've:
    - Created the `.env` file in the correct location
    - Installed `react-native-dotenv` (if using it)
    - Configured the plugin in `babel.config.js` (if required)
    - Restarted your Metro bundler
  - After changing environment variables, you may need to:
    - Stop and restart the Expo server
    - Run `expo start -c` to clear the cache

## Security Considerations

- Never commit your `.env` files to version control
- Use different JWT secrets for development and production
- Use long, random values for JWT_SECRET in production
- Consider using a secrets management service for production deployments

## Technologies Used

### Server

- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for OAuth strategies
- ES Modules

### Mobile

- React Native
- Expo
- React Navigation
- Chess.js for chess logic
- Axios for API communication
- AsyncStorage for local data persistence

## License

MIT
