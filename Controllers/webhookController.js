const { sendReply, sendButtons, sendTextReply, sendCareButtons } = require("../Services/whatsappService");
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook verification
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

// Handle incoming messages
exports.receiveMessage = async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (!message) return res.sendStatus(200);

        const from = message.from; // user phone

        // ✅ Handle Text Messages
        if (message.type === "text") {
            const userInput = message.text.body;
            console.log(`📨 Text from ${from}: ${userInput}`);

            if (!isNaN(userInput)) {
                const age = parseInt(userInput, 10);

                // Save age to DB / session if needed
                console.log(`User age received: ${age}`);

                // Ask next question (example: symptoms)
                await sendReply(from, `✅ Got it! Your age is ${age}. Please tell me your symptoms.`);
            } else if(userInput){
                await sendButtons(from, "Welcome to warmy Please Select an Option"); // send interactive buttons
            }
        }

        // 📍 If user sends location
        if (message.type === "location") {
            const location = message.location;
            console.log(`📍 User shared location: ${location.latitude}, ${location.longitude}`);

            // You can now store location in DB or use it
            await sendTextReply(from, "✅ Thanks! We got your location");
            await sendCareButtons(from)
        }



        // ✅ Handle Button/Interactive Replies
        if (message.type === "interactive") {
            const interactive = message.interactive;

            // selction1

            if (interactive.type === "button_reply" && (interactive.button_reply.id == "med-delivery" || interactive.button_reply.id == "lab-test" || interactive.button_reply.id == "care-home")) {
                const buttonId = interactive.button_reply.id;
                const buttonTitle = interactive.button_reply.title;

                console.log(`🔘 User clicked: ${buttonTitle} (ID: ${buttonId})`);

                if (buttonId === "med-delivery") {
                    await sendReply(from, "Welcome to warmy 🚚 Medicine Delivery selected! \n Please send your location");
                } else if (buttonId === "lab-test") {
                    await sendReply(from, "Welcome to warmy 🧪 Lab Test at Home selected! \n Please send your location");
                } else if (buttonId === "care-home") {
                    await sendReply(from, "Welcome to warmy 🏡 Care at Home selected! \n Please send your location");
                } else {
                    await sendButtons(from, "Please Select a valid Option"); // send interactive buttons
                }
            } else if (interactive.type === "button_reply" && (interactive.button_reply.id == "doctor-consult" || interactive.button_reply.id == "nursing-care" || interactive.button_reply.id == "physiotherapy")) {
                const buttonId = interactive.button_reply.id;
                const buttonTitle = interactive.button_reply.title;

                console.log(`🔘 User clicked: ${buttonTitle} (ID: ${buttonId})`);

                if (buttonId === "doctor-consult") {
                    await sendReply(from, "👨‍⚕️ Doctor Consultation selected!\nPlease enter your age:");
                } else if (buttonId === "nursing-care") {
                    await sendReply(from, "🩺 Nursing Care selected!\nPlease enter your age:");
                } else if (buttonId === "physiotherapy") {
                    await sendReply(from, "🤸 Physiotherapy selected!\nPlease enter your age:");
                } else {
                    await sendCareButtons(from, "Please Select a valid Option"); // send interactive buttons
                }
            }
        }

    } catch (err) {
        console.error("❌ Error handling message:", err.message);
    }

    res.sendStatus(200);
};
