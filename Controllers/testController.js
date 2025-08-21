const axios=require('axios')


// WhatsApp details (from Meta)
const PHONE_NUMBER_ID = "675969745610659"; // your phone number ID
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN; // put your token in .env
// controllers/webhookController.js
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ✅ Handle GET request for webhook verification
exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

// ✅ Handle POST request (incoming messages)
exports.receiveMessage = (req, res) => {
  console.log("📩 Incoming webhook:", JSON.stringify(req.body, null, 2));

  // Always return 200 to tell Meta you received the update
  res.sendStatus(200);
};


exports.startMessage=async(req,res)=>{
  const { to } = req.body;  // recipient number from client side
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
}