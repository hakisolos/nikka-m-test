const {
  command,
  isPrivate,
  getBuffer
} = require("../lib/");
const axios = require('axios');
const FormData = require("form-data");
// https://api.nexoracle.com/search/google?apikey=free_key@maher_apis&q=who%20is%20Mark%20Zuckeberk

command(
  {
    pattern: "animewall",
    fromMe: true,
    desc: "Sends anime wallpapers with multiple CTA buttons",
    type: "info",
  },
  async (message) => {
    try {
      // Send slide with anime wallpaper and CTA buttons
      await message.sendSlide(
        message.jid,
        "Nikka Botz Inc",
        "Anime Wallpapers",
        message,
        "Powered by Haki",
        [
          [
            "https://api.nexoracle.com/wallpapers/anime?apikey=free_key@maher_apis",
            "𝞜𝞘𝞙𝞙𝞓",
            "Get Support",
            "Powered by Haki",
            "cta_url",
            "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
          ],
          [
            "https://api.nexoracle.com/wallpapers/anime?apikey=free_key@maher_apis",
            "𝞜𝞘𝞙𝞙𝞓",
            "Get Support",
            "Powered by Haki",
            "cta_url",
            "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
          ],
          [
            "https://api.nexoracle.com/wallpapers/anime?apikey=free_key@maher_apis",
            "𝞜𝞘𝞙𝞙𝞓",
            "Learn More",
            "Powered by Haki",
            "cta_url",
            "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
          ],
          [
            "https://api.nexoracle.com/wallpapers/anime?apikey=free_key@maher_apis",
            "𝞜𝞘𝞙𝞙𝞓",
            "Get Support",
            "Powered by Haki",
            "cta_url",
            "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
          ],
          [
            "https://api.nexoracle.com/wallpapers/anime?apikey=free_key@maher_apis",
            "𝞜𝞘𝞙𝞙𝞓",
            "Explore",
            "Powered by Haki",
            "cta_url",
            "https://whatsapp.com/channel/0029VaoLotu42DchJmXKBN3L",
          ],
        ]
      );
    } catch (error) {
      console.error("Error in animewall command:", error.message);
      await message.reply("An error occurred while sending the anime wallpapers.");
    }
  }
);
