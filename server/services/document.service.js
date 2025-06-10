const Document = require('../models/document.model');
const OpenAIService = require('./openai.service');

class DocumentService {
    async processDocument(fileContent) {
        try {
            // Tóm tắt nội dung được thực hiện ở controller, không cần lặp lại ở đây
            // Chỉ cần trả về cấu trúc câu hỏi mẫu
            return [
                {
                    question: "Đây là câu hỏi mẫu?",
                    options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                    correctAnswer: 0,
                    explanation: "Đây là giải thích cho đáp án mẫu"
                }
            ];
        } catch (error) {
            console.error("Error processing document:", error);
            throw new Error("Could not process document");
        }
    }

    // Phương thức để trích xuất văn bản từ tệp
    async extractTextFromFile(file) {
        // Triển khai trong utils, không cần ở đây
        return "Sample text from file";
    }
}

module.exports = new DocumentService();