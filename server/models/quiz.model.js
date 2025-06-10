const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    },
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            options: [{
                type: String,
                required: true
            }],
            correctAnswer: {
                type: Number,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Đảm bảo trường này là không bắt buộc // Đảm bảo trường này là không bắt buộc
    }
});

module.exports = mongoose.model('Quiz', quizSchema);