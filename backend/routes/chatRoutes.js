import express from "express";
import axios from "axios";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../config/config.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const customPrompt = `
      You are a chatbot for **Meal Connect**, a platform where donors provide food to registered receivers.
      Your job is to assist **food receivers** by answering their questions about receiving food.

      **Guidelines:**
      - If the user asks **how to get food**, guide them through the registration and food pickup process.
      - If they ask about **delivery**, clarify that food pickup locations are available.
      - If they ask about **contacting donors**, explain that direct donor contact is not provided for privacy reasons.
      - If the question is **off-topic**, politely bring the conversation back to Meal Connect's services.

      **User Question:** "${userMessage}"
      **Your Answer (specific to Meal Connect's food receivers):**
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: customPrompt }] }],
      }
    );

    res.json({ reply: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error(
      "Error calling Gemini API:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Ensure you export the router
export default router;
