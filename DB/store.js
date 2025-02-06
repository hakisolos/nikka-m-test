const fs = require('fs');
const path = require('path');
const { isJidBroadcast, isJidGroup, isJidNewsletter } = require('baileys');

const storeDir = path.join(process.cwd(), 'store');

// Ensure storeDir exists
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}

const readJSON = async (file) => {
  try {
    const filePath = path.join(storeDir, file);
    if (!fs.existsSync(filePath)) return [];
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeJSON = async (file, data) => {
  const filePath = path.join(storeDir, file);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
};

const saveContact = async (jid, name) => {
  if (!jid || !name || isJidGroup(jid) || isJidBroadcast(jid) || isJidNewsletter(jid)) return;
  const contacts = await readJSON('contact.json');
  const index = contacts.findIndex((contact) => contact.jid === jid);
  if (index > -1) {
    contacts[index].name = name;
  } else {
    contacts.push({ jid, name });
  }
  await writeJSON('contact.json', contacts);
};

const getContacts = async () => {
  return await readJSON('contact.json');
};

const saveMessage = async (message) => {
  if (!message || !message.key || !message.key.id || !message.key.remoteJid) return;
  const jid = message.key.remoteJid;
  const id = message.key.id;
  await saveContact(message.sender, message.pushName);
  const messages = await readJSON('message.json');
  const index = messages.findIndex((msg) => msg.id === id && msg.jid === jid);
  const timestamp = message.messageTimestamp ? message.messageTimestamp * 1000 : Date.now();
  if (index > -1) {
    messages[index].message = message;
    messages[index].timestamp = timestamp;
  } else {
    messages.push({ id, jid, message, timestamp });
  }
  await writeJSON('message.json', messages);
};

const loadMessage = async (id) => {
  if (!id) return null;
  const messages = await readJSON('message.json');
  const message = messages.find((msg) => msg.id === id);
  return message ? message.message : null;
};

const getName = async (jid) => {
  const contacts = await readJSON('contact.json');
  const contact = contacts.find((contact) => contact.jid === jid);
  return contact ? contact.name : jid.split('@')[0].replace(/_/g, ' ');
};

const saveMessageCount = async (message) => {
  if (!message || !message.key || !message.key.remoteJid || !message.sender) return;
  const jid = message.key.remoteJid;
  const sender = message.sender;
  if (!isJidGroup(jid)) return;

  const messageCounts = await readJSON('message_count.json');
  const index = messageCounts.findIndex((record) => record.jid === jid && record.sender === sender);

  if (index > -1) {
    messageCounts[index].count += 1;
  } else {
    messageCounts.push({ jid, sender, count: 1 });
  }

  await writeJSON('message_count.json', messageCounts);
};

const getInactiveGroupMembers = async (jid, client) => {
  if (!isJidGroup(jid)) return [];
  const groupMetadata = await client.groupMetadata(jid);
  if (!groupMetadata) return [];

  const messageCounts = await readJSON('message_count.json');
  const inactiveMembers = groupMetadata.participants.filter((participant) => {
    const record = messageCounts.find((msg) => msg.jid === jid && msg.sender === participant.id);
    return !record || record.count === 0;
  });

  return inactiveMembers.map((member) => member.id);
};

const getGroupMembersMessageCount = async (jid) => {
  if (!isJidGroup(jid)) return [];
  const messageCounts = await readJSON('message_count.json');
  const groupCounts = messageCounts
    .filter((record) => record.jid === jid && record.count > 0)
    .sort((a, b) => b.count - a.count);

  return Promise.all(
    groupCounts.map(async (record) => ({
      sender: record.sender,
      name: await getName(record.sender),
      messageCount: record.count,
    }))
  );
};

const getChatSummary = async () => {
  const messages = await readJSON('message.json');
  const distinctJids = [...new Set(messages.map((msg) => msg.jid))];

  const summaries = await Promise.all(
    distinctJids.map(async (jid) => {
      const chatMessages = messages.filter((msg) => msg.jid === jid);
      const messageCount = chatMessages.length;
      const lastMessage = chatMessages.sort((a, b) => b.timestamp - a.timestamp)[0];
      const chatName = isJidGroup(jid) ? jid : await getName(jid);

      return {
        jid,
        name: chatName,
        messageCount,
        lastMessageTimestamp: lastMessage ? lastMessage.timestamp : null,
      };
    })
  );

  return summaries.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
};

const saveMessageV1 = saveMessage;
const saveMessageV2 = (message) => Promise.all([saveMessageV1(message), saveMessageCount(message)]);

module.exports = {
  saveContact,
  getContacts,
  loadMessage,
  getName,
  getChatSummary,
  saveMessageCount,
  getInactiveGroupMembers,
  getGroupMembersMessageCount,
  saveMessages: saveMessageV2,
};
