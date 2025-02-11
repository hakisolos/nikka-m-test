

const {
  Function,
  isPrivate,
  getUrl,
  fromBuffer,
  Imgur,
  getBuffer,
  getJson,
  extractUrls,
  Fancy,
  AddMp3Meta,
  createMap,
  formatBytes,
  parseJid,
  isUrl,
  parsedJid,
  pinterest,
  wallpaper,
  wikimedia,
  quotesAnime,
  aiovideodl,
  umma,
  ringtone,
  styletext,
  FileSize,
  h2k,
  ymp3,
  textpro,
  yt,
  ytIdRegex,
  yta,
  ytv,
  runtime,
  clockString,
  sleep,
  jsonformat,
  Serialize,
  processTime,
  command,
} = require("../lib/");
const util = require("util");
const config = require("../config");

command({pattern:'eval', on: "text", fromMe: true, desc: 'Runs a server code'}, async (message, match, m, client) => {
  if (match.startsWith("$")) {
    try {
      const code = `(async () => { ${match.replace("$", "")} })()`;
      let evaled = await eval(code);
      if (typeof evaled !== "string") evaled = util.inspect(evaled);
      await message.reply(evaled);
    } catch (err) {
      await message.reply(util.format(err));
    }
  }
});
