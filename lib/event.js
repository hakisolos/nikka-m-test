/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

var config = require("../config");
var commands = [];

function handleMediaCommand(command, msg, text_msg, handleCommand) {
  switch (command.on) {
    case "text":
      if (text_msg) handleCommand("text", [text_msg]);
      break;
    case "image":
      if (msg.type === "imageMessage") handleCommand("image", [text_msg]);
      break;
    case "sticker":
      if (msg.type === "stickerMessage") handleCommand("sticker", []);
      break;
    case "video":
      if (msg.type === "videoMessage") handleCommand("video", []);
      break;
    case "delete":
      if (msg.type === "protocolMessage") {
        const whats = { messageId: msg.message?.protocolMessage?.key?.id };
        command.function(whats, msg);
      }
      break;
    case "message":
      handleCommand("all", []);
      break;
    default:
      break;
  }
}

function command(info, func) {
  let types = ['converter','image','christian','downloader','ai','group','stalker','dev','help','user','search','logo','fun','file','anime'];
  var infos = info;
  infos.function = func;
  infos.pattern = new RegExp(
    `${config.HANDLERS}(${info.pattern}| ${info.pattern})`,
    `is`
  );
  if (!infos.dontAddCommandList) infos.dontAddCommandList = false;
  if (!infos.fromMe) infos.dontAddCommandList = false;
  if (!info.type || !types.includes(info.type)) infos.type = 'misc';

  // Check if the command is media-related and use the media handler
  if (infos.on) {
    infos.handleMediaCommand = (msg, text_msg) => {
      handleMediaCommand(infos, msg, text_msg, func);
    };
  }

  commands.push(infos);
  return infos;
}

module.exports = {
  command,
  commands,
};
