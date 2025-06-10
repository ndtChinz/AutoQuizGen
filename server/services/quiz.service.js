const Quiz = require('../models/quiz.model');
const OpenAIService = require('./openai.service');

// Function to generate quiz from text or document
const generateQuiz = async (content) => {
    try {
        const summary = await OpenAIService.summarizeContent(content);
        const questions = await OpenAIService.generateQuestions(summary);
        
        const quiz = new Quiz({
            summary,
            questions,
            createdAt: new Date(),
        });

        await quiz.save();
        return quiz;
    } catch (error) {
        throw new Error('Error generating quiz: ' + error.message);
    }
};

// Function to retrieve quizzes from the database
const getQuizzes = async () => {
    try {
        return await Quiz.find().sort({ createdAt: -1 });
    } catch (error) {
        throw new Error('Error retrieving quizzes: ' + error.message);
    }
};

// Function to find a quiz by ID
const getQuizById = async (id) => {
    try {
        return await Quiz.findById(id);
    } catch (error) {
        throw new Error('Error retrieving quiz: ' + error.message);
    }
};

// Function to delete a quiz by ID
const deleteQuiz = async (id) => {
    try {
        await Quiz.findByIdAndDelete(id);
        return { message: 'Quiz deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting quiz: ' + error.message);
    }
};

module.exports = {
    generateQuiz,
    getQuizzes,
    getQuizById,
    deleteQuiz,
};