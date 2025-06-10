<template>
  <footer class="footer-custom">
    <div class="footer-content">
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-4">
            <div class="footer-brand mb-4">
              <i class="bi bi-lightbulb-fill me-2"></i>
              <span class="fw-bold">AutoQuizGen</span>
            </div>
            <p class="footer-description">
              Công cụ tạo quiz tự động thông minh giúp giáo viên và học sinh dễ dàng tạo ra các bài kiểm tra chất lượng cao với sức mạnh của AI.
            </p>
          </div>
          
          <div class="col-sm-6 col-lg-4">
            <h5 class="footer-heading">Truy cập nhanh</h5>
            <ul class="footer-links">
              <li><router-link to="/">Trang chủ</router-link></li>
              <li><router-link to="/documents">Tài liệu</router-link></li>
              <li><router-link to="/quizzes">Quiz</router-link></li>
              <li><router-link to="/quizzes/create">Tạo quiz mới</router-link></li>
            </ul>
          </div>
          
          <div class="col-sm-6 col-lg-4">
            <h5 class="footer-heading">Hỗ trợ</h5>
            <ul class="footer-links">
              <li><a href="#">Hướng dẫn sử dụng</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
        
        <hr class="footer-divider">
        
        <div class="footer-bottom">
          <div class="copyright">
            &copy; {{ currentYear }} AutoQuizGen - Mọi quyền được bảo lưu
          </div>
          
          <div class="social-links">
            <a href="#" class="social-link"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social-link"><i class="bi bi-youtube"></i></a>
            <a href="#" class="social-link"><i class="bi bi-github"></i></a>
            <a href="#" class="social-link"><i class="bi bi-envelope"></i></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Footer',
  setup() {
    const currentYear = new Date().getFullYear();
    
    return {
      currentYear
    };
  }
}
</script>

<style scoped>
.footer-custom {
  position: relative;
  margin-top: 3rem;
}

.footer-content {
  background-color: #f8f9fa;
  padding: 4rem 0 2rem;
  color: #4a5568;
}

.footer-brand {
  font-size: 1.5rem;
  color: #4776e6;
  display: flex;
  align-items: center;
}

.footer-description {
  font-size: 0.95rem;
  margin-top: 1rem;
  color: #718096;
  line-height: 1.6;
}

.footer-heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  border-radius: 3px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.7rem;
}

.footer-links a {
  color: #718096;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
  position: relative;
  padding-left: 0;
}

.footer-links a:hover {
  color: #4776e6;
  transform: translateX(5px);
}

.footer-divider {
  margin: 2rem 0;
  opacity: 0.1;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 0.9rem;
  color: #718096;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #4776e6;
  font-size: 1rem;
  transition: all 0.3s;
}

.social-link:hover {
  transform: translateY(-3px);
  background-color: #4776e6;
  color: white;
  box-shadow: 0 5px 15px rgba(71, 118, 230, 0.3);
}

@media (max-width: 767.98px) {
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>