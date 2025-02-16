const { getAlive, editAlive, resetAlive } = require("../DB/aliveDB/alive");
const { command, isPrivate } = require("../lib/");


command(
    {
        pattern: "alive",
        desc: "Get, set, or reset the alive message.",
        fromMe: true,
        type: "user",
    },
    async (message, match) => {
        const args = match.split(" ");

        // If no argument is provided, return the current alive message
        if (!match) {
            return await message.reply(getAlive());
        }

        if (args[0] === "get") {
            return await message.reply(getAlive());
        }

        if (args[0] === "reset") {
            resetAlive();
            return await message.reply("✅ Alive message has been reset to default.");
        }

        if (args[0] === "set") {
            const newMessage = match.replace(/^set\s+/, "").trim();
            if (!newMessage) return await message.reply("❌ Please provide a message inside quotes.\nExample: `.alive set \"New alive message\"`");
            editAlive(newMessage);
            return await message.reply(`✅ Alive message updated to:\n\n${newMessage}`);
        }

        // If the command is incorrect, send a prompt message
        return await message.reply("❌ Invalid command. Use:\n\n.alive get\n.alive set \"your message\"\n.alive reset");
    }
);
