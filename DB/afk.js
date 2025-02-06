const fs = require('fs');
const path = require('path');

const storeDir = path.join(__dirname, 'store'); // Ensure absolute path
const storeFile = path.join(storeDir, 'afk.json'); // Full path to afk.json

// Ensure the 'store' directory and 'afk.json' exist
function ensureFileExists() {
  try {
    if (!fs.existsSync(storeDir)) {
      fs.mkdirSync(storeDir, { recursive: true }); // Create 'store' directory
    }

    if (!fs.existsSync(storeFile)) {
      fs.writeFileSync(storeFile, JSON.stringify({ message: null, timestamp: null }, null, 2));
    }
  } catch (error) {
    console.error("Error ensuring afk.json exists:", error);
  }
}

async function getAfkMessage() {
  ensureFileExists();
  const data = JSON.parse(fs.readFileSync(storeFile, 'utf8'));
  return data.message && data.timestamp ? data : null;
}

const setAfkMessage = async (afkMessage, timestamp) => {
  ensureFileExists();
  const data = { message: afkMessage, timestamp };
  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
  return data;
};

const delAfkMessage = async () => {
  ensureFileExists();
  fs.writeFileSync(storeFile, JSON.stringify({ message: null, timestamp: null }, null, 2));
};

module.exports = { getAfkMessage, setAfkMessage, delAfkMessage };
