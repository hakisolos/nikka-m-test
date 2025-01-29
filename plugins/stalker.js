const { command, getJson } = require("../lib");

command(
  {
    pattern: "gitstalk",
    fromMe: true,
    desc: "Fetch details of a GitHub user",
    type: "stalker",
  },
  async (message, match) => {
    try {
      if (!match) {
        await message.react("❌️");
        return await message.reply("Please provide a GitHub username.");
      }

      await message.react("⏳️");

      const response = await getJson(`https://nikka-api.us.kg/stalker/gitstalk?q=${match}&apiKey=nikka`);
      if (!response || !response.data) {
        await message.react("❌️");
        return await message.reply("Failed to fetch user details. Please try again.");
      }

      const res = response.data;

      const text = `
♤□ NIKKA GITHUB STALKER □♤
> Username: ${res.username || "N/A"}
> Nickname: ${res.nickname || "N/A"}
> Bio: ${res.bio || "N/A"}
> Id: ${res.id || "N/A"}
> Node ID: ${res.nodeid || "N/A"}
> URL: ${res.url || "N/A"}
> Type: ${res.type || "N/A"}
> Admin: ${res.admin || "N/A"}
> Company: ${res.company || "N/A"}
> Location: ${res.location || "N/A"}
> Email: ${res.email || "N/A"}
> Blog: ${res.blog || "N/A"}
> Public Repos: ${res.public_repo || "N/A"}
> Public Gists: ${res.public_gists || "N/A"}
> Followers: ${res.followers || "N/A"}
> Following: ${res.following || "N/A"}
> Created At: ${res.created_at || "N/A"}
> Updated At: ${res.updated_at || "N/A"}
`;

      await message.client.sendMessage(message.jid, {
        image: { url: res.profile_pic || "" },
        caption: text,
      });

      await message.react("✅️");
    } catch (error) {
      console.error(error);
      await message.react("❌️");
      await message.reply("An error occurred while fetching the data.");
    }
  }
);
