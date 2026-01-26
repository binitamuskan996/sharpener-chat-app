const getGeminiResponse = require("../services/gemini");


const suggestMessage = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.length < 2) {
            return res.json({ suggestions: [] });
        }

        const prompt = `Suggest 3 short next-word or phrase completions for this message:"${text}"
                        Return ONLY the suggestions as a comma-separated list.Do NOT include explanations or instructions.`;

        const response = await getGeminiResponse(prompt);

        const suggestions = response
            .split(",")
            .map(s => s.trim())
            .filter(s =>
                s &&
                !s.toLowerCase().includes("suggest") &&
                !s.toLowerCase().includes("return") &&
                !s.toLowerCase().includes("message") &&
                s.length < 40
            )
            .slice(0, 3);

        res.json({ suggestions });
    } catch (err) {
        console.error("AI Suggestion Error:", err.message);
        res.json({ suggestions: [] }); 
    }
};
const smartReply = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || message.length < 2) {
            return res.json({ replies: [] });
        }

        const prompt = `Generate 3 short, natural chat replies for this message:"${message}"Keep replies concise and friendly.
                        Return them as a numbered list.Do NOT include explanations or instructions.`;

        const response = await getGeminiResponse(prompt);

        const replies = response
            .split("\n")
            .map(r => r.replace(/^\d+\.?\s*/, "").trim())
            .filter(r =>
                r &&
                !r.toLowerCase().includes("generate") &&
                !r.toLowerCase().includes("return") &&
                !r.toLowerCase().includes("reply") &&
                r.length < 60
            )
            .slice(0, 3);

        res.json({ replies });
    } catch (err) {
        console.error("AI Smart Reply Error:", err.message);
        res.json({ replies: [] });
    }
};

module.exports = { suggestMessage, smartReply };
