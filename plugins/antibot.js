const { isAntiBotEnabled, enableAntiBot, disableAntiBot } = require('../DB/antibot.js);

command(
    {
        pattern: "antibot",
        desc: "Toggle AntiBot protection",
        fromMe: true, // Only owner can use
    },
    async (message, match) => {
        if (!message.isOwner) return;

        const chatJid = message.jid;
        const isEnabled = await isAntiBotEnabled(chatJid);

        const response = isEnabled ? await disableAntiBot(chatJid) : await enableAntiBot(chatJid);
        await message.reply(response);
    }
);
