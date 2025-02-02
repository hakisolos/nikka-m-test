const AntiBotDB = require('./antibotdb');

// Check if antibot is enabled in a chat
async function isAntiBotEnabled(chatJid) {
    const setting = await AntiBotDB.findOne({ where: { chatJid } });
    return setting ? setting.isEnabled : false;
}

// Enable antibot
async function enableAntiBot(chatJid) {
    let setting = await AntiBotDB.findOne({ where: { chatJid } });
    if (setting) {
        setting.isEnabled = true;
        setting.updatedAt = new Date();
        await setting.save();
    } else {
        await AntiBotDB.create({ chatJid, isEnabled: true });
    }
    return `✅ AntiBot is now *enabled* in this group.`;
}

// Disable antibot
async function disableAntiBot(chatJid) {
    let setting = await AntiBotDB.findOne({ where: { chatJid } });
    if (setting) {
        setting.isEnabled = false;
        setting.updatedAt = new Date();
        await setting.save();
    }
    return `❌ AntiBot is now *disabled* in this group.`;
}

module.exports = { isAntiBotEnabled, enableAntiBot, disableAntiBot };
