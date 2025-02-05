const { command, isPrivate, getJson } = require("../lib");
command(
    {
        pattern: "metaai",
        desc: "response from meta ai",
        fromMe: true,
        type: "ai",
    },
    async (message, match) => {
        await message.react("⏳️");
        try {
            
            let query = match?.trim() || message.reply_message?.text;
            const name = message.pushName;

            if (!query) {
                return await message.send(`Hey ${name}, how can I help you?`);
            }

            const apiUrl = `https://apii.ambalzz.biz.id/api/openai/meta-ai?ask=${encodeURIComponent(query)}`;
            const resp = await getJson(apiUrl);
            const res = resp?.r?.meta || "No response from API.";

            await message.send(res);
            await message.react("");
        } catch (error) {
            await message.send("An error occurred while processing your request.");
            await message.react("");
            console.error(error);
        }
    }
);
