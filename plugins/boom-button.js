command(
  {
    pattern: "slides",
    desc: "Send an interactive slide with a quick reply button",
    fromMe: true,
    type: "media",
  },
  async (message, match) => {
    try {
      const slide = {
        image: "https://files.catbox.moe/h5rnap.jpg",
        title: "Welcome to H4KI XER",
        body: "Explore the latest features of our bot.",
        footer: "Your trusted AI assistant",
        buttonText: "Learn More",
        buttonId: "cmd_info"
      };

      await message.sendButton(
        message.jid,
        slide.body,
        slide.footer,
        [{ buttonId: slide.buttonId, buttonText: { displayText: slide.buttonText }, type: 1 }],
        slide.image,
        message
      );

    } catch (error) {
      console.error("Error sending slide:", error);
      await message.reply("Failed to send the slide. Please try again.");
    }
  }
);
