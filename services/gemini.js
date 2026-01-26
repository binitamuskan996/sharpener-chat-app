const genai = require("@google/genai");

const client = new genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getGeminiResponse(prompt) {
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });

    if (!response?.text) {
      throw new Error("No text returned from Gemini");
    }

    return response.text;
  } catch (err) {
    console.error("Gemini API error:", err.message);
    throw err;
  }
}
module.exports=getGeminiResponse;