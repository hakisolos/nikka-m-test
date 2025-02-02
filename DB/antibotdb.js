const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const AntiBotDB = sequelize.define('antibot_settings', {
    chatJid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
});

// Sync database
(async () => {
    await sequelize.sync();
})();

module.exports = AntiBotDB;
