const fs = require('fs');
const path = require('path');

const storeDir = path.join(__dirname, 'store');
const antibotStore = path.join(storeDir, 'antibot.json');

// Ensure directory and file exist
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}
if (!fs.existsSync(antibotStore)) {
  fs.writeFileSync(antibotStore, JSON.stringify([]));
}

// Read and write functions
const readDB = () => JSON.parse(fs.readFileSync(antibotStore, 'utf8') || '[]');
const writeDB = (data) => fs.writeFileSync(antibotStore, JSON.stringify(data, null, 2));

// Set Antibot function
async function setAntibot(jid, enabled) {
  const data = readDB();
  const existingRecord = data.find((record) => record.jid === jid);

  if (existingRecord) {
    existingRecord.enabled = enabled;
  } else {
    data.push({ jid, enabled });
  }

  writeDB(data);
  return { jid, enabled };
}

// Delete Antibot function
async function delAntibot(jid) {
  const data = readDB();
  const filteredData = data.filter((record) => record.jid !== jid);
  writeDB(filteredData);
  return data.length !== filteredData.length;
}

// Get Antibot function
async function getAntibot(jid) {
  const data = readDB();
  const record = data.find((record) => record.jid === jid);
  return record ? record.enabled : false;
}

// Exporting functions
module.exports = { setAntibot, delAntibot, getAntibot };
