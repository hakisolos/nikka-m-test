// antibot.js (Database file)

const { DataTypes } = require("sequelize");
const config = require('../../config'); // Your database config
const AntiBotDB = config.DATABASE.define('antibot', {
    chatJid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Ensure each group has a unique entry
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'off',  // Default is 'off', can be 'kick', 'delete'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

// Function to check if antibot is enabled in a group
async function getAntiBotStatus(chatJid) {
    return await AntiBotDB.findOne({ where: { chatJid } });
}

// Function to enable antibot with a specific action (kick, delete, or off)
async function setAntiBotStatus(chatJid, action) {
    let existingStatus = await getAntiBotStatus(chatJid);
    
    if (existingStatus) {
        existingStatus.action = action;
        existingStatus.updatedAt = new Date();
        await existingStatus.save();
    } else {
        await AntiBotDB.create({
            chatJid,
            action,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}

// Export functions for use in your bot
module.exports = {
    getAntiBotStatus,
    setAntiBotStatus,
};
