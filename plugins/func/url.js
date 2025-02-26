const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fileType = require('file-type');
const FormData = require('form-data');
const fetch = require('node-fetch');

const MAX_FILE_SIZE_MB = 200;

async function upload(message) {
  try {
    if (
      !message.reply_message ||
      (!message.reply_message.image &&
        !message.reply_message.sticker &&
        !message.reply_message.audio &&
        !message.reply_message.document &&
        !message.reply_message.video)
    ) {
      return "Please reply to a message containing an image, sticker, or video.";
    }

    // Download the media
    const mediaBuffer = await downloadMediaMessage(message.reply_message, 'buffer');
    if (!mediaBuffer) {
      return "Failed to download the media.";
    }

    // Check file size
    const fileSizeMB = mediaBuffer.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`;
    }

    // Detect file type
    const type = await fileType.fromBuffer(mediaBuffer);
    const ext = type ? type.ext : 'bin';

    // Prepare form data
    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", mediaBuffer, `file.${ext}`);
    bodyForm.append("reqtype", "fileupload");

    // Upload media
    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}: ${res.statusText}`);
    }

    const mediaUrl = await res.text();

    return mediaUrl.startsWith("http")
      ? `Media uploaded successfully: ${mediaUrl}`
      : mediaUrl;
  } catch (error) {
    console.error("Error during media upload:", error);
    return "Failed to upload the media. Please try again.";
  }
}

await upload(message.reply_message)
