import express from "express";
import twilio from "twilio";
import Receiver from "../models/receiverModel.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "MealConnect",
  })
  .then(async () => {
    console.log("✅ MongoDB Connected");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📚 Collections:",
      collections.map((c) => c.name)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// Twilio setup
// Twilio setup
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhone = process.env.TWILIO_PHONE;

// State objects
let confirmedReceivers = [];
let pendingReceivers = new Set();
let remainingCapacity = 0;
let waitingForCount = {};

// 🔹 Send message to receiver
app.post("/send-message", async (req, res) => {
  let {
    phone,
    address,
    people_served,
    collectionStart,
    collectionEnd,
    delay = 0,
  } = req.body;

  if (
    !phone ||
    !address ||
    !collectionStart ||
    !collectionEnd ||
    !people_served
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
  remainingCapacity = Number(people_served);
  confirmedReceivers = [];
  pendingReceivers = new Set();
  waitingForCount = {};

  pendingReceivers.add(formattedPhone);

  setTimeout(async () => {
    try {
      const message = await client.messages.create({
        body: `नमस्ते\nभोजन उपलब्ध है।\nस्थान: ${address}\nसमय: ${collectionStart} - ${collectionEnd}\nयदि आप इसे प्राप्त करना चाहते हैं, तो \"YES\" भेजें।\nधन्यवाद।`,
        from: `whatsapp:${twilioPhone}`,
        to: `whatsapp:${formattedPhone}`,
      });

      console.log(`📤 Message sent to ${formattedPhone}: ${message.sid}`);
    } catch (error) {
      console.error(`❌ Failed to send WhatsApp: ${error.message}`);
    }
  }, delay);

  // ⏰ Auto close collection at end time
  const endTime = new Date(collectionEnd);
  const now = new Date();
  const autoCloseDelay = endTime - now;

  if (autoCloseDelay > 0) {
    setTimeout(async () => {
      if (remainingCapacity > 0 && pendingReceivers.size > 0) {
        const notifyOthers = [...pendingReceivers].filter(
          (p) => !confirmedReceivers.some((r) => `+91${r.phone}` === p)
        );
        for (const number of notifyOthers) {
          await client.messages.create({
            from: "whatsapp:+14155238886",
            to: `whatsapp:${number}`,
            body: "⌛ संग्रह का समय समाप्त हो गया है। अगली बार जल्दी उत्तर दें।",
          });
        }
        pendingReceivers.clear();
        console.log("🕒 Collection ended. Notified all pending users.");
      }
    }, autoCloseDelay);
  }

  res.status(200).json({ success: true, message: "Message scheduled" });
});

// 🔹 Webhook for responses
app.post("/webhook", async (req, res) => {
  const fromRaw = req.body.From?.replace("whatsapp:", "") || "";
  const from = fromRaw.replace("+91", "").trim();
  const fullPhone = `+91${from}`;
  const message = req.body.Body?.trim().toLowerCase();

  if (!from || !message) return res.sendStatus(400);

  if (waitingForCount[from]) {
    const count = parseInt(message);
    if (isNaN(count) || count <= 0) {
      await client.messages.create({
        from: "whatsapp:+14155238886",
        to: `whatsapp:${fullPhone}`,
        body: "❗ कृपया एक वैध संख्या भेजें (उदाहरण: 2 या 3)।",
      });
      return res.sendStatus(200);
    }

    if (remainingCapacity - count < 0) {
      await client.messages.create({
        from: "whatsapp:+14155238886",
        to: `whatsapp:${fullPhone}`,
        body: "⚠️ क्षमा करें, आपके लिए योग्य भोजन उपलब्ध नहीं है।",
      });
      delete waitingForCount[from];
      return res.sendStatus(200);
    }

    remainingCapacity -= count;
    delete waitingForCount[from];

    const receiver = await Receiver.findOne({ phone: from }).maxTimeMS(10000);
    if (receiver && !confirmedReceivers.some((r) => r.phone === from)) {
      confirmedReceivers.push({
        ...receiver.toObject(),
        phone: from,
        count,
        timestamp: new Date().toISOString(),
      });
    }

    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${fullPhone}`,
      body: `✅ ${count} व्यक्ति भोजन के लिए पंजीकृत किए गए हैं। धन्यवाद!`,
    });

    console.log(
      `✅ ${from} confirmed for ${count}. Remaining: ${remainingCapacity}`
    );

    if (remainingCapacity <= 0) {
      const notifyOthers = [...pendingReceivers].filter(
        (p) => !confirmedReceivers.some((r) => `+91${r.phone}` === p)
      );
      for (const number of notifyOthers) {
        await client.messages.create({
          from: "whatsapp:+14155238886",
          to: `whatsapp:${number}`,
          body: "⚠️ खेद है, भोजन अब समाप्त हो चुका है। अगली बार जल्दी उत्तर दें।",
        });
      }
      pendingReceivers.clear();
    }

    return res.sendStatus(200);
  }

  if (message === "yes") {
    if (remainingCapacity <= 0) {
      console.log(`⚠️ ${from} replied YES but food is over`);
      return res.sendStatus(200);
    }

    if (confirmedReceivers.some((r) => r.phone === from)) {
      console.log(`⚠️ ${from} already confirmed`);
      return res.sendStatus(200);
    }

    waitingForCount[from] = true;
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${fullPhone}`,
      body: "कृपया बताएं कि कितने लोग भोजन लेंगे? (उदाहरण: 2 या 3)",
    });

    return res.sendStatus(200);
  }

  console.log(`🤷 Unrecognized message from ${from}: ${message}`);
  await client.messages.create({
    from: "whatsapp:+14155238886",
    to: `whatsapp:${fullPhone}`,
    body: '❗ क्षमा करें, संदेश समझ नहीं आया। यदि भोजन चाहिएं तो "YES" भेजें।',
  });

  res.sendStatus(200);
});

// 🔹 Get confirmed receivers
app.get("/api/receivers", (req, res) => {
  const response = confirmedReceivers.map((r) => ({
    name: r.name,
    phone: r.phone,
    count: r.count,
    rem: remainingCapacity,
    timestamp: r.timestamp,
  }));
  res.json(response);
});

// 🔹 Get pending receivers
app.get("/api/pending-receivers", (req, res) => {
  const response = [...pendingReceivers]
    .filter((p) => !confirmedReceivers.some((r) => `+91${r.phone}` === p))
    .map((phone) => ({
      phone: phone.replace("+91", ""),
    }));
  res.json(response);
});

// 🔹 Start server
const PORT = 3005;
app.listen(PORT, () => console.log(`🚀 Twilio Server running on port ${PORT}`));
