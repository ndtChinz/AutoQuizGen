const Document = require('../models/document.model');
const documentService = require('../services/document.service');
const openaiService = require('../services/openai.service');
const pdfUtils = require('../utils/pdf.utils');
const textUtils = require('../utils/text.utils');
const fs = require('fs');

// Lấy tất cả tài liệu
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tài liệu', error: error.message });
  }
};

// Tải lên và xử lý tài liệu
exports.uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: 'Vui lòng tải lên một tệp' });
    }
    
    let textContent = '';
    
    // Trích xuất nội dung dựa trên loại file
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      textContent = await pdfUtils.extractTextFromPDF(file.path);
    } else if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
      textContent = await textUtils.readTextFile(file.path);
    } else {
      return res.status(400).json({ message: 'Định dạng tệp không được hỗ trợ' });
    }
    
    // Sử dụng AI để tóm tắt và tạo câu hỏi
    const summary = await openaiService.generateSummaryAndQuestions(textContent.substring(0, 4000));
    const questions = await openaiService.generateQuestions(textContent.substring(0, 3000));
    
    // Lưu tài liệu vào cơ sở dữ liệu nhưng không liên kết với userId
    const newDocument = new Document({
      title: file.originalname,
      content: textContent,
      summary: summary,
      questions: questions,
      filePath: file.path,
      fileType: file.mimetype,
      createdAt: new Date()
      // Không thêm trường userId
    });
    
    const savedDocument = await newDocument.save();
    res.status(201).json({ 
      message: 'Tài liệu đã được tải lên và xử lý thành công', 
      document: savedDocument 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xử lý tài liệu', error: error.message });
  }
};

// Lấy tài liệu theo ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin tài liệu', error: error.message });
  }
};

// Xóa tài liệu
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    
    // Xóa file nếu tồn tại
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Xóa tài liệu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa tài liệu', error: error.message });
  }
};

// Cập nhật tài liệu
exports.updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title && !content) {
      return res.status(400).json({ message: 'Không có thông tin cập nhật' });
    }
    
    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    
    res.status(200).json({ 
      message: 'Cập nhật tài liệu thành công', 
      document: updatedDocument 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật tài liệu', error: error.message });
  }
};

// Tạo nhanh quiz từ tài liệu
exports.generateQuizFromDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Lấy thông tin document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    
    // Kiểm tra xem document đã có sẵn câu hỏi chưa
    if (!document.questions || document.questions.length === 0) {
      return res.status(400).json({ message: 'Tài liệu không có câu hỏi để tạo quiz' });
    }
    
    // Tạo quiz mới từ thông tin document
    const Quiz = require('../models/quiz.model');
    const newQuiz = new Quiz({
      title: `Quiz từ ${document.title}`,
      description: `Quiz được tạo tự động từ tài liệu: ${document.title}`,
      questions: document.questions,
      documentId: document._id, // Lưu tham chiếu đến document gốc
      createdAt: new Date()
    });
    
    // Lưu quiz vào database
    await newQuiz.save();
    
    // Trả về thông tin quiz mới tạo
    res.status(201).json({
      message: 'Tạo quiz thành công',
      quiz: newQuiz
    });
  } catch (error) {
    console.error('Error in generateQuizFromDocument:', error);
    res.status(500).json({
      message: 'Lỗi khi tạo quiz từ tài liệu',
      error: error.message
    });
  }
};