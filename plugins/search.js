const { command, getJson } = require("../lib");
const axios = require("axios");
command(
    {
        pattern: "ss",
        fromMe: true,
        desc: "Take a mobile screenshot of a website",
        type: "search",
    },
    async (message, match, client) => {
        if (!match) {
            return await message.reply("Please provide a website URL to screenshot.");
        }

        const url = match.trim();

        try {
            const screenshotUrl = `https://api.giftedtech.my.id/api/tools/ssphone?apikey=king_haki-k7gjd8@gifted_api&url=${encodeURIComponent(url)}`;
            await message.sendFromUrl(screenshotUrl, "> Powered by nikka botz");
        } catch (error) {
            await message.reply("Failed to generate screenshot. Please ensure the URL is correct or try again later.");
            console.error(error);
        }
    }
);

command(
    {
        pattern: "webss",
        fromMe: true,
        desc: "Take a pc screenshot of a website",
        type: "search",
    },
    async (message, match, client) => {
        if (!match) {
            return await message.reply("Please provide a website URL to screenshot.");
        }

        const url = match.trim();

        try {
            const screenshotUrl = `https://api.giftedtech.my.id/api/tools/sspc?apikey=king_haki-k7gjd8@gifted_api&url=${encodeURIComponent(url)}`;
            await message.sendFromUrl(screenshotUrl, "> Powered by nikka botz");
        } catch (error) {
            await message.reply("Failed to generate screenshot. Please ensure the URL is correct or try again later.");
            console.error(error);
        }
    }
);


command(
    {
        pattern: "tabss",
        fromMe: true,
        desc: "Take a tablet screenshot of a website",
        type: "search",
    },
    async (message, match, client) => {
        if (!match) {
            return await message.reply("Please provide a website URL to screenshot.");
        }

        const url = match.trim();

        try {
            const screenshotUrl = `https://api.giftedtech.my.id/api/tools/sstab?apikey=king_haki-k7gjd8@gifted_api&url=${encodeURIComponent(url)}`;
            await message.sendFromUrl(screenshotUrl, "> Powered by nikka botz");
        } catch (error) {
            await message.reply("Failed to generate screenshot. Please ensure the URL is correct or try again later.");
            console.error(error);
        }
    }
);
command(
  {
    pattern: "wiki",
    fromMe: true,
    desc: "Search Wikipedia and fetch article details",
    type: "search",
  },
  async (message, match) => {
    try {
      if (!match) {
        await message.react("❌️");
        return await message.reply("Please provide a search term.");
      }

      await message.react("⏳️");

      // Parse query and optional limit
      const [query, limit] = match.split(",").map((item) => item.trim());
      const maxResults = limit && !isNaN(limit) ? parseInt(limit) : null;

      // Fetch data from the Wikipedia API
      const response = await getJson(`https://api.giftedtech.my.id/api/search/wikimedia?apikey=gifted&title=${encodeURIComponent(query)}`);

      if (!response || !response.results || response.results.length === 0) {
        await message.react("❌️");
        return await message.reply("No results found for your query.");
      }

      // Limit results if a valid limit is provided
      const results = response.results
        .slice(0, maxResults || response.results.length)
        .map(
          (res, index) => `
📌 **Result ${index + 1}:**
> **Title:** ${res.title || "N/A"}
> **Source:** ${res.source || "N/A"}
        `
        )
        .join("\n\n");

      await message.client.sendMessage(
        message.jid,
        {
          text: `📚 **Wikipedia Search Results:**\n\n${results}`,
        }
      );

      await message.react("✅️");
    } catch (error) {
      console.error("Error in wiki command:", error);
      await message.react("❌️");
      await message.reply("An error occurred while fetching Wikipedia search results.");
    }
  }
);
command(
  {
    pattern: "google",
    fromMe: true,
    desc: "Search Google and fetch results",
    type: "search",
  },
  async (message, match) => {
    try {
      if (!match) {
        await message.react("❌️");
        return await message.reply("Please provide a search term.");
      }

      await message.react("⏳️");

      // Parse query and optional limit
      const [query, limit] = match.split(",").map((item) => item.trim());
      const maxResults = limit && !isNaN(limit) ? parseInt(limit) : null;

      // Fetch data from the Google Search API
      const response = await getJson(`https://api.giftedtech.my.id/api/search/google?apikey=king_haki-k7gjd8@gifted_api&query=${encodeURIComponent(query)}`);

      if (!response || !response.results || response.results.length === 0) {
        await message.react("❌️");
        return await message.reply("No results found for your query.");
      }

      // Limit results if a valid limit is provided
      const results = response.results
        .slice(0, maxResults || response.results.length)
        .map(
          (res, index) => `
📌 **Result ${index + 1}:**
> **Title:** ${res.title || "N/A"}
> **Link:** ${res.url || "N/A"}
        `
        )
        .join("\n\n");

      await message.client.sendMessage(
        message.jid,
        {
          text: `🌐 **Google Search Results:**\n\n${results}`,
        }
      );

      await message.react("✅️");
    } catch (error) {
      console.error("Error in google command:", error);
      await message.react("❌️");
      await message.reply("An error occurred while fetching Google search results.");
    }
  }
);
command(
  {
    pattern: "chord",
    fromMe: true,
    desc: "Fetch song lyrics and chords",
    type: "search",
  },
  async (message, match) => {
    try {
      if (!match) {
        await message.react("❌️");
        return await message.reply("Please provide a song name or query.");
      }

      await message.react("⏳️");

      // Fetch data from the Chord API
      const response = await getJson(`https://api.giftedtech.my.id/api/search/chord?apikey=gifted&query=${encodeURIComponent(match)}`);

      if (!response || !response.results) {
        await message.react("❌️");
        return await message.reply("No results found for your query.");
      }

      // Extract required details
      const { title, artist, lyrics } = response.results;

      // Clean up the lyrics
      const cleanedLyrics = lyrics
        .replace(/:\s*/g, "") // Remove colons
        .replace(/\s+/g, " ") // Remove excessive spaces
        .trim();

      // Prepare the response text
      const resultText = `
🎵 **Title:** ${title || "N/A"}
🎤 **Artist:** ${artist || "N/A"}
📜 **Lyrics:**
${cleanedLyrics || "No lyrics available."}
      `;

      await message.client.sendMessage(
        message.jid,
        {
          text: resultText,
        }
      );

      await message.react("✅️");
    } catch (error) {
      console.error("Error in chord command:", error);
      await message.react("❌️");
      await message.reply("An error occurred while fetching the song details.");
    }
  }
);

command(
    {
        pattern: "gimage",
        desc: "Fetch images based on search query and optional index.",
        fromMe: isPrivate,
        type: "ai",
    },
    async (message, match) => {
        await message.react("⏳");

        try {
            const parts = match.split(',');
            const searchQuery = parts[0].trim();
            const index = parts.length > 1 ? parseInt(parts[1].trim()) : null;

            const response = await axios.get('https://nikka-api.us.kg/search/googleimg?apiKey=nikka&q=' + encodeURIComponent(searchQuery));
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
            const response = await axios.get('https://nikka-api.us.kg/search/news?apiKey=nikka');
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
