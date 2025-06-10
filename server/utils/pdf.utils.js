const pdf = require('pdf-parse');
const fs = require('fs');

// Function to extract text from a PDF file
const extractTextFromPDF = (filePath) => {
    return new Promise((resolve, reject) => {
        let dataBuffer = fs.readFileSync(filePath);
        pdf(dataBuffer).then(function(data) {
            resolve(data.text);
        }).catch(err => {
            reject(err);
        });
    });
};

// Function to save the uploaded PDF file to a specified directory
const savePDF = (file) => {
    const uploadPath = `uploads/${file.originalname}`;
    return new Promise((resolve, reject) => {
        fs.writeFile(uploadPath, file.buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(uploadPath);
            }
        });
    });
};

module.exports = {
    extractTextFromPDF,
    savePDF
};