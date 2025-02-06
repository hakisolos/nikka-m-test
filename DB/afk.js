const fs = require('fs');
const path = require('path');

const store = path.join('store', 'afk.json');

async function getAfkMessage() {
  if (!fs.existsSync(store)) {
    fs.writeFileSync(store, JSON.stringify({ message: null, timestamp: null }));
  }
  const data = JSON.parse(fs.readFileSync(store, 'utf8'));
  if (data.message && data.timestamp) {
    return { message: data.message, timestamp: data.timestamp };
  }
  return null;
}

const setAfkMessage = async (afkMessage, timestamp) => {
  if (!fs.existsSync(store)) {
    fs.writeFileSync(store, JSON.stringify({ message: null, timestamp: null }));
  }
  const data = { message: afkMessage, timestamp };
  fs.writeFileSync(store, JSON.stringify(data, null, 2));
  return data;
};

const delAfkMessage = async () => {
  if (!fs.existsSync(store)) {
    fs.writeFileSync(store, JSON.stringify({ message: null, timestamp: null }));
  }
  const data = { message: null, timestamp: null };
  fs.writeFileSync(store, JSON.stringify(data, null, 2));
};

module.exports = { getAfkMessage, setAfkMessage, delAfkMessage };
