/*
const fs = require('fs');
const path = require('path');
const { command } = require("../lib");

const storePath = path.join(__dirname, 'sticker_cmds.json');

// Ensure JSON file exists
if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({}));
}

// Read and write functions
const readDB = () => JSON.parse(fs.readFileSync(storePath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(storePath, JSON.stringify(data, null, 2));

// Set Sticker Command
async function setStickerCommand(stickerSha, command) {
    const data = readDB();
    data[stickerSha] = `.${command}`;  // Save with a prefix like .ping
    writeDB(data);
    return { stickerSha, command };
}

// Get Sticker Command
async function getStickerCommand(stickerSha) {
    const data = readDB();
    return data[stickerSha] || null;
}

// Delete Sticker Command
async function delStickerCommand(stickerSha) {
    const data = readDB();
    if (data[stickerSha]) {
        delete data[stickerSha];
        writeDB(data);
        return true;
    }
    return false;
}

// Command to set a sticker command
command(
    {
        pattern: "setcmd",
        desc: "Set a sticker command",
        fromMe: true,
        type: "sticker",
    },
    async (message, match, m) => {
        if (!m.quoted || m.quoted.mtype !== "stickerMessage")
            return await message.reply("Reply to a sticker with `.setcmd <command>`");

        if (!match) return await message.reply("Provide a command name!");

        const stickerSha = m.quoted.message.stickerMessage.fileSha256.toString('base64');
        await setStickerCommand(stickerSha, match);

        await message.reply(`✅ Sticker command set! Now sending this sticker will trigger \`.${match}\``);
    }
);

// Command to trigger when a sticker is sent
command(
    {
        on: "sticker",
        fromMe: false,
    },
    async (message, m, client) => {
        if (message.mtype !== "stickerMessage") return;

        const stickerSha = message.message.stickerMessage.fileSha256.toString('base64');
        const command = await getStickerCommand(stickerSha);

        if (command) {
            // Simulate the command execution as if the user typed it
            message.text = command;
            return command({ pattern: command.replace('.', ''), fromMe: false }, message, "", client);
        }
    }
);


*/