const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load biến môi trường từ file .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));  // Tăng giới hạn kích thước cho JSON
app.use(express.urlencoded({ extended: true }));

// Cấu hình đường dẫn tĩnh cho thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Đảm bảo thư mục uploads tồn tại
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Kết nối Database trực tiếp với URI từ biến môi trường
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autoquizgen';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // Đã loại bỏ useCreateIndex và useFindAndModify vì không còn cần thiết
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth.routes');
const documentRoutes = require('./routes/document.routes');
const quizRoutes = require('./routes/quiz.routes');

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/quizzes', quizRoutes);

// Route mặc định cho trang chủ
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to AutoQuizGen API' });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Có lỗi xảy ra từ phía server',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});