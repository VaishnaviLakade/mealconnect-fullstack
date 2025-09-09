import dotenv from "dotenv";

dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT || 3000;
export const GEMINI_MODEL = "gemini-1.5-flash"; // Ensure this model is available
