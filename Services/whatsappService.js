const axios = require("axios");

const PHONE_NUMBER_ID = "675969745610659";
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;

// 🔹 Send Plain Text Reply
async function sendReply(to, text) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to,
                text: { body: text },
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("✅ Text reply sent:", response.data);
    } catch (error) {
        console.error("❌ Failed to send text reply:", error.response?.data || error.message);
    }
}

// 🔹 Send Buttons
async function sendButtons(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "Choose an option 👇" },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: { id: "med-delivery", title: "Medicine Delivery" },
                            },
                            {
                                type: "reply",
                                reply: { id: "lab-test", title: "Lab Test at Home" },
                            },
                            {
                                type: "reply",
                                reply: { id: "care-home", title: "Care at Home" },
                            },
                        ],
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("✅ Buttons sent:", response.data);
    } catch (error) {
        console.error("❌ Failed to send buttons:", error.response?.data || error.message);
    }
}

async function sendTextReply(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Text reply sent");
  } catch (error) {
    console.error("❌ Failed to send text:", error.response?.data || error.message);
  }
}

async function sendCareButtons(to) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "💊 Please choose a service:",
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: "doctor-consult", title: "Doctor" } },
          { type: "reply", reply: { id: "nursing-care", title: "Nursing" } },
          { type: "reply", reply: { id: "physiotherapy", title: "Physio" } },
        ],
      },
    },
  };

  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Care buttons sent");
  } catch (error) {
    console.error("❌ Failed to send care buttons:", error.response?.data || error.message);
  }
}


module.exports = { sendReply, sendButtons ,sendTextReply,sendCareButtons};
