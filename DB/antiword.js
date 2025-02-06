const fs = require('fs');
const path = require('path');

const storeDir = path.join(__dirname, 'store');
const storeFile = path.join(storeDir, 'antiword.json');

if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });
if (!fs.existsSync(storeFile)) fs.writeFileSync(storeFile, JSON.stringify([]));

const readDB = () => JSON.parse(fs.readFileSync(storeFile, 'utf8'));
const writeDB = (data) => fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));

async function setAntiWordStatus(jid, action) {
  if (!jid) return;
  const db = readDB();
  let record = db.find((item) => item.jid === jid);

  if (!record) {
    record = { jid, status: action, words: [] };
    db.push(record);
  } else {
    record.status = action;
  }

  writeDB(db);
  return { success: true, message: `Antiword ${action ? 'enabled' : 'disabled'} for group ${jid}` };
}

async function addAntiWords(jid, words) {
  if (!jid || !words) return;
  const db = readDB();
  let record = db.find((item) => item.jid === jid);

  if (!record) {
    record = { jid, status: false, words };
    db.push(record);
  } else {
    record.words = [...new Set([...record.words, ...words])];
  }

  writeDB(db);
  return { success: true, message: `Added ${words.length} antiwords to group ${jid}`, addedWords: words };
}

async function removeAntiWords(jid, words) {
  if (!jid) return;
  const db = readDB();
  const record = db.find((item) => item.jid === jid);

  if (!record) return { success: false, message: `No antiwords found for group ${jid}` };

  record.words = record.words.filter((word) => !words.includes(word));
  writeDB(db);
  return { success: true, message: `Removed ${words.length} antiwords from group ${jid}`, removedWords: words };
}

async function getAntiWords(jid) {
  if (!jid) return;
  const db = readDB();
  const record = db.find((item) => item.jid === jid);

  return record ? { success: true, status: record.status, words: record.words } : { success: true, status: false, words: [] };
}

async function isAntiWordEnabled(jid) {
  if (!jid) return;
  const db = readDB();
  const record = db.find((item) => item.jid === jid);
  return record ? record.status : false;
}

module.exports = { setAntiWordStatus, addAntiWords, removeAntiWords, getAntiWords, isAntiWordEnabled };
