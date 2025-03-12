const { commands } = require("../lib/event");
const { command, isPrivate } = require("../lib/");
const fs = require("fs");
const path = require("path");
const config = require("../config");
const hand = config.HANDLERS[2];
const stickerCommandsPath = path.join(__dirname, "../DB/sticker_commands.json");
const {tiny} = require("../lib/fancy_font/fancy")

const loadStickerCommands = () => {
  if (!fs.existsSync(stickerCommandsPath)) return {};
  return JSON.parse(fs.readFileSync(stickerCommandsPath));
};

const saveStickerCommands = (data) => {
  fs.writeFileSync(stickerCommandsPath, JSON.stringify(data, null, 2));
};

const getStickerCommand = (stickerHash) => {
  if (!stickerHash) return null;
  const stickerCommands = loadStickerCommands();
  return stickerCommands[stickerHash] || null;
};

command(
  {
    pattern: "setcmd",
    fromMe: true,
    desc: "Bind a command to a sticker",
    type: "sticker-cmd",
  },
  async (message, match, m) => {
    if (!m.quoted) return await message.reply(tiny("Reply to a sticker with a command"));
    if (!m.quoted.message?.stickerMessage?.fileSha256) return await message.reply(tiny("Reply to a valid sticker"));
    if (!match) return await message.reply(tiny("Provide a command to bind to this sticker"));

    try {
      const stickerHash = m.quoted.message.stickerMessage.fileSha256.toString("base64");
      const stickerCommands = loadStickerCommands();
      const commandName = match.trim().toLowerCase();

      stickerCommands[stickerHash] = commandName;
      saveStickerCommands(stickerCommands);

      await message.reply(tiny(`✅ Command set successfully!\n📌 Sticker now triggers: ${commandName}`));
    } catch (error) {
      console.error(error);
      await message.reply(tiny("Failed to bind command to sticker"));
    }
  }
);

command(
  {
    pattern: "listcmd",
    fromMe: true,
    desc: "List all bound sticker commands",
    type: "sticker-cmd",
  },
  async (message) => {
    const stickerCommands = loadStickerCommands();
    if (Object.keys(stickerCommands).length === 0) return await message.reply(tiny("No sticker commands set yet!"));

    let msg = "Sticker Commands List:\n\n";
    for (const [hash, cmd] of Object.entries(stickerCommands)) {
      msg += `🔹 Sticker Hash: ${hash.slice(0, 10)}...\n⚡ Command: ${cmd}\n\n`;
    }

    await message.reply(tiny(msg));
  }
);

command(
  {
    pattern: "delcmd",
    fromMe: isPrivate,
    desc: "Remove a bound command from a sticker",
    type: "sticker-cmd",
  },
  async (message, _, m) => {
    if (!m.quoted) return await message.reply(tiny("Reply to a sticker to remove its command"));
    if (!m.quoted.message?.stickerMessage?.fileSha256) return await message.reply(tiny("Reply to a valid sticker"));

    try {
      const stickerHash = m.quoted.message.stickerMessage.fileSha256.toString("base64");
      const stickerCommands = loadStickerCommands();

      if (!stickerCommands[stickerHash]) return await message.reply(tiny("No command found for this sticker"));

      delete stickerCommands[stickerHash];
      saveStickerCommands(stickerCommands);

      await message.reply(tiny("✅ Sticker command removed successfully!"));
    } catch (error) {
      console.error(error);
      await message.reply(tiny("Failed to unbind command from sticker"));
    }
  }
);

command(
  {
    pattern: "clearcmd",
    fromMe: isPrivate,
    desc: "Delete all sticker commands",
    type: "sticker-cmd",
  },
  async (message) => {
    try {
      saveStickerCommands({});
      await message.reply(tiny("✅ All sticker commands deleted successfully!"));
    } catch (error) {
      console.error(error);
      await message.reply(tiny("Failed to delete sticker commands"));
    }
  }
);

command(
  {
    on: "sticker",
  },
  async (message, _, m, conn) => {
    try {
      if (!m.message?.stickerMessage?.fileSha256) return;

      const stickerHash = m.message.stickerMessage.fileSha256.toString("base64");
      const commandName = getStickerCommand(stickerHash);
      if (!commandName) return;

      console.log("Sticker triggered command:", commandName);

      const pluginss = require("../lib/event");
      const allCommands = await pluginss.commands || commands;

      let targetCommand = null;
      for (const cmd of allCommands) {
        if (!cmd.pattern) continue;
        if (cmd.pattern.toString().toLowerCase().includes(commandName)) {
          targetCommand = cmd;
          break;
        }
      }

      if (targetCommand) {
        console.log("Found matching command:", targetCommand.pattern);
        const fakeMessage = { ...m, body: `${hand}${commandName}` };
        let whats = new (require("../lib/Base.js").Message)(conn, fakeMessage, fakeMessage);
        await targetCommand.function(whats, "", fakeMessage, conn);
      } else {
        console.log("No matching command found for:", commandName);
        await message.reply(tiny(`❌ Command not found: ${commandName}`));
      }
    } catch (error) {
      console.error("Sticker command execution error:", error);
      await message.reply(tiny(`Error: ${error.message}`));
    }
  }
);
