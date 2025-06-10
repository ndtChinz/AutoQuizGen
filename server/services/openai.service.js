const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

class OpenAIService {
    async generateSummaryAndQuestions(text) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "user", content: `Tóm tắt nội dung sau: ${text.substring(0, 4000)}` }
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("Error generating summary:", error.response?.data || error.message);
            throw new Error("Could not generate summary");
        }
    }

    async generateQuestions(text) {
        try {
            const prompt = `
            Tạo 5 câu hỏi trắc nghiệm từ nội dung sau đây. Trả về định dạng JSON như sau:
            [
                {
                    "question": "Câu hỏi trắc nghiệm?",
                    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                    "correctAnswer": 0, // Chỉ số của đáp án đúng (0 = A, 1 = B, etc.)
                    "explanation": "Giải thích lý do đáp án này đúng"
                }
            ]
            
            Nội dung: ${text.substring(0, 3000)}
            `;

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o-mini",  // Đổi thành gpt-4o-mini vì gpt-4 có thể không có quyền truy cập
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 1000,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0].message.content;
            // Tìm kiếm đoạn JSON trong văn bản
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Response không chứa dữ liệu JSON hợp lệ");
            }
        } catch (error) {
            console.error("Error generating questions:", error.response?.data || error.message);
            throw new Error("Could not generate questions");
        }
    }
}

module.exports = new OpenAIService();