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
