const fs = require('fs');
const https = require('https');
const path = require('path');

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, '../../assets/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Sound URLs
const sounds = {
  'move.mp3': 'https://github.com/lichess-org/lila/raw/master/public/sound/standard/Move.mp3',
  'capture.mp3': 'https://github.com/lichess-org/lila/raw/master/public/sound/standard/Capture.mp3',
  'check.mp3': 'https://github.com/lichess-org/lila/raw/master/public/sound/standard/Check.mp3',
  'complete.mp3': 'https://github.com/lichess-org/lila/raw/master/public/sound/standard/GenericNotify.mp3',
  'error.mp3': 'https://github.com/lichess-org/lila/raw/master/public/sound/standard/Error.mp3',
};

// Download a file
const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete file on error
      reject(err);
    });
  });
};

// Download all sounds
const downloadSounds = async () => {
  console.log('Downloading sound files...');
  const promises = Object.entries(sounds).map(([fileName, url]) => {
    const filePath = path.join(soundsDir, fileName);
    return downloadFile(url, filePath);
  });

  try {
    await Promise.all(promises);
    console.log('All sound files downloaded successfully!');
  } catch (error) {
    console.error('Error downloading sound files:', error);
  }
};

// Run the download
downloadSounds(); 