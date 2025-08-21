const axios=require('axios')


// WhatsApp details (from Meta)
const PHONE_NUMBER_ID = "675969745610659"; // your phone number ID
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN; // put your token in .env

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