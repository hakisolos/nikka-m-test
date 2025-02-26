const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fileType = require('file-type');
const FormData = require('form-data');
const fetch = require('node-fetch');

const MAX_FILE_SIZE_MB = 200;

async function upload(message) {
  try {
    if (!message) {
      throw new Error("No message provided.");
    }

    // Download the media
    const mediaBuffer = await downloadMediaMessage(message, 'buffer');
    if (!mediaBuffer) {
      throw new Error("Failed to download the media.");
    }

    // Check file size
    const fileSizeMB = mediaBuffer.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
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

    if (!mediaUrl.startsWith("http")) {
      throw new Error("Invalid response from server.");
    }

    return mediaUrl;
  } catch (error) {
    console.error("Error during media upload:", error);
    return null; // Return null if upload fails
  }
}

module.exports = { upload };
