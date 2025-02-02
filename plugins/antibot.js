const { isAntiBotEnabled, enableAntiBot, disableAntiBot } = require('../DB/antibot.js');
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
        on: "text",
    },
    async (message, m) => {
        const chatJid = message.jid;
        const senderId = message.id;
        const isEnabled = await isAntiBotEnabled(chatJid);

        if (!isEnabled || message.isOwner) return; // Skip if disabled or owner

        const device = getDevice(message.key.id); // Get sender's device

        if (device === "web" || device === "unknown") {
            if (!senderId.startsWith("HAKI")) {
              //  await message.groupRemove(chatJid, [senderId]); // Remove user
                await message.reply(`🚨 *Removed* ${senderId} for using an unauthorized device.`);
            }
        }
    }
);
