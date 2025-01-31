const { command } = require("../lib");
const { exec } = require("child_process");

command(
  {
    pattern: "run",
    fromMe: true,
    desc: "Run terminal commands",
    type: "utility",
  },
  async (message, match, m) => {
    // Ensure that there is a command to run
    if (!match) {
      return await message.reply("❌ Please provide a command to run.");
    }

    try {
      // Execute the shell command
      exec(match, (error, stdout, stderr) => {
        if (error) {
          return message.reply(`❌ Error executing command: ${error.message}`);
        }
        if (stderr) {
          return message.reply(`❌ Standard error: ${stderr}`);
        }
        // Send the output from the command execution
        message.reply(`Command Output:\n${stdout}`);
      });
    } catch (err) {
      console.error("Error in exec command:", err);
      return message.reply("❌ An error occurred while executing the command.");
    }
  }
);
