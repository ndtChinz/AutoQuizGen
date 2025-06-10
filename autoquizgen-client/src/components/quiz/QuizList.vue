<template>
  <div class="quiz-list">
    <!-- Loading State -->
    <div v-if="loading" class="quiz-loading">
      <div class="loader-animation">
        <div class="circle-loader"></div>
      </div>
      <p class="mt-3">Đang tải danh sách quiz...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-custom-danger">
      <div class="alert-icon">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div class="alert-content">
        <h5>Đã xảy ra lỗi</h5>
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="quizzes.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="bi bi-question-diamond"></i>
      </div>
      <h3 class="empty-title">Bạn chưa có quiz nào</h3>
      <p class="empty-description">
        Tạo quiz đầu tiên để bắt đầu kiểm tra kiến thức!
      </p>
      <router-link to="/quizzes/create" class="btn btn-primary btn-lg empty-button">
        <i class="bi bi-plus-circle me-2"></i>Tạo quiz đầu tiên
      </router-link>
    </div>

    <!-- Quiz List -->
    <div v-else class="quiz-grid">
      <!-- Add Quiz Card - Always first -->
      <div class="add-quiz-card">
        <router-link to="/quizzes/create" class="add-quiz-link">
          <div class="add-quiz-content">
            <div class="add-quiz-icon">
              <i class="bi bi-plus-lg"></i>
            </div>
            <h3 class="add-quiz-title">Tạo quiz mới</h3>
            <p class="add-quiz-description">Tạo quiz từ văn bản hoặc tạo thủ công</p>
          </div>
        </router-link>
      </div>
      
      <!-- Quiz Cards -->
      <div v-for="quiz in quizzes" :key="quiz._id" class="quiz-card">
        <div class="quiz-card-body">
          <div class="quiz-card-tags">
            <span class="quiz-card-tag tag-questions">
              <i class="bi bi-question-circle me-1"></i>
              {{ quiz.questions ? quiz.questions.length : 0 }} câu hỏi
            </span>
            <span class="quiz-card-tag tag-date">
              <i class="bi bi-calendar me-1"></i>
              {{ new Date(quiz.createdAt).toLocaleDateString('vi-VN') }}
            </span>
          </div>
          <h3 class="quiz-card-title">{{ quiz.title }}</h3>
          <p class="quiz-card-description" v-if="quiz.description">
            {{ quiz.description.substring(0, 100) }}{{ quiz.description.length > 100 ? '...' : '' }}
          </p>
          <div class="quiz-card-actions">
            <router-link :to="`/quizzes/${quiz._id}/play`" class="quiz-card-btn btn-play">
              <i class="bi bi-play-fill"></i> Làm quiz
            </router-link>
            <router-link :to="`/quizzes/${quiz._id}`" class="quiz-card-btn btn-details">
              <i class="bi bi-eye"></i> Xem
            </router-link>
            <button @click="confirmDelete(quiz._id)" class="quiz-card-btn btn-delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'QuizList',
  
  computed: {
    ...mapState('quiz', ['loading', 'error']),
    ...mapGetters('quiz', ['allQuizzes']),
    quizzes() {
      return this.allQuizzes;
    }
  },
  
  created() {
    this.fetchQuizzes();
  },
  
  methods: {
    ...mapActions('quiz', ['fetchQuizzes', 'deleteQuiz']),
    
    confirmDelete(quizId) {
      if (confirm('Bạn có chắc chắn muốn xóa quiz này không?')) {
        this.deleteQuiz(quizId);
      }
    }
  }
}
</script>

<style scoped>
.quiz-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Loading State */
.quiz-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #4776E6;
}

.loader-animation {
  margin-bottom: 10px;
}

.circle-loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4776E6;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.alert-custom-danger {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
  border-left: 4px solid #e53e3e;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.alert-icon {
  font-size: 2rem;
  margin-right: 16px;
  color: #e53e3e;
}

.alert-content h5 {
  margin-bottom: 4px;
  color: #e53e3e;
}

.alert-content p {
  margin: 0;
  color: #4a5568;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f6f8fc, #f0f5ff);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 5rem;
  color: #8e54e9;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
}

.empty-description {
  max-width: 400px;
  margin-bottom: 2rem;
  color: #718096;
}

.empty-button {
  background: linear-gradient(135deg, #4776E6, #8e54e9);
  border: none;
  border-radius: 50px;
  padding: 12px 30px;
  transition: all 0.3s ease;
}

.empty-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(71, 118, 230, 0.3);
}

/* Quiz Grid */
.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* Add Quiz Card */
.add-quiz-card {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #f6f8fc, #f0f5ff);
  transition: all 0.3s ease;
  border: 2px dashed #8e54e9;
}

.add-quiz-link {
  display: flex;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.add-quiz-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px;
  width: 100%;
}

.add-quiz-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  background: rgba(142, 84, 233, 0.1);
  color: #8e54e9;
  transition: all 0.3s ease;
}

.add-quiz-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4776E6;
}

.add-quiz-description {
  color: #718096;
  margin: 0;
}

.add-quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(71, 118, 230, 0.1);
}

.add-quiz-card:hover .add-quiz-icon {
  background: linear-gradient(135deg, #4776E6, #8e54e9);
  color: white;
}

/* Quiz Card */
.quiz-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.quiz-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4776E6, #8e54e9);
  z-index: 1;
}

.quiz-card-body {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.quiz-card-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
  gap: 8px;
}

.quiz-card-tag {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 50px;
  font-weight: 500;
}

.tag-questions {
  background-color: rgba(71, 118, 230, 0.1);
  color: #4776E6;
}

.tag-date {
  background-color: rgba(100, 100, 100, 0.1);
  color: #718096;
}

.quiz-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2d3748;
  line-height: 1.4;
}

.quiz-card-description {
  color: #718096;
  font-size: 0.95rem;
  margin-bottom: auto;
  flex-grow: 1;
}

.quiz-card-actions {
  display: flex;
  margin-top: 1.25rem;
  gap: 8px;
}

.quiz-card-btn {
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}

.btn-play {
  background: linear-gradient(135deg, #4776E6, #8e54e9);
  color: white;
  flex-grow: 1;
}

.btn-details {
  background-color: #f1f5f9;
  color: #64748b;
}

.btn-delete {
  background-color: #f1f5f9;
  color: #ef4444;
}

.quiz-card-btn:hover {
  transform: translateY(-2px);
}

.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(71, 118, 230, 0.1);
}

/* Responsive */
@media (max-width: 767px) {
  .quiz-grid {
    grid-template-columns: 1fr;
  }
}
</style>