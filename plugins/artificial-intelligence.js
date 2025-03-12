const { command, isPrivate } = require("@lib");
const { gemini, maths, you, groq, meta,  flux, blackbox, llama, dalle, gpt, hakiu, nikka, claude, jeevs, shaka } = require("@ai");

const fetch = require("node-fetch");
const {tiny} = require("../lib/fancy_font/fancy");
async function sendJsonToApi(jsonPayload) {
    try {
        const res = await fetch("https://fastrestapis.fasturl.cloud/aillm/gemini/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonPayload),
        });

        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error sending JSON to API:", error);
        throw new Error("Failed to send JSON to API.");
    }
}

command(
    {
        pattern: "shanky",
        fromMe: true,
        desc: "Reply to a media message (sticker, image) to upload it and send a query to the API.",
        type: "ai",
    },
    async (message, match) => {
        if (!message.reply_message)
            return await message.reply("*_Reply to a media message to upload it_*");

        try {
            const uploadedUrl = await message.upload(message.reply_message);

            if (!uploadedUrl) {
                return await message.reply("*_Failed to upload the media file._*");
            }

            const jsonPayload = {
                ask: match,
                image: uploadedUrl,
            };

            const apiResponse = await sendJsonToApi(jsonPayload);

            if (apiResponse.status === 200) {
                await message.reply(tiny(`${apiResponse.result}`));
            } else {
                await message.reply(`*_API Error: ${apiResponse.content}_*`);
            }
        } catch (error) {
            console.error('[ERROR]', error);
            await message.reply("*_An error occurred while processing your request._*");
        }
    }
);



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
        pattern: "shaka",
        desc: "Gets response from shaka AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, im shaka, how can I help you?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await shaka(query);
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

command(
    {
        pattern: "jeevs",
        desc: "Gets response from jeevs AI",
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
            const res = await jeevs(query);
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
        pattern: "maths",
        desc: "Gets response from math AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, what maths would you like me to solve?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await maths(query);
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
        pattern: "flux",
        desc: "Generates an image using flux AI",
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
            const res = await flux(prompt)
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
        pattern: "blackbox",
        desc: "Gets response from blackbox AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can i help?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await blackbox(query);
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
        pattern: "you-ai",
        desc: "Gets response from blackbox AI",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match, m) => {
        const query = match.trim();
        if (!query) {
            await message.react("❌️");
            return await message.reply(`Hello ${message.pushName}, how can i help?`);
        }
        try {
            await message.react("⏳️");
            const msg = await message.client.sendMessage(message.jid, { text: "Thinking..." });
            const res = await you(query);
            await message.fek(msg.key, res);
            await message.react("");
        } catch (error) {
            await message.react("❌️");
            await message.reply("An error occurred while processing your request. Please try again later.");
            console.error(error);
        }
    }
);
