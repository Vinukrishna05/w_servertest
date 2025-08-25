const {sendReply,sendTextReply,sendServiceButtons,sendCareButtons} = require("./whatsappController");
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
    await sendReply(from, `📝 Tests noted: ${text}\n✅ Our team will confirm shortly.`);
  }
};

// ✅ Handle Photo (Prescription Upload)
exports.handleImageMessage = async (from, image) => {
  const session = getSession(from);

  if (session?.step === "final" && session.service === "med-delivery") {
    setSession(from, { ...session, prescriptionId: image.id });
    await sendReply(from, "📄 Prescription received! ✅ Our team will verify it shortly.");
  } else if (session?.step === "final" && session.service === "lab-test") {
    setSession(from, { ...session, prescriptionId: image.id });
    await sendReply(from, "📄 Lab Test prescription received! ✅ Please wait for confirmation.");
  } else {
    await sendReply(from, "⚠️ Please follow the steps (service → location → age).");
  }
};
