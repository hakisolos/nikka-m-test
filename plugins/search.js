const { command, getJson, isPrivate } = require("@lib");
const axios = require("axios");
const { unsplash, fetchPinterestImages, fetchPixabay, wiki } = require("@search");
command(
    {
        pattern: "gimage",
        desc: "Fetch images based on search query and optional index.",
        fromMe: isPrivate,
        type: "search",
    },
    async (message, match) => {
        await message.react("⏳");

        try {
            const parts = match.split(',');
            const searchQuery = parts[0].trim();
            const index = parts.length > 1 ? parseInt(parts[1].trim()) : null;

            const response = await axios.get('https://api.nikka.us.kg/search/googleimg?apiKey=nikka&q=' + encodeURIComponent(searchQuery));
            const images = response.data.images;

            if (Array.isArray(images) && images.length > 0) {
                if (!index) {
                    // Send only 5 images if no index is provided
                    let responseMessage = `Here are 5 images for **${searchQuery}**:\n`;
                    for (let i = 0; i < Math.min(5, images.length); i++) {
                        responseMessage += `**${i + 1}.** Image ${i + 1} 🖼️\n`;
                        await message.sendFromUrl(images[i]);
                    }
                } else {
                    if (isNaN(index) || index < 1 || index > images.length) {
                        await message.reply(`🚫 Invalid index. Please provide a valid number between **1** and **${images.length}**.`);
                    } else {
                        const imageUrl = images[index - 1];
                        await message.sendFromUrl(imageUrl);
                    }
                }

                await message.react("✅");
                setTimeout(() => message.react(""), 1000);
            } else {
                await message.reply("No images found for your search.");
                await message.react("❌");
            }
        } catch (error) {
            await message.reply("An error occurred while fetching the images. Please try again.");
            await message.react("❌");
        }
    }
);
command(
    {
        pattern: "news",
        desc: "Fetch news based on index, or all news if no index is provided.",
        fromMe: isPrivate,
        type: "search",
    },
    async (message, match) => {
        await message.react("⏳");

        try {
            const response = await axios.get('https://api.nikka.us.kg/search/news?apiKey=nikka');
            const news = response.data.results;

            if (Array.isArray(news) && news.length > 0) {
                let responseMessage = "";

                if (!match) {
                    responseMessage = "Here are the latest news titles:\n";
                    news.forEach((item, index) => {
                        responseMessage += `\n**${index + 1}.** ${item.title} 📢`;
                    });
                } else {
                    const index = parseInt(match.trim());

                    if (isNaN(index) || index < 1 || index > news.length) {
                        responseMessage = `🚫 Invalid index. Please provide a valid number between **1** and **${news.length}**.`;
                    } else {
                        const newsTitle = news[index - 1].title;
                        responseMessage = `**News ${index}:** ${newsTitle} 📢`;
                    }
                }

                await message.reply(responseMessage);
                await message.react("✅");
                setTimeout(() => message.react(""), 5000);
            } else {
                await message.reply("No news data available.");
                await message.react("❌");
            }
        } catch (error) {
            await message.reply("An error occurred while fetching the news. Please try again.");
            await message.react("❌");
        }
    }
);


command(
    {
        pattern: "unsplash",
        desc: "Fetch and send the first 5 images from Unsplash",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match) => {
      const name = message.pushName
      const prefix = message.prefix
      await message.react("⏳️");
        if (!match) {
          await message.react("❌️")
            return await message.reply(`Sorry ${name} Please provide a search term. Example: ${prefix}getimages car`);
            
        }
        await message.react("⏳️");

        const images = await unsplash(match);

        if (images.length > 0) {
            for (const url of images) {
                await message.sendFromUrl(url);
            }
            await message.react("")
        } else {
            await message.reply("No images found for your search.");
            await message.react("❌️")
        }
    }
);



command(
    {
        pattern: "pinterest",
        desc: "Fetch and send the first 5 Pinterest images",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match) => {
        const name = message.pushName;
        const prefix = message.prefix;
        await message.react("⏳️");

        if (!match) {
            await message.react("❌️");
            return await message.reply(`Sorry ${name}, please provide a search term. Example: ${prefix}pinterest arabic quotes`);
        }

        const images = await fetchPinterestImages(match);

        if (images === null) {
            await message.reply("An error occurred while fetching images. Please try again.");
            await message.react("⚠️");
            return;
        }

        if (images.length > 0) {
            for (const item of images) {
                await message.sendFromUrl(item.images_url);
            }
            await message.react("");
        } else {
            await message.reply("No images found for your search.");
            await message.react("❌️");
        }
    }
);




command(
    {
        pattern: "pixabay",
        desc: "Fetch and send the first 5 images from Pixabay",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match) => {
        const name = message.pushName;
        const prefix = message.prefix;
        
        await message.react("⏳️");

        if (!match) {
            await message.react("⏳️");
            return await message.reply(`Sorry ${name}, please provide a search term. Example: ${prefix}pixabay car`);
        }

        const images = await fetchPixabay(match);

        if (images.length > 0) {
            for (const url of images) {
                await message.sendFromUrl(url);
            }
            await message.react("✅");
        } else {
            await message.reply("No images found for your search.");
            await message.react("❌️");
        }
    }
);



command(
    {
        pattern: "wiki",
        desc: "Get Wikipedia data",
        fromMe: isPrivate,
        type: "search",
    },
    async (message, match) => {
        if (!match) {
            await message.react("❌️");
            return await message.reply("Please provide a search query.");
        }
        await message.react("⏳️");

        const result = await wiki(match);
        
        if (!result) {
            return await message.reply("No results found.");
        }

        const { text, image } = result;

        // Send image with caption
        await message.client.sendMessage(message.jid, {
            image: { url: image },
            caption: text
        });
        await message.react("");
    }
);
