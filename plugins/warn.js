const warnings = {}; // Temporary in-memory DB for warnings
const { command } = require("../lib");
command(
  {
    pattern: "warn ?(.*)",
    fromMe: true,
    desc: "Warn a person in the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) 
      return await message.reply("*_This command only works in group chats_*");

    // Determine the target user
    let target =
      message.reply_message?.jid || 
      (message.mention[0] ? message.mention[0] : null);

    if (!target) 
      return await message.reply("*_Please reply to a user or mention them!_*");

    // Extract the reason
    const reason = match || "No reason provided";

    // Initialize or increment warnings
    if (!warnings[target]) warnings[target] = { count: 0, reasons: [] };
    warnings[target].count++;
    warnings[target].reasons.push(reason);

    // Check warning count and take action if needed
    if (warnings[target].count >= 4) {
      await message.client.groupParticipantsUpdate(message.jid, [target], "remove");
      await message.reply(
        `*_User @${target.split("@")[0]} has been removed from the group for receiving 4 warnings!_*`,
        { mentions: [target] }
      );
      delete warnings[target]; // Reset warnings after removal
    } else {
      await message.reply(
        `*_Warn added for @${target.split("@")[0]}_*\n` +
        `> *Reason:* ${reason}\n` +
        `> *Count:* ${warnings[target].count}/3`,
        { mentions: [target] }
      );
    }
  }
);

command(
  {
    pattern: "resetwarn ?(.*)",
    fromMe: true,
    desc: "Reset a user's warnings",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This command only works in group chats_*");

    // Determine the target user
    let target =
      message.reply_message?.jid || 
      (message.mention[0] ? message.mention[0] : null);

    if (!target) 
      return await message.reply("*_Please reply to a user or mention them!_*");

    if (!warnings[target]) 
      return await message.reply(`*_@${target.split("@")[0]} has no warnings to reset_*`, { mentions: [target] });

    delete warnings[target];
    await message.reply(`*_Warnings for @${target.split("@")[0]} have been reset_*`, { mentions: [target] });
  }
);
