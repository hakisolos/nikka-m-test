/*const { isAntiBotEnabled, enableAntiBot, disableAntiBot } = require('../DB/antibot.js');
const { command } = require("../lib");

command(
    {
        pattern: "antibot",
        desc: "Toggle AntiBot protection",
        fromMe: true,
        type: "group"// Only owner can use
    },
    async (message, match, m) => {
        if (!message.isOwner) return;
        if (!m.isGroup) return await message.reply("❌ This command can only be used in groups.");

        const chatJid = message.jid;
        const isEnabled = await isAntiBotEnabled(chatJid);

        const response = isEnabled ? await disableAntiBot(chatJid) : await enableAntiBot(chatJid);
        await message.reply(response);
    }
);




command(
    {
        on: "text", // Listen to all text messages (better reliability)
    },
    async (message, m) => {
        const chatJid = message.jid;
        const isEnabled = await isAntiBotEnabled(chatJid);

        if (!isEnabled || message.isOwner) return; // Skip if disabled or owner

        const msgId = message.key.id; // Correct way to get message ID
        const device = getDevice(msgId); // Get sender's device

        console.log(`📢 Message ID: ${msgId}, Device: ${device}`); // Debugging log

        if ((device === "web" || device === "unknown") && !msgId.startsWith("HAKI")) {
            await message.reply("🚨 *Only NIKKA allowed!*");
        }
    }
);
*/

const { command } = require("../lib");

command(
    {
        pattern: "antibot",
        desc: "AntiBot is always enabled!",
        fromMe: true,
        type: "group" // Only owner can use
    },
    async (message, match, m) => {
        if (!message.isOwner) return;
        await message.reply("✅ *AntiBot protection is always enabled!*");
    }
);

command(
    {
        on: "text", // Listen to all text messages
    },
    async (message, m) => {
        if (message.isOwner) return; // Skip if owner

        const msgId = message.key.id; // Get message ID
        const device = getDevice(msgId); // Get sender's device

        console.log(`📢 Message ID: ${msgId}, Device: ${device}`); // Debug log

        if ((device === "web" || device === "unknown") && !msgId.startsWith("HAKI")) {
            await message.reply("🚨 *Only NIKKA allowed!*");
        }
    }
);
