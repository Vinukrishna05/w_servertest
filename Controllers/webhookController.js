const { 
  handleTextMessage, 
  handleLocationMessage, 
  handleInteractiveMessage, 
  handleImageMessage
} = require("./messageController");

const { getSession } = require("../sessionStore");

// ✅ Verify Webhook
exports.verifyWebhook = (req, res) => {
  try {
    const VERIFY_TOKEN = "warmy_token";
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified!");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    console.error("❌ Error in verifyWebhook:", err);
    res.sendStatus(500);
  }
};

// ✅ Receive Messages
exports.receiveMessage = async (req, res) => {
  try {
    console.log("📩 Incoming Payload:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // 🛑 Ignore delivery/read status updates
    if (value?.statuses) {
      console.log("ℹ️ Ignored status update:", value.statuses[0]);
      return res.sendStatus(200);
    }

    // ✅ Handle actual messages
    const message = value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const session = getSession(from);
    console.log("🗂 Current session:", session);

    switch (message.type) {
      case "text":
        await handleTextMessage(from, message.text.body);
        break;

      case "location":
        await handleLocationMessage(from, message.location);
        break;

      case "interactive":
        await handleInteractiveMessage(from, message.interactive);
        break;

      case "image": // 📸 New case
        await handleImageMessage(from, message.image);
        break;

      default:
        console.log(`⚠️ Unsupported type: ${message.type}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error handling message:", err);
    res.sendStatus(500);
  }
};
