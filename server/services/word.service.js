const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun } = require('docx');

class WordService {
    async createQuizDocument(quizData) {
        const doc = new Document();

        // Add title
        doc.addSection({
            properties: {},
            children: [
                new Paragraph({
                    text: 'Quiz Questions',
                    heading: 'Heading1',
                }),
            ],
        });

        // Add questions and answers
        quizData.questions.forEach((question, index) => {
            doc.addSection({
                properties: {},
                children: [
                    new Paragraph({
                        text: `${index + 1}. ${question.text}`,
                        bullet: {
                            level: 0,
                        },
                    }),
                    ...question.answers.map((answer, answerIndex) => {
                        return new Paragraph({
                            text: `   ${String.fromCharCode(65 + answerIndex)}. ${answer.text}`,
                            bullet: {
                                level: 1,
                            },
                        });
                    }),
                    new Paragraph({
                        text: `Correct Answer: ${question.correctAnswer}`,
                        spacing: { after: 300 },
                    }),
                    new Paragraph({
                        text: `Explanation: ${question.explanation}`,
                        spacing: { after: 600 },
                    }),
                ],
            });
        });

        // Create a buffer and write to a file
        const buffer = await Packer.toBuffer(doc);
        const filePath = path.join(__dirname, '../../uploads/quiz.docx');
        fs.writeFileSync(filePath, buffer);

        return filePath;
    }
}

module.exports = new WordService();