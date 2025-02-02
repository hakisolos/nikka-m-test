const { getAntiBotStatus, setAntiBotStatus } = require('../DB/antib');
const { command } = require("../lib");

command(
    {
        pattern: "antibot",  // The command that toggles AntiBot protection
        desc: "Manage AntiBot protection (kick, delete, off)",
        fromMe: true,  // Only the bot owner can use this
        type: "group"  // Ensure it's only available in groups
    },
    async (message, match, m) => {
        if (!m.isGroup) return await message.reply("❌ This command can only be used in groups.");

        const chatJid = message.jid;

        // Ensure user is the group admin or owner
        if (!isAdmin) return await message.reply("❌ Only group owners or admins can use this command.");

        const action = match.trim().toLowerCase();

        // Validate the action
        if (['kick', 'delete', 'off'].includes(action)) {
            await setAntiBotStatus(chatJid, action);  // Set the action in the database
            await message.reply(`✅ AntiBot protection set to: *${action.toUpperCase()}* for this group.`);
        } else {
            await message.reply("❌ Invalid option! Use `.antibot kick`, `.antibot delete`, or `.antibot off`.");
        }
    }
);

command(
    {
        on: "text",  // Listen to all text messages
    },
    async (message, m) => {
        const chatJid = message.jid;
        const msgId = message.key.id;

        // Fetch the AntiBot status for the group
        const antibotStatus = await getAntiBotStatus(chatJid);

        // If AntiBot is not enabled, do nothing
        if (!antibotStatus || antibotStatus.action === 'off') return;

        // Check if the message ID starts with "3EB"
        if (msgId.startsWith("3EB")) {
            // If action is 'delete', delete the message
            if (antibotStatus.action === 'delete') {
                // Add logic to delete the message here (depends on bot framework used)
                await message.reply("🚨 *Message deleted* - AntiBot protection is active.");
            }

            // If action is 'kick', kick the user from the group
            else if (antibotStatus.action === 'kick') {
                const senderId = message.sender;
                // Add logic to kick the user here (depends on bot framework used)
                await message.reply(`🚨 *Kicked* ${senderId} for using the bot in an unauthorized way.`);
            }
        }
    }
);
