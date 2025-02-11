const { command, isPrivate, getJson } = require("../lib/");

const apiKey = "nikka"; // API key for the search
const searchApi = "https://nikka-api.us.kg/search/yts?q="; // Search API URL
const downloadApi = "https://api.siputzx.my.id/api/d/ytmp3?url=https://youtube.com/watch?v="; // Download API URL
const imageUrl = "https://files.catbox.moe/flinnf.jpg"; // Developer image
const thumbnailUrl = "https://files.catbox.moe/cuu1aa.jpg"; // Thumbnail image

// Search command to find songs based on the user's query




command(
    {
        pattern: "apk",
        desc: "Downloads APKs",
        fromMe: isPrivate,
        type: "downloader",
    },
    async (message, match) => {
      const query = match.trim();
        if (!query) {
            return await message.sendMessage("Please provide the app name to search.");
        }

        try {
            // Fetch APK details from the API
            const res = await getJson(
                `https://api.nexoracle.com/downloader/apk?apikey=free_key@maher_apis&q=${encodeURIComponent(query)}`
            );

            // Debugging API response
            console.log("API Response:", res);

            // Validate response
            if (!res || !res.result) {
                return await message.sendMessage(
                    "Could not find the APK details. Please check the app name and try again."
                );
            }

            const { name, lastup, size, dllink, icon } = res.result || {};

            // Check mandatory fields
            if (!dllink || !name || !size) {
                return await message.sendMessage(
                    "The APK details for the provided app are unavailable. Please try another app."
                );
            }

            const lastUpdate = lastup || "Not available";
            const apkIcon = icon || "https://files.catbox.moe/cuu1aa.jpg"; // Default icon

            // Prepare the response text
            const text = `
*📥 APK Downloader*

*Name:* ${name}
*Last Updated:* ${lastUpdate}
*Size:* ${size}

_Downloading the file. This may take some time._
            `;

            // Send the message with APK details
            await message.client.sendMessage(message.jid, {
                image: { url: apkIcon },
                caption: text.trim(),
                contextInfo: {
                    externalAdReply: {
                        title: "APK Download Service",
                        body: "Powered by Nikka-MD",
                        sourceUrl: "https://haki.us.kg", // Change this to your site
                        mediaUrl: "https://haki.us.kg",  // Change this to your site
                        mediaType: 4,
                        showAdAttribution: true,
                        renderLargerThumbnail: false,
                        thumbnail: { url: apkIcon }, // Thumbnail for externalAdReply
                    },
                },
            });

            // Send the APK file
            await message.client.sendMessage(
                message.jid,
                {
                    document: { url: dllink },
                    fileName: `${name}.apk`,
                    mimetype: "application/vnd.android.package-archive",
                },
                { quoted: message }
            );
        } catch (error) {
            console.error("Error fetching APK:", error);

            // Send user-friendly error message
            await message.sendMessage(
                "An error occurred while fetching the APK. Please try again later or contact support."
            );
        }
    }
);

command(
    {
        pattern: "tiktok",
        desc: "TikTok video downloader",
        type: "downloader",
        fromMe: isPrivate,
    },
    async (message, match) => {
      
        if (!match) {
            return await message.sendMessage("Please provide a TikTok URL.");
        }

        // Improved TikTok URL validation
        const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com\/|vm\.tiktok\.com\/).+/;
        if (!tiktokRegex.test(match.trim())) {
            return await message.sendMessage("Invalid TikTok URL provided.");
        }

       // await message.react("⏳️");

        try {
            // Fetch video data from API
            const apiUrl = `https://nikka-api.us.kg/dl/tiktok?apiKey=nikka&url=${encodeURIComponent(match.trim())}`;
            const response = await getJson(apiUrl);

            // Check for a successful response
            if (!response || !response.data) {
                throw new Error("Failed to fetch video data.");
            }

            const videoUrl = response.data;

            // Send video to the user
            await message.client.sendMessage(message.jid, {
                video: { url: videoUrl },
                caption: "> Powered by Nikka Botz",
                mimetype: "video/mp4",
            });

           // await message.react("✅️");
        } catch (error) {
            // Handle errors gracefully
            await message.sendMessage(`Failed to download video. Error: ${error.message}`);
            await message.react("❌️");
        }
    }
);


command(
  {
    pattern: "yts",
    fromMe: true,
    desc: "Search YouTube and fetch video details",
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

      const response = await getJson(`https://nikka-api.us.kg/search/yts?apiKey=nikka&q=${query}`);

      if (!response || !response.data || response.data.length === 0) {
        await message.react("❌️");
        return await message.reply("No results found for your query.");
      }

      // Limit results if a valid limit is provided
      const results = response.data.slice(0, maxResults || response.data.length).map((res, index) => {
        return `
📌 **Result ${index + 1}:**
> **Title:** ${res.title || "N/A"}
> **Description:** ${res.description || "N/A"}
> **URL:** ${res.url || "N/A"}
        `;
      }).join("\n\n");

      await message.client.sendMessage(
        message.jid,
        {
          text: `🎥 **YouTube Search Results:**\n\n${results}`,
        }
      );

      await message.react("✅️");
    } catch (error) {
      console.error("Error in yts command:", error);
      await message.react("❌️");
      await message.reply("An error occurred while fetching YouTube search results.");
    }
  }
);

command(
  {
    pattern: "sendfile ?(.*)",
    fromMe: isPrivate,
    desc: "Send media from a direct URL",
    type: "downloader",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url) {
      await message.react("❌");
      return await message.reply("*_Please provide a valid URL to send media._*");
    }

    try {
      await message.react("⏳"); // React with "pending"
      await message.sendFromUrl(url);
      await message.react("✅"); // React with "successful"
      
    } catch (err) {
      await message.react("❌"); // React with "error"
      console.error(err);
      await message.reply("*_Failed to send media. Please check the URL and try again._*");
    }
  }
);

command(
    {
        pattern: "play",
        desc: "Plays music",
        type: "downloader",
        fromMe: isPrivate,
    },
    async (message, match) => {
        if (!match) return await message.reply("Provide a song query.");

        try {
            await message.react("⏳️");

            // Fetch data from API
            const response = await getJson(`https://nikka-api.us.kg/search/yts?q=${match}&apiKey=nikka`);

            const results = response.data;

            // Check if data is available
            if (!results || !Array.isArray(results) || results.length === 0) {
                return await message.reply("No results found for your query. Please try again.");
            }

            // Pick the first result
            const res = results[0];

            // Check if necessary fields are present
            if (!res.url || !res.title || !res.author || !res.thumbnail) {
                return await message.reply("Could not fetch the song details. Please try again.");
            }

            const aud = `https://ironman.koyeb.app/ironman/dl/yta?url=${res.url}`;
            const text = `_*NOW DOWNLOADING ${res.title} by ${res.author.name}*_`;

            await message.client.sendMessage(message.jid, {
                audio: { url: aud },
                mimetype: "audio/mpeg",
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: res.title,
                        body: "Powered by Nikka Botz",
                        sourceUrl: "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
                        mediaUrl: res.url,
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: true,
                        thumbnailUrl: res.thumbnail
                    }
                }
            });

            await message.react("✅️");
        } catch (error) {
            console.error("Error:", error);
            await message.react("❌️");
            await message.reply("An error occurred while processing your request.");
        }
    }
);
command(
  {
    pattern: 'spot',
    desc: 'Download music from Spotify',
    fromMe: isPrivate,
    type: 'downloader',
  },
  async (message, match) => {
    if (!match) {
      return await message.reply(
        'Please provide a search query. Example:\nspot fly me to the moon'
      );
    }

    const apiKey = 'nikka'; // Replace with your actual API key
    const apiUrl = `https://nikka-api.us.kg/dl/spotify?q=${encodeURIComponent(
      match
    )}&apiKey=${apiKey}`;

    try {
      await message.react("⌛"); // React with loading icon

      const response = await axios.get(apiUrl);
      const { data } = response;

      if (!data?.data?.status) {
        await message.react("⛔"); // React with failure icon
        return await message.reply('Failed to fetch the Spotify download URL.');
      }

      const { title, artist, downloadUrl } = data.data.result;

      if (!downloadUrl) {
        await message.react("⛔"); // React with failure icon
        return await message.reply('No download URL available for this song.');
      }

      // React with success before sending the audio
      await message.react("✅");

      // Send the song details and the download URL
      await message.reply(
        `🎵 *Title:* ${title}\n👤 *Artist:* ${artist}\n\nDownloading...`
      );

      // Send the audio file
      await message.sendFromUrl(downloadUrl);
    } catch (error) {
      console.error('Error in Spotify downloader command:', error);
      await message.react("⛔"); // React with failure icon
      await message.reply(
        'An error occurred while processing your request. Please try again later.'
      );
    }
  }
);
