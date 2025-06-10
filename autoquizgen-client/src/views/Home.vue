<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center gy-4">
          <div class="col-lg-7">
            <div class="hero-content">
              <h1 class="hero-title">
                <span class="hero-title-highlight">Tạo bài kiểm tra</span> thông minh 
              </h1>
              <p class="hero-description">
                AutoQuizGen sử dụng trí tuệ nhân tạo để tạo ra những bài kiểm tra chất lượng cao từ tài liệu của bạn, giúp tiết kiệm thời gian và nâng cao hiệu quả trong việc học tập .
              </p>
              <div class="hero-buttons">
                <router-link to="/documents/upload" class="btn btn-primary btn-lg btn-hero shadow">
                  <i class="bi bi-upload me-2"></i>Tải tài liệu lên
                </router-link>
                <router-link to="/quizzes/create" class="btn btn-outline-primary btn-lg btn-hero">
                  <i class="bi bi-pencil-square me-2"></i>Tạo quiz ngay
                </router-link>
              </div>
              <div class="hero-stats mt-4 d-flex flex-wrap">
                <div class="hero-stat">
                  <div class="hero-stat-number">1000+</div>
                  <div class="hero-stat-label">Tài liệu</div>
                </div>
                <div class="hero-stat">
                  <div class="hero-stat-number">5000+</div>
                  <div class="hero-stat-label">Quiz đã tạo</div>
                </div>
                <div class="hero-stat">
                  <div class="hero-stat-number">99%</div>
                  <div class="hero-stat-label">Độ hài lòng</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="hero-image-container">
            <img src="@/assets/autoquizgen.png" alt="AutoQuizGen logo" class="img-fluid hero-image" />              
            <div class="floating-item floating-item-1">
                <i class="bi bi-lightbulb-fill"></i>
              </div>
              <div class="floating-item floating-item-2">
                <i class="bi bi-file-earmark-text"></i>
              </div>
              <div class="floating-item floating-item-3">
                <i class="bi bi-question-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-shape">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
          <path fill="#fff" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,181.3C672,171,768,149,864,160C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header text-center">
          <h6 class="section-pre-title">TÍNH NĂNG NỔI BẬT</h6>
          <h2 class="section-title">Tại sao chọn AutoQuizGen?</h2>
          <p class="section-description">
            Nền tảng tạo bài kiểm tra thông minh dành cho giáo viên và học sinh, giúp học tập hiệu quả hơn
          </p>
        </div>
        
        <div class="row g-4 mt-3">
          <div class="col-md-6 col-xl-3" v-for="(feature, index) in features" :key="index">
            <div class="feature-card" :class="`feature-card-${index + 1}`">
              <div class="feature-icon">
                <i :class="`bi ${feature.icon}`"></i>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              <button class="btn btn-feature" @click="feature.action">
                Khám phá
                <i class="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works Section -->
    <section class="how-it-works-section">
      <div class="container">
        <div class="section-header text-center">
          <h6 class="section-pre-title">HƯỚNG DẪN</h6>
          <h2 class="section-title">Cách thức hoạt động</h2>
          <p class="section-description">
            Chỉ với 3 bước đơn giản để tạo ra bài kiểm tra chất lượng cao
          </p>
        </div>
        
        <div class="steps-container">
          <div class="steps-line"></div>
          
          <div class="row">
            <div class="col-md-4">
              <div class="step-card">
                <div class="step-number">1</div>
                <div class="step-icon">
                  <i class="bi bi-cloud-upload"></i>
                </div>
                <h4 class="step-title">Tải lên tài liệu</h4>
                <p class="step-description">
                  Tải lên tài liệu PDF, Word hoặc văn bản của bạn, hệ thống sẽ tự động xử lý và trích xuất nội dung.
                </p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="step-card">
                <div class="step-number">2</div>
                <div class="step-icon">
                  <i class="bi bi-cpu"></i>
                </div>
                <h4 class="step-title">AI phân tích</h4>
                <p class="step-description">
                  Công nghệ AI tiên tiến sẽ phân tích nội dung và xác định những điểm quan trọng, khái niệm cốt lõi.
                </p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="step-card">
                <div class="step-number">3</div>
                <div class="step-icon">
                  <i class="bi bi-check2-circle"></i>
                </div>
                <h4 class="step-title">Tạo quiz tự động</h4>
                <p class="step-description">
                  Hệ thống tạo ra các câu hỏi trắc nghiệm với đáp án và giải thích chi tiết, sẵn sàng để sử dụng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <!-- <section class="testimonials-section">
      <div class="container">
        <div class="section-header text-center">
          <h6 class="section-pre-title">PHẢN HỒI</h6>
          <h2 class="section-title">Giáo viên nói gì về chúng tôi</h2>
        </div>
        
        <div class="row mt-4 justify-content-center">
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="testimonial-card">
              <div class="testimonial-quote">
                <i class="bi bi-quote"></i>
              </div>
              <p class="testimonial-text">
                "AutoQuizGen giúp tôi tiết kiệm rất nhiều thời gian chuẩn bị bài kiểm tra. Các câu hỏi được tạo ra rất chất lượng và phù hợp với chương trình giảng dạy."
              </p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Cô Phương" />
                </div>
                <div class="testimonial-info">
                  <h5>Cô Phương</h5>
                  <p>Giáo viên Ngữ văn</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="testimonial-card">
              <div class="testimonial-quote">
                <i class="bi bi-quote"></i>
              </div>
              <p class="testimonial-text">
                "Tôi đã sử dụng nhiều công cụ tương tự nhưng AutoQuizGen thực sự nổi bật với độ chính xác và đa dạng của các câu hỏi. Học sinh của tôi rất thích làm các bài quiz này."
              </p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Thầy Minh" />
                </div>
                <div class="testimonial-info">
                  <h5>Thầy Minh</h5>
                  <p>Giáo viên Toán học</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-wrapper">
          <div class="row align-items-center">
            <div class="col-lg-8 mb-4 mb-lg-0">
              <h2 class="cta-title">Sẵn sàng tạo bài kiểm tra đầu tiên?</h2>
              <p class="cta-text">
                Bắt đầu miễn phí ngay hôm nay và khám phá sức mạnh của AutoQuizGen trong việc tạo các bài kiểm tra chất lượng cao.
              </p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <router-link to="/documents/upload" class="btn btn-light btn-lg">Bắt đầu ngay</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Home',
  setup() {
    const router = useRouter();
    const features = ref([
      { 
        title: 'Tạo quiz từ tài liệu', 
        description: 'Tải lên các tài liệu PDF, Word và tạo quiz tự động trong vài giây', 
        icon: 'bi-file-earmark-pdf',
        action: () => router.push('/documents/upload')
      },
      { 
        title: 'Tạo quiz từ văn bản', 
        description: 'Nhập hoặc dán nội dung văn bản để tạo quiz phù hợp', 
        icon: 'bi-lightning-charge',
        action: () => router.push('/quizzes/create')
      },
      { 
        title: 'Quản lý tài liệu', 
        description: 'Tổ chức, lưu trữ và quản lý các tài liệu học tập hiệu quả', 
        icon: 'bi-folder2-open',
        action: () => router.push('/documents')
      },
      { 
        title: 'Theo dõi tiến độ', 
        description: 'Xem và phân tích kết quả của các bài kiểm tra', 
        icon: 'bi-graph-up',
        action: () => router.push('/quizzes')
      }
    ]);
    
    return {
      features
    };
  }
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  color: white;
  padding: 6rem 0 12rem;
  overflow: hidden;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.8s;
}

.hero-title-highlight {
  position: relative;
  display: inline-block;
}

.hero-title-highlight::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: -1;
  border-radius: 4px;
}

.hero-description {
  font-size: 1.1rem;
  max-width: 580px;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 0.8s 0.2s backwards;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  animation: fadeInUp 0.8s 0.4s backwards;
}

.btn-hero {
  border-radius: 50px;
  padding: 0.8rem 1.8rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  border: none;
}

.btn-outline-primary {
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-hero:hover {
  transform: translateY(-3px);
}

.hero-image-container {
  position: relative;
  padding: 2rem;
  animation: fadeInRight 1s 0.5s backwards;
}

.floating-item {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  color: #4776e6;
  animation: float 3s infinite alternate;
}

.floating-item-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-item-2 {
  top: 60%;
  left: 5%;
  animation-delay: 0.5s;
}

.floating-item-3 {
  top: 30%;
  right: 10%;
  animation-delay: 1s;
}

.hero-shape {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  animation: fadeInUp 0.8s 0.6s backwards;
}

.hero-stat {
  text-align: center;
}

.hero-stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.hero-stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Features Section */
.features-section {
  padding: 5rem 0;
}

.section-header {
  max-width: 700px;
  margin: 0 auto 3rem;
}

.section-pre-title {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #4776e6;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
}

.section-description {
  color: #718096;
  font-size: 1.1rem;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  z-index: -1;
}

.feature-card-1::before { background: linear-gradient(to right, #FF416C, #FF4B2B); }
.feature-card-2::before { background: linear-gradient(to right, #11998e, #38ef7d); }
.feature-card-3::before { background: linear-gradient(to right, #4776E6, #8E54E9); }
.feature-card-4::before { background: linear-gradient(to right, #F09819, #EDDE5D); }

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
  background: #f8f9fa;
}

.feature-card-1 .feature-icon { color: #FF416C; }
.feature-card-2 .feature-icon { color: #11998e; }
.feature-card-3 .feature-icon { color: #4776E6; }
.feature-card-4 .feature-icon { color: #F09819; }

.feature-card:hover .feature-icon {
  background: #e9ecef;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
}

.feature-description {
  color: #718096;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.btn-feature {
  align-self: flex-start;
  background: transparent;
  color: #4776E6;
  border: none;
  padding: 0;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-feature:hover {
  transform: translateX(5px);
}

/* How it works */
.how-it-works-section {
  padding: 5rem 0;
  background-color: #f8fafc;
}

.steps-container {
  position: relative;
  padding: 3rem 0;
}

.steps-line {
  position: absolute;
  top: 120px;
  left: 50px;
  right: 50px;
  height: 3px;
  background: linear-gradient(to right, #4776E6, #8E54E9);
  z-index: 1;
}

.step-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
  height: 100%;
  transition: all 0.3s;
}

.step-card:hover {
  transform: translateY(-8px);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin: 0 auto 1.5rem;
}

.step-icon {
  font-size: 3rem;
  color: #4776E6;
  margin-bottom: 1.5rem;
}

.step-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
}

.step-description {
  color: #718096;
}

/* Testimonials Section */
.testimonials-section {
  padding: 5rem 0;
}

.testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: all 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.testimonial-quote {
  font-size: 2rem;
  color: #4776E6;
  opacity: 0.2;
  margin-bottom: 1rem;
}

.testimonial-text {
  font-style: italic;
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.testimonial-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-info h5 {
  font-size: 1.1rem;
  margin-bottom: 0;
  color: #2d3748;
}

.testimonial-info p {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
}

.cta-wrapper {
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 15px 35px rgba(71, 118, 230, 0.2);
  color: white;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.1rem;
  margin-bottom: 0;
  opacity: 0.9;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

/* Responsive Styles */
@media (max-width: 991.98px) {
  .hero-section {
    padding: 4rem 0 10rem;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }

  .steps-line {
    display: none;
  }
}

@media (max-width: 767.98px) {
  .hero-section {
    text-align: center;
    padding: 3rem 0 8rem;
  }
  
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .step-card {
    margin-bottom: 1.5rem;
  }
  
  .cta-wrapper {
    padding: 2rem;
    text-align: center;
  }
}
</style>