require('dotenv').config();

module.exports = {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autoquizgen'
};