const axios = require("axios");
const token = process.env.WHATSAPP_TOKEN; // put your token in .env
const phoneNumberId = process.env.PHONE_NUMBER_ID; // from Meta console

const apiUrl = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

// ✅ Basic Text
exports.sendReply = async (to, text) => {
  await axios.post(apiUrl, {
    messaging_product: "whatsapp",
    to,
    text: { body: text }
  }, { headers: { Authorization: `Bearer ${token}` } });
};

// ✅ Simple Text
exports.sendTextReply = exports.sendReply;

// ✅ Service Buttons (first step)
exports.sendServiceButtons = async (to) => {
  await axios.post(apiUrl, {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: "👋 Welcome! Please choose a service:" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "med-delivery", title: "🚚 Medicine Delivery" } },
          { type: "reply", reply: { id: "lab-test", title: "🧪 Lab Test at Home" } },
          { type: "reply", reply: { id: "care-home", title: "🏡 Care at Home" } }
        ]
      }
    }
  }, { headers: { Authorization: `Bearer ${token}` } });
};

// ✅ Care Buttons (doctor / nursing / physio)
exports.sendCareButtons = async (to) => {
  await axios.post(apiUrl, {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: "Please choose the type of care you need:" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "doctor", title: "👨‍⚕️ Doctor" } },
          { type: "reply", reply: { id: "nursing", title: "🩺 Nursing" } },
          { type: "reply", reply: { id: "physio", title: "🤸 Physiotherapy" } }
        ]
      }
    }
  }, { headers: { Authorization: `Bearer ${token}` } });
};

exports.sendButtons = async (to, text, buttons) => {
  await axios.post(apiUrl, {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text },
      action: {
        buttons: buttons.map(b => ({
          type: "reply",
          reply: { id: b.id, title: b.title }
        }))
      }
    }
  }, { headers: { Authorization: `Bearer ${token}` } });
};
