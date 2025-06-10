const fs = require('fs').promises;
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Lấy API key từ biến môi trường
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Hàm tiện ích để gọi OpenAI API với prompt đơn giản
const askOpenAI = async (prompt, model = "gpt-4o-mini", maxTokens = 1000) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: maxTokens
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
        console.error("Error calling OpenAI API:", error.response?.data || error.message);
        throw new Error("Unable to get response from OpenAI");
    }
};

const summarizeText = async (text) => {
    try {
        return await askOpenAI(`Tóm tắt nội dung sau: ${text.substring(0, 4000)}`, "gpt-4o-mini", 500);
    } catch (error) {
        console.error("Error summarizing text:", error);
        throw new Error("Unable to summarize text");
    }
};

const generateQuizQuestions = async (summary) => {
    try {
        return await askOpenAI(`Tạo câu hỏi trắc nghiệm từ nội dung sau: ${summary.substring(0, 4000)}`, "gpt-4o-mini", 1000);
    } catch (error) {
        console.error("Error generating quiz questions:", error);
        throw new Error("Unable to generate quiz questions");
    }
};

// Đọc nội dung từ file văn bản
const readTextFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data;
    } catch (error) {
        console.error("Error reading text file:", error);
        throw new Error("Could not read text file");
    }
};

module.exports = {
    summarizeText,
    generateQuizQuestions,
    readTextFile,
    askOpenAI
};