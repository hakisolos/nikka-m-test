
const { command } = require("../lib");
command(
  {
    pattern: "boom",
    desc: "Send an interactive slide carousel",
    fromMe: true,
    type: "media",
  },
  async (message, match) => {
    try {
      const slide = [
        [
          "https://files.catbox.moe/h5rnap.jpg", // Image URL
          "Welcome to H4KI XER", // Slide Title
          "Explore the latest features of our bot.", // Body Text
          "Your trusted AI assistant", // Footer Text
          "CLICK ME!", // Button Text
          "cmd_click", // Command ID
          "quick_reply", // Button Type (Quick Reply)
          "" // No URL needed for quick reply
        ]
      ];

      // Sending the interactive slide message
      await message.sendSlide(
        message.jid,
        "H4KI XER Bot Features", // Main Title
        "Check out what our bot can do!", // Message Text
        message, // Quoted Message
        "Developed by H4KI XER", // Footer Text
        slide
      );

    } catch (error) {
      console.error("Error sending slide:", error);
      await message.reply("Failed to send slide. Please try again.");
    }
  }
);
