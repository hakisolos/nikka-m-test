const fs = require("fs");
const path = require("path");
const { command } = require("../lib");

const dbPath = path.join(__dirname, "../DB/presense.json");

// Function to read the presence database
const readDB = () => {
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
};

// Function to write to the presence database
const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Presence toggle command
command(
    {
        pattern: "presence",
        desc: "Toggle presence status (typing, recording, off)",
        fromMe: true,
        type: "utility",
    },
    async (message, match) => {
        if (!match) return await message.reply("Usage: .presence <typing|recording|off>");

        const presenceTypes = ["typing", "recording", "off"];
        if (!presenceTypes.includes(match)) return await message.reply("Invalid option! Use: `typing`, `recording`, or `off`.");

        const data = readDB();
        const chatId = message.jid;

        if (match === "off") {
            // Remove chat from presence tracking
            if (data[chatId]) {
                delete data[chatId];
                writeDB(data);
                return await message.reply("Presence updates disabled for this chat.");
            } else {
                return await message.reply("Presence updates were not enabled in this chat.");
            }
        }

        // Store the presence mode for this chat
        data[chatId] = match;
        writeDB(data);
        await message.reply(`Presence set to *${match}* for this chat.`);
    }
);


command(
    {
        on: "text",
        dontAddCommandList: true,
    },
    async (message) => {
        const data = readDB();
        const chatId = message.jid;

        // Check if presence is enabled in this chat
        if (!data[chatId]) return;

        const presenceType = data[chatId]; // "typing" or "recording"

        // Send presence update
        await message.client.sendPresenceUpdate(
            presenceType === "typing" ? "composing" : "recording",
            chatId
        );
    }
);
