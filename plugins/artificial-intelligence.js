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

command(
    {
        pattern: "gemini",
        desc: "Gets response from Gemini AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await m.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const apiUrl = `https://nikka-api.us.kg/ai/gemini?q=${encodeURIComponent(query)}&apiKey=nikka`;
            const res = await getJson(apiUrl);

            if (!res || !res.response) {
                throw new Error("Invalid response from API");
            }

            const ai = res.response;
            await message.fek(msg.key, ai)
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
