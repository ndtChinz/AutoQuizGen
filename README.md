# AutoQuizGen

AutoQuizGen là nền tảng tạo bài kiểm tra (quiz) tự động từ tài liệu PDF, Word, TXT hoặc văn bản nhập tay, sử dụng trí tuệ nhân tạo (AI) để sinh câu hỏi trắc nghiệm chất lượng cao cho giáo viên và học sinh.

## Tính năng nổi bật

- Tải lên tài liệu (PDF, Word, TXT) và tự động sinh quiz từ nội dung.
- Tạo quiz từ văn bản nhập tay hoặc tạo thủ công.
- Xem, chỉnh sửa, xóa, quản lý tài liệu và quiz.
- Giao diện hiện đại, dễ sử dụng.
- Hỗ trợ xác thực người dùng (có thể mở rộng).
- Sử dụng OpenAI API để tóm tắt và sinh câu hỏi.

## Cấu trúc thư mục

```
autoquizgen/
├── autoquizgen-client/   # Frontend (Vue.js)
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   └── services/
│   ├── public/
│   ├── package.json
│   └── ...
├── server/               # Backend (Node.js/Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   ├── package.json
│   └── ...
└── README.md
```

## Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB >= 4.x
- Tài khoản OpenAI (API key)

## Cài đặt

### 1. Clone project

```sh
git clone https://github.com/yourusername/autoquizgen.git
cd autoquizgen
```

### 2. Cài đặt backend

```sh
cd server
npm install
```

Tạo file `.env` trong thư mục `server/` với nội dung ví dụ:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoquizgen
OPENAI_API_KEY=sk-xxxxxx
```

### 3. Cài đặt frontend

```sh
cd ../autoquizgen-client
npm install
```

Tạo file `.env` trong thư mục `autoquizgen-client/` với nội dung ví dụ:
```
VUE_APP_API_URL=http://localhost:5000/api
```

## Chạy ứng dụng

### 1. Khởi động backend

```sh
cd server
npm start
```

### 2. Khởi động frontend

```sh
cd autoquizgen-client
npm run serve
```

- Truy cập frontend tại: http://localhost:8080
- API backend chạy tại: http://localhost:5000/api

## Hướng dẫn sử dụng

1. Đăng nhập hoặc sử dụng tài khoản mặc định (nếu chưa bật xác thực).
2. Tải lên tài liệu hoặc nhập văn bản để tạo quiz tự động.
3. Xem, chỉnh sửa, làm bài quiz và quản lý tài liệu/quiz của bạn.

## Công nghệ sử dụng

- **Frontend:** Vue.js 3, Vuex, Vue Router, Bootstrap 5
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI:** OpenAI GPT API (tóm tắt & sinh câu hỏi)
- **Khác:** Multer (upload file), JWT (xác thực, nếu bật)

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request.

## License

MIT License

---

**AutoQuizGen** - Nền tảng tạo quiz tự động thông minh cho giáo viên & học sinh.