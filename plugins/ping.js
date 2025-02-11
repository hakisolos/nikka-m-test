/* =======================
2025
  NIKKA BOTZ INC     
       POWERED BY HAKI XER
======================= */
const plugins = require("../lib/event");
const {
    command,
    isPrivate,
    clockString,
    getUrl,
    parsedJid,
    isAdmin
    
} = require("../lib");
const {
    BOT_INFO
} = require("../config");
const config = require("../config");
const { tiny } = require("../lib/fancy_font/fancy");
const Jimp = require("jimp");
const got = require("got");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database/plugins");
command(
    {
        pattern: "ping",
        fromMe: isPrivate,
        desc: "To check ping",
        type: "user",
    },
    async (message) => {
        const start = new Date().getTime();
      let init = await message.client.sendMessage(`*Ping 🧚‍♂️*`);
        const end = new Date().getTime();
var speed = end - start;
 
await new Promise(t => setTimeout(t,0))
        const text = `*Pong* 
${speed} *𝚖𝚜*`
         await message.fek(init.key, text)
})

