// // controllers/webhookController.js
// const axios = require("axios");

// const PHONE_NUMBER_ID = "675969745610659"; // your phone number ID
// const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
// const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// // Webhook verification
// exports.verifyWebhook = (req, res) => {
//     const mode = req.query["hub.mode"];
//     const token = req.query["hub.verify_token"];
//     const challenge = req.query["hub.challenge"];

//     if (mode && token) {
//         if (mode === "subscribe" && token === VERIFY_TOKEN) {
//             console.log("✅ WEBHOOK_VERIFIED");
//             res.status(200).send(challenge);
//         } else {
//             res.sendStatus(403);
//         }
//     }
// };

// // Receive incoming messages and reply to "hi"
// exports.receiveMessage = async (req, res) => {
//     console.log("📩 Incoming webhook:", JSON.stringify(req.body, null, 2));

//     try {
//         const messages = req.body.entry?.[0]?.changes?.[0]?.value?.messages;
//         if (!messages) {
//             console.log("⚠️ No messages found in webhook");
//             return res.sendStatus(200);
//         }

//         const message = messages[0];
//         const from = message.from;
//         const text = message.text?.body?.toLowerCase();

//         console.log(`📨 Message from ${from}: ${text}`);

//         if (text === "hi") {
//             console.log("🟢 Sending reply...");
//             await sendReply(from, "👋 Welcome! Thanks for saying hi!");
//         }
//     } catch (err) {
//         console.error("❌ Error handling message:", err.message);
//     }

//     res.sendStatus(200);
// };

// // Helper function to send WhatsApp message
// async function sendReply(to, body) {
//     try {
//         const response = await axios.post(
//             `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
//             {
//                 messaging_product: "whatsapp",
//                 to,
//                 type: "text",
//                 text: { body },
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${ACCESS_TOKEN}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("✅ Reply sent:", response.data);
//     } catch (error) {
//         console.error("❌ Failed to send reply:", error.response?.data || error.message);
//     }
// }
