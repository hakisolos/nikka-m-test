const { command } = require("@lib");
const config = require("../config");
const { jidNormalizedUser } = require("@whiskeysockets/baileys"); // Import this

// Ensure settings exist in config
if (typeof config.AUTO_STATUS === "undefined") config.AUTO_STATUS = true; // Global switch
if (typeof config.AUTO_READ_STATUS === "undefined") config.AUTO_READ_STATUS = false;
if (typeof config.AUTO_LIKE_STATUS === "undefined") config.AUTO_LIKE_STATUS = false;
if (typeof config.AUTO_LIKE_EMOJI === "undefined") config.AUTO_LIKE_EMOJI = "✨";

// Command to toggle Auto Read & Auto Like Status
command(
  {
    pattern: "autostatus",
    fromMe: true, // Only owner can toggle
    desc: "Toggle Auto Status Features",
    type: "config",
  },
  async (message, match) => {
    const args = match.split(" ");

    if (args[0] === "off") {
      config.AUTO_STATUS = false;
      return await message.reply(`❌ *Auto Status Features Disabled* ❌`);
    }

    if (args[0] === "on") {
      config.AUTO_STATUS = true;
      return await message.reply(`✅ *Auto Status Features Enabled* ✅`);
    }

    if (args[0] === "read") {
      config.AUTO_READ_STATUS = !config.AUTO_READ_STATUS;
      return await message.reply(`✅ *Auto Read Status is now* ${config.AUTO_READ_STATUS ? "ON ✅" : "OFF ❌"}`);
    }

    if (args[0] === "like") {
      config.AUTO_LIKE_STATUS = !config.AUTO_LIKE_STATUS;
      return await message.reply(`✅ *Auto Like Status is now* ${config.AUTO_LIKE_STATUS ? "ON ✅" : "OFF ❌"}`);
    }

    if (args[0] === "emoji" && args[1]) {
      config.AUTO_LIKE_EMOJI = args[1];
      return await message.reply(`✅ *Auto Like Emoji set to:* ${args[1]}`);
    }

    return await message.reply(
      "*Usage:*\n" +
      "`.autostatus on` - Enable Auto Status Features\n" +
      "`.autostatus off` - Disable Auto Status Features\n" +
      "`.autostatus read` - Toggle Auto Read Status\n" +
      "`.autostatus like` - Toggle Auto Like Status\n" +
      "`.autostatus emoji <emoji>` - Set Auto Like Emoji"
    );
  }
);

// Auto Read & Auto Like Status Function
command(
  {
    on: "status",
  },
  async (message) => {
    try {
      if (!config.AUTO_STATUS) return; // Global switch

      if (config.AUTO_READ_STATUS && message.key) {
        const botJid = jidNormalizedUser(message.client.user.id);
        await message.client.readMessages([message.key]);
      }

      if (config.AUTO_LIKE_STATUS) {
        const botJid = jidNormalizedUser(message.client.user.id);
        const customEmoji = config.AUTO_LIKE_EMOJI || "✨";

        if (message.key.remoteJid && message.key.participant) {
          await message.client.sendMessage(
            message.key.remoteJid,
            {
              react: {
                key: message.key,
                text: customEmoji,
              },
            },
            {
              statusJidList: [message.key.participant, botJid],
            }
          );
        }
      }
    } catch (error) {
      console.error("❌ Error processing status actions:", error);
    }
  }
);
