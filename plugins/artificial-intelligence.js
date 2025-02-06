const { command, isPrivate, getJson } = require("@lib");
const { gemini, groq, meta, llama, dalle, gpt, hakiu, nikka, claude } = require("@func");



command(
    {
        pattern: "meta-ai",
        desc: "Gets response from meta AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await meta(query);
            await message.fek(msg.key, res)
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
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
            return await message.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await gemini(query);
            await message.fek(msg.key, res)
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
command(
    {
        pattern: "groq",
        desc: "Gets response from Groq AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await groq(query);
            await message.fek(msg.key, res);
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
command(
    {
        pattern: "llama",
        desc: "Gets response from lama AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await llama(query);
            await message.fek(msg.key, res)
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);

command(
    {
        pattern: "dalle",
        desc: "Generates an image using DALL·E AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match) => {
        const prompt = match.trim();
        if (!prompt) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, please provide a prompt for the image.`);
        }
        try {
            await message.react("⏳️");
            const res = await dalle(prompt)
            await message.sendFromUrl(res);
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while generating the image. Please try again later.");
            console.error(error);
        }
    }
);
command(
    {
        pattern: "gpt",
        desc: "Gets response from GPT-4o",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const userId = m.sender.split('@')[0]; 
            const res = await gpt(query, userId)
            await message.fek(msg.key, res);
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
command(
    {
        pattern: "claude",
        desc: "Gets response from claude ai",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const userId = m.sender.split('@')[0]; 
            const res = await claude(query, userId)
            await message.fek(msg.key, res);
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
command(
    {
        pattern: "hakiu",
        desc: "Gets response from claude hakiu ai",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const userId = m.sender.split('@')[0]; 
            const res = await hakiu(query, userId)
            await message.fek(msg.key, res);
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
command(
    {
        pattern: "nikka",
        desc: "Gets response from nikka AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, im nikka, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await nikka(query);
            await message.fek(msg.key, res);
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
