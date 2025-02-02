const fs = require('fs');
const { command } = require("../lib");

// Path to the JSON file
const jsonFilePath = './DB/antibotStatus.json';

// Helper function to check if the JSON file exists, and if not, create it
const createJSONFileIfNotExists = () => {
    if (!fs.existsSync(jsonFilePath)) {
        // If the file does not exist, create a new one with an empty object
        fs.writeFileSync(jsonFilePath, JSON.stringify({}, null, 2));
    }
};

// Helper function to get AntiBot status from the JSON file
const getAntiBotStatus = (chatJid) => {
    createJSONFileIfNotExists();
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    return data[chatJid] || null;
};

// Helper function to set AntiBot status in the JSON file
const setAntiBotStatus = (chatJid, action) => {
    createJSONFileIfNotExists();
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    data[chatJid] = { action: action };
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
};

command(
    {
        pattern: "antibot",
        desc: "Manage AntiBot protection (kick, delete, off)",
        fromMe: true,
        type: "group"
    },
    async (message, match, m) => {
        if (!m.isGroup) return await message.reply("❌ ɢʀᴏᴜᴘ ᴏɴʟʏ");

        const chatJid = message.jid;
        const action = match.trim().toLowerCase();

        if (['kick', 'delete', 'off'].includes(action)) {
            await setAntiBotStatus(chatJid, action);
            await message.reply(`✅ ᴀɴᴛɪʙᴏᴛ ғᴏʀ ᴄᴜʀʀᴇɴᴛ ɢʀᴏᴜᴘ sᴇᴛ ᴛᴏ  *${action.toUpperCase()}`);
        } else {
            await message.reply("❌ Invalid option! Use `.antibot kick`, `.antibot delete`, or `.antibot off`.");
        }
    }
);

command(
    {
        on: "text",
    },
    async (message, m) => {
        const chatJid = message.jid;
        const msgId = message.key.id;

        const antibotStatus = await getAntiBotStatus(chatJid);

        if (!antibotStatus || antibotStatus.action === 'off') return;

        if (msgId.startsWith("3EB")) {
            if (antibotStatus.action === 'delete') {
                await message.reply("🚨 ᴀɴᴛɪʙᴏᴛ ᴅᴇᴛᴇᴄᴛᴇᴅ !, ᴍᴇssᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ.");
                await message.client.sendMessage(message.jid, { delete: message.key });
            } else if (antibotStatus.action === 'kick') {
                const user = m.sender;
                await message.reply(`🚨 *ᴀɴᴛɪʙᴏᴛ ᴅᴇᴛᴇᴄᴛᴇᴅ* ${user} ᴋɪᴄᴋᴇᴅ.`);
                await message.client.groupParticipantsUpdate(message.jid, [user], "remove");
            }
        }
    }
);
