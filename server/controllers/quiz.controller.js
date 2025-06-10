const Quiz = require('../models/quiz.model');
const OpenAIService = require('../services/openai.service');

// Tạo quiz mới (được gọi từ routes)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions, documentId } = req.body;
    
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Vui lòng cung cấp tiêu đề và danh sách câu hỏi' });
    }
    
    const newQuiz = new Quiz({
      title,
      description,
      questions,
      documentId,
      createdAt: new Date()
      // Không thêm trường createdBy
    });
    
    const savedQuiz = await newQuiz.save();
    res.status(201).json({ 
      message: 'Tạo quiz thành công',
      quiz: savedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo quiz', error: error.message });
  }
};

// Tạo câu hỏi trắc nghiệm từ văn bản hoặc tài liệu
exports.generateQuiz = async (req, res) => {
    try {
        const { text, title, description } = req.body;

        if (!text) {
          return res.status(400).json({ message: 'Vui lòng cung cấp nội dung văn bản' });
        }

        // Tóm tắt văn bản
        const summary = await OpenAIService.generateSummaryAndQuestions(text);
        
        // Tạo câu hỏi
        const questions = await OpenAIService.generateQuestions(text);

        // Lưu quiz vào cơ sở dữ liệu không cần createdBy
        const quiz = new Quiz({
            title: title || 'Quiz tự động ' + new Date().toLocaleString('vi-VN'),
            description: description || summary.substring(0, 100) + '...',
            summary,
            questions,
            createdAt: new Date()
        });

        await quiz.save();

        res.status(201).json({
            message: 'Tạo quiz thành công',
            quiz,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi tạo quiz tự động',
            error: error.message,
        });
    }
};

// Lấy danh sách các quiz đã tạo (đổi tên để đồng nhất với routes)
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách quiz',
            error: error.message,
        });
    }
};

// Lấy thông tin chi tiết của một quiz theo ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Không tìm thấy quiz' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi lấy thông tin quiz',
            error: error.message,
        });
    }
};

// Cập nhật quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }
    
    res.status(200).json({ 
      message: 'Cập nhật quiz thành công',
      quiz: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật quiz', error: error.message });
  }
};

// Xóa quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }
    res.status(200).json({ message: 'Xóa quiz thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa quiz', error: error.message });
  }
};

// Đặt bí danh cho getQuizzes để tương thích ngược 
exports.getQuizzes = exports.getAllQuizzes;