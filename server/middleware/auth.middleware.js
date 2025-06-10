const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    // Bỏ qua kiểm tra xác thực, cho phép tất cả request đi qua
    // Thêm một user mặc định nếu cần sử dụng req.user trong các controller
    req.user = {
        id: "guest",
        username: "guest",
        email: "guest@example.com"
    };
    
    next();
    
    // Code xác thực token cũ đã được comment
    /* 
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    */
};

module.exports = authMiddleware;