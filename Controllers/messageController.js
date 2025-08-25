const { sendReply, sendTextReply, sendButtons, sendServiceButtons, sendCareButtons } = require("./whatsappController");
const { setSession, getSession } = require("../sessionStore");

// ✅ Handle Button Click (Service Selection)
exports.handleInteractiveMessage = async (from, interactive) => {
    if (interactive.type === "button_reply") {
        const buttonId = interactive.button_reply.id;
        setSession(from, { service: buttonId, step: "location" });

        if (buttonId === "med-delivery") {
            await sendReply(from, "🚚 Medicine Delivery selected!\nPlease share your location.");
        } else if (buttonId === "lab-test") {
            await sendReply(from, "🧪 Lab Test at Home selected!\nPlease share your location.");
        } else if (buttonId === "care-home") {
            await sendReply(from, "🏡 Care at Home selected!\nPlease share your location.");
        }
    }
};

// ✅ Handle Location
exports.handleLocationMessage = async (from, location) => {
    const session = getSession(from);
    if (session?.step === "location") {
        console.log(`📍 Location: ${location.latitude}, ${location.longitude}`);
        setSession(from, { ...session, location, step: "age" });
        await sendTextReply(from, "✅ Thanks! Now please enter your age.");
    }
};

// ✅ Handle Text
exports.handleTextMessage = async (from, text) => {
    let session = getSession(from);

    if (["hi", "start"].includes(text.toLowerCase())) {
        setSession(from, null); // clear old
        setSession(from, { step: "service" });
        await sendServiceButtons(from);
        return;
    }

    // 🔹 If no session yet → send service buttons
    if (!session) {
        setSession(from, { step: "service" });
        await sendServiceButtons(from);
        return;
    }

    // 🔹 Handle Age
    if (session?.step === "age") {
        const age = parseInt(text, 10);
        if (isNaN(age)) {
            await sendReply(from, "⚠️ Please enter a valid number for age.");
            return;
        }

        setSession(from, { ...session, age, step: "final" });

        if (session.service === "med-delivery") {
            await sendReply(from, `✅ Age: ${age}\nNow please upload your prescription 📄 (send as photo).`);
        } else if (session.service === "lab-test") {
            await sendReply(from, `✅ Age: ${age}\nPlease enter the tests needed OR upload a prescription 📄 (send as photo).`);
        } else if (session.service === "care-home") {
            await sendReply(from, `✅ Age: ${age}`);
            await sendCareButtons(from); // doctor / nursing / physio
        }
    }

    // 🔹 Handle Lab Test text (instead of photo)
    if (session?.step === "final" && session.service === "lab-test" && !session.prescriptionId) {
        setSession(from, { ...session, tests: text });
        await sendReply(from, "🧪 Please select a preferred time slot for your Lab Test:");
    }
};

// ✅ Confirmation / Slot Options
exports.handleOrderConfirmAndSlot = async (from, session) => {
    if (session.service === "med-delivery") {
        // Send Yes / No confirmation
        await sendReply(from, "🛒 Do you want to confirm your medicine order?");
        await sendButtons(from, "Confirm your order?", [
            { id: "yes", title: "✅ Yes" },
            { id: "no", title: "❌ No" }
        ]);

        setSession(from, { ...session, step: "confirm" });

    } else if (session.service === "lab-test") {
        // Send available time slots
        await sendReply(from, "🧪 Please select a preferred time slot for your Lab Test:");
        await sendButtons(from, "Pick a time slot:", [
            { id: "slot1", title: "⏰ 9-11 AM" },
            { id: "slot2", title: "⏰ 12-2 PM" },
            { id: "slot3", title: "⏰ 4-6 PM" }
        ]);

        setSession(from, { ...session, step: "slot" });

    } else if (session.service === "care-home") {
        // Care at home – doctor/nurse/physio time slots
        await sendReply(from, "🏡 Please select a time slot for Care at Home service:");
        await sendButtons(from, "Choose your time slot:", [
            { id: "morning", title: "🌅 Morning" },
            { id: "afternoon", title: "🌞 Afternoon" },
            { id: "evening", title: "🌙 Evening" }
        ]);
        setSession(from, { ...session, step: "slot" });
    }
};


// ✅ Handle Photo (Prescription Upload)
exports.handleImageMessage = async (from, image) => {
    const session = getSession(from);

    if (session?.step === "final" && session.service === "med-delivery") {
        setSession(from, { ...session, prescriptionId: image.id });
        await sendReply(from, "📄 Prescription received! ✅ Our team will verify it shortly.");
        await exports.handleOrderConfirmAndSlot(from, getSession(from));
    } else if (session?.step === "final" && session.service === "lab-test") {
        setSession(from, { ...session, prescriptionId: image.id });
        await sendReply(from, "📄 Lab Test prescription received! ✅ Please wait for confirmation.");
        await exports.handleOrderConfirmAndSlot(from, getSession(from));
    }
};
