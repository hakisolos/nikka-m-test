const { command } = require('../lib/');
const {
  setAntiWordStatus,
  getAntiWords,
  addAntiWords,
  removeAntiWords,
} = require('../DB/antiword');

command(
  {
    pattern: 'antiword',
    desc: 'Set Antiword Management for Group Chats', 
    fromMe: true,
    type: 'group',
  },
  async (message, match) => {
    const { jid, prefix } = message;
    const [cmd, ...args] = match.split(' ');

    if (cmd.toLowerCase() === 'on') {
      const statusResult = await setAntiWordStatus(jid, true);
      if (statusResult.success)
        return await message.reply('_Antiword has been enabled for this group._');
    }

    const antiwordStatus = await getAntiWords(jid);
    if (!antiwordStatus.status) {
      return await message.reply('_Enable antiword first using "' + prefix + 'antiword on"_');
    }

    if (cmd.toLowerCase() === 'set') {
      if (!args[0])
        return await message.reply(
          `_Provide words to block. Usage: ${prefix}antiword set word1,word2,word3_`
        );
      const wordsToSet = args[0].split(',').map((word) => word.trim());
      const uniqueWords = [...new Set(wordsToSet)];
      const existingWords = antiwordStatus.words || [];
      const newWords = uniqueWords.filter((word) => !existingWords.includes(word));

      if (newWords.length === 0)
        return await message.reply('_All provided words are already in the antiword list._');

      const setResult = await addAntiWords(jid, newWords);
      if (setResult.success)
        return await message.reply(`_Added "${newWords.length}" new words to antiword list._`);
    }

    if (cmd.toLowerCase() === 'get') {
      if (antiwordStatus.success) {
        const wordsList =
          antiwordStatus.words.length > 0 ? antiwordStatus.words.join(', ') : 'No antiwords set';
        return await message.reply(
          `*Antiword status:* ${antiwordStatus.status ? 'Enabled' : 'Disabled'}\n` +
            `*Blocked words:* ${wordsList}`
        );
      }
    }

    if (cmd.toLowerCase() === 'del') {
      if (!args[0])
        return await message.reply(
          `_Provide words to delete. Usage: ${prefix}antiword del word1,word2,word3_`
        );
      const wordsToDelete = args[0].split(',').map((word) => word.trim());
      const existingWords = antiwordStatus.words || [];
      const validWordsToDelete = wordsToDelete.filter((word) => existingWords.includes(word));

      if (validWordsToDelete.length === 0)
        return await message.reply('_None of the provided words are in the antiword list._');

      const delResult = await removeAntiWords(jid, validWordsToDelete);
      if (delResult.success)
        return await message.reply(
          `_Removed ${validWordsToDelete.length} words from antiword list._`
        );
    }

    await message.reply(
      `*Usage:*\n` +
        `${prefix}antiword on - Enable antiword\n` +
        `${prefix}antiword set word1,word2,word3 - Set blocked words\n` +
        `${prefix}antiword get - View current antiwords\n` +
        `${prefix}antiword del word1,word2 - Delete specific words`
    );
  }
);
