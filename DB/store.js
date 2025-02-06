const config = require('../config');
const { DataTypes } = require('sequelize');

const ContactDB = config.DATABASE.define('contacts', {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

const MessageDB = config.DATABASE.define('messages', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  jid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT, // Changed to TEXT for SQLite to handle large JSON strings
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('message');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('message', value ? JSON.stringify(value) : null);
    }
  },
  timestamp: {
    type: DataTypes.INTEGER, // Changed to INTEGER for SQLite timestamp
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000)
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

const MessageCountDB = config.DATABASE.define('message_counts', {
  jid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['jid', 'sender']
    }
  ]
});

// Helper functions
async function getContact(jid) {
  return await ContactDB.findOne({ where: { jid } });
}

async function saveContact(jid, name) {
  if (!jid || !name || isJidGroup(jid) || isJidBroadcast(jid) || isJidNewsletter(jid)) return null;
  
  const now = new Date();
  return await ContactDB.upsert({
    jid,
    name,
    createdAt: now,
    updatedAt: now
  });
}

async function getMessage(id) {
  return await MessageDB.findOne({ where: { id } });
}

async function saveMessage(message) {
  if (!message?.key?.id || !message?.key?.remoteJid) return null;
  
  const now = new Date();
  const messageData = {
    id: message.key.id,
    jid: message.key.remoteJid,
    message: message,
    timestamp: message.messageTimestamp ? message.messageTimestamp : Math.floor(Date.now() / 1000),
    createdAt: now,
    updatedAt: now
  };

  let existingMessage = await getMessage(message.key.id);
  
  if (existingMessage) {
    existingMessage.message = message;
    existingMessage.timestamp = messageData.timestamp;
    existingMessage.updatedAt = now;
    await existingMessage.save();
    return existingMessage;
  } else {
    return await MessageDB.create(messageData);
  }
}

async function getMessageCount(jid, sender) {
  return await MessageCountDB.findOne({ 
    where: { 
      jid,
      sender 
    } 
  });
}

async function saveMessageCount(message) {
  if (!message?.key?.remoteJid || !message.sender || !isJidGroup(message.key.remoteJid)) return null;

  const now = new Date();
  let messageCount = await getMessageCount(message.key.remoteJid, message.sender);

  if (messageCount) {
    messageCount.count += 1;
    messageCount.updatedAt = now;
    await messageCount.save();
  } else {
    messageCount = await MessageCountDB.create({
      jid: message.key.remoteJid,
      sender: message.sender,
      count: 1,
      createdAt: now,
      updatedAt: now
    });
  }

  return messageCount;
}

async function resetMessageCount(jid, sender) {
  return await MessageCountDB.destroy({
    where: {
      jid,
      sender
    }
  });
}

// Initialize database
async function initDatabase() {
  try {
    await config.DATABASE.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

module.exports = {
  ContactDB,
  MessageDB,
  MessageCountDB,
  getContact,
  saveContact,
  getMessage,
  saveMessage,
  getMessageCount,
  saveMessageCount,
  resetMessageCount,
  initDatabase
};