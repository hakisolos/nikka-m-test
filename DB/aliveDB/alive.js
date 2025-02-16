const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "aliveDB.json");

// Load database
const loadDB = () => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({
            aliveMessage: "ʜᴇʏ ... ɴɪᴋᴋᴀ ɪs ᴀʟɪᴠᴇ, ᴛᴏ sᴇᴛ ᴄᴜsᴛᴏᴍ ᴀʟɪᴠᴇ ᴍᴇssᴀɢᴇ ᴛʏᴘᴇ .alive set <message>\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴɪᴋᴋᴀ ᴛᴇᴄʜ"
        }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
};

// Get the alive message
const getAlive = () => {
    const db = loadDB();
    return db.aliveMessage;
};

// Edit the alive message
const editAlive = (newMessage) => {
    const db = loadDB();
    db.aliveMessage = newMessage;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return true;
};

// Reset to default alive message
const resetAlive = () => {
    return editAlive("ʜᴇʏ ... ɴɪᴋᴋᴀ ɪs ᴀʟɪᴠᴇ, ᴛᴏ sᴇᴛ ᴄᴜsᴛᴏᴍ ᴀʟɪᴠᴇ ᴍᴇssᴀɢᴇ ᴛʏᴘᴇ .\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴɪᴋᴋᴀ ᴛᴇᴄʜ");
};

module.exports = { getAlive, editAlive, resetAlive };
