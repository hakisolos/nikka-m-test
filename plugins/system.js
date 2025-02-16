const { command } = require('../lib');
const { exec } = require('child_process');
const simpleGit = require('simple-git');

const git = simpleGit();

command(
  {
    pattern: 'update',
    fromMe: true,
    desc: 'Update the bot',
    type: 'system',
  },
  async (message, match) => {
    const prefix = message.prefix;
    await git.fetch();

    // Corrected the git log syntax
    const commits = await git.log(['origin/main']); // Changed master to main
    if (!match) {
      if (commits.total === 0) {
        return await message.reply('No update available');
      } else {
        let changes = 'UPDATE FOUND\n\n';
        changes += `*Changes:* ${commits.total}\n`;
        changes += 'Updates:\n';
        commits.all.forEach((commit, index) => {
          changes += `${index + 1}. ${commit.message}\n`;
        });
        changes += `\n*To update, use* ${prefix}update now\``;
        await message.reply(changes);
      }
    }

    if (match && match === 'now') {
      if (commits.total === 0) {
        return await message.reply('No changes in the latest commit');
      }
      await message.reply('Updating...');
      exec('git stash && git pull origin main', async (err, stdout, stderr) => { // Changed master to main
        if (err) {
          return await message.reply(`${stderr}`);
        }
        await message.reply('Restarting...');
        const dependency = await updatedDependencies();
        if (dependency) {
          await message.reply('Dependencies changed. Installing new dependencies...');
          exec('npm install', async (err, stdout, stderr) => {
            if (err) {
              return await message.reply(`${stderr}`);
            }
            process.exit(0);
          });
        } else {
          process.exit(0);
        }
      });
    }
  }
);

const updatedDependencies = async () => {
  try {
    // Corrected the git diff syntax
    const diff = await git.diff(['origin/main']); // Changed master to main
    return diff.includes('"dependencies":');
  } catch (error) {
    console.error('Error occurred while checking package.json:', error);
    return false;
  }
};


command(
    {
        pattern: "restart",
        desc: "Restarts the bot.",
        fromMe: true,
        type: "system",
    },
    async (message) => {
        await message.reply("Restarting...");
        exec("pm2 restart all || npm start", (err) => {
            if (err) return message.reply(`Error: ${err.message}`);
        });
    }
);

command(
    {
        pattern: "shutdown",
        desc: "Shuts down the bot.",
        fromMe: true,
        type: "system",
    },
    async (message) => {
        await message.reply("Shutting down...");
        exec("pm2 stop all || pkill -f node", (err) => {
            if (err) return message.reply(`Error: ${err.message}`);
        });
    }
);

command(
    {
        pattern: "npm-install",
        desc: "Installs a specific package.",
        fromMe: true,
        type: "system",
    },
    async (message, match) => {
        if (!match) return await message.reply("Usage: .npm-install <package>");

        await message.reply(`Installing ${match}...`);
        exec(`npm install ${match}`, (err, stdout, stderr) => {
            if (err) return message.reply(`Error: ${err.message}`);
            if (stderr) return message.reply(`Error: ${stderr}`);
            message.reply(`Package ${match} installed successfully!\n${stdout}`);
        });
    }
);

command(
    {
        pattern: "npm-uninstall",
        desc: "Uninstalls a specific package.",
        fromMe: true,
        type: "system",
    },
    async (message, match) => {
        if (!match) return await message.reply("Usage: .npm-uninstall <package>");

        await message.reply(`Uninstalling ${match}...`);
        exec(`npm uninstall ${match}`, (err, stdout, stderr) => {
            if (err) return message.reply(`Error: ${err.message}`);
            if (stderr) return message.reply(`Error: ${stderr}`);
            message.reply(`Package ${match} uninstalled successfully!\n${stdout}`);
        });
    }
);
