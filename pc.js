const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  Browsers,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const pino = require("pino");
const readline = require("readline");

async function startNikka() {
  console.log("🔹 Checking session...");

  const sessionPath = "./lib/session/";
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
  }

  // ✅ Initialize auth state
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  // ✅ Initialize retry cache
  const msgRetryCounterCache = new Map();

  // ✅ Establish socket connection
  const conn = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
        state.keys,
        pino({ level: "fatal" }).child({ level: "fatal" })
      ),
    },
    printQRInTerminal: false,
    logger: pino({ level: "fatal" }).child({ level: "fatal" }),
    browser: Browsers.macOS("Safari"),
    markOnlineOnConnect: true,
    msgRetryCounterCache,
  });

  // ✅ Check if already logged in
  if (!conn.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const ask = (text) => new Promise((resolve) => rl.question(text, resolve));

    try {
      let phoneNumber = await ask(
        "📲 Enter your phone number (with country code, e.g., +2348012345678): "
      );
      phoneNumber = phoneNumber.replace(/[^0-9]/g, ""); // Ensure only digits
      rl.close(); // Close input stream

      console.log("🔹 Requesting Pairing Code...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const code = await conn.requestPairingCode(phoneNumber);
      console.log(`✅ Your Pairing Code: ${code?.match(/.{1,4}/g)?.join("-")}`);
    } catch (error) {
      console.error("❌ Pairing failed:", error);
    }
  }

  // ✅ Save credentials on update
  conn.ev.on("creds.update", async () => {
    await saveCreds();
    console.log("✅ Credentials saved!");
  });

  // ✅ Handle connection updates
  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") {
      console.log("⏳ Connecting to WhatsApp...");
    }

    if (connection === "open") {
      console.log("✅ Login Successful! Bot is now connected.");
    }

    if (connection === "close") {
      if (lastDisconnect?.error?.output?.statusCode === 401) {
        console.log("❌ Session expired. Please re-pair.");
        fs.rmSync(sessionPath, { recursive: true, force: true }); // Delete session
      } else {
        console.log("🔄 Reconnecting...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        startNikka();
      }
    }
  });

  return conn;
}

// Start the bot
startNikka();
