const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: Number, // Chỉ số của đáp án đúng trong mảng options
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
});

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    questions: [questionSchema],
    filePath: {
        type: String
    },
    fileType: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Đảm bảo trường này là không bắt buộc
    }
});

module.exports = mongoose.model('Document', documentSchema);