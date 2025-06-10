const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// Các routes không cần xác thực
router.post('/create', quizController.createQuiz);
router.post('/generate', quizController.generateQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;