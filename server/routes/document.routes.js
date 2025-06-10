const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const multer = require('multer');

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes cơ bản
router.get('/', documentController.getAllDocuments);
router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/:id', documentController.getDocumentById);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

// QUAN TRỌNG: Thêm route này để xử lý tạo quiz từ document
router.post('/:id/generate-quiz', documentController.generateQuizFromDocument);

module.exports = router;