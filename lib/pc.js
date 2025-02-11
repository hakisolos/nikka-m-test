const { default: makeWASocket, Browsers, makeCacheableSignalKeyStore } = require("haki-baileys");
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const pino = require("pino");
const path = require("path");
const config = require("../config");

async function generatePairingCode() {
    console.log("🔹 Checking for missing session...");

    // Define session path
    const sessionPath = path.join(__dirname, "session");
    const credsPath = path.join(sessionPath, "creds.json");

    // Check conditions
    if (!fs.existsSync(credsPath) || !config.SESSION_ID) {
        console.log("🔹 No valid SESSION_ID found or creds.json missing.");

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        let conn = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            browser: Browsers.macOS("Safari"),
            markOnlineOnConnect: true
        });

        if (!conn.authState.creds.registered) {
            console.log("📲 Enter your phone number (e.g., 234XXXXXXXXXX):");
            process.stdin.once("data", async (data) => {
                let phoneNumber = data.toString().trim().replace(/[^0-9]/g, '');
                
                try {
                    let pairingCode = await conn.requestPairingCode(phoneNumber);
                    console.log(`📌 Pairing Code: ${pairingCode?.match(/.{1,4}/g)?.join('-')}`);
                } catch (error) {
                    console.error("❌ Pairing failed:", error);
                }

                process.stdin.end();
            });
        }

        conn.ev.on("creds.update", async () => {
            await saveCreds();
        });
    }
}

module.exports = generatePairingCode;
