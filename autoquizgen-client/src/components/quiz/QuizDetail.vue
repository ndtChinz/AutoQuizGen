<template>
  <div class="quiz-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loader-container">
      <div class="loader-animation">
        <div class="dot-pulse"></div>
      </div>
      <p class="mt-3">Đang tải thông tin quiz...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert-container">
      <div class="alert-custom alert-danger">
        <div class="alert-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div class="alert-content">
          <h5>Đã xảy ra lỗi</h5>
          <p>{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Quiz Not Found -->
    <div v-else-if="!quiz" class="not-found-container">
      <div class="not-found-icon">
        <i class="bi bi-search"></i>
      </div>
      <h3 class="not-found-title">Không tìm thấy quiz</h3>
      <p class="not-found-message">Quiz bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <router-link to="/quizzes" class="btn btn-primary btn-lg">
        <i class="bi bi-grid me-2"></i>Xem tất cả Quiz
      </router-link>
    </div>

    <!-- Quiz Detail View -->
    <div v-else class="quiz-detail-content">
      <!-- Quiz Header -->
      <div class="quiz-header">
        <div class="quiz-info">
          <h1 class="quiz-title">{{ quiz.title }}</h1>
          <div class="quiz-meta">
            <span class="quiz-meta-item">
              <i class="bi bi-calendar-event"></i> {{ formatDate(quiz.createdAt) }}
            </span>
            <span class="quiz-meta-item">
              <i class="bi bi-question-diamond"></i> {{ quiz.questions.length }} câu hỏi
            </span>
            <span v-if="quiz.documentId" class="quiz-meta-item">
              <i class="bi bi-file-earmark-text"></i> Tạo từ tài liệu
            </span>
          </div>
          <p v-if="quiz.description" class="quiz-description">{{ quiz.description }}</p>
        </div>
        <div class="quiz-actions">
          <button @click="startQuiz" class="btn btn-primary btn-lg quiz-action-btn">
            <i class="bi bi-play-fill me-2"></i>Bắt đầu làm bài
          </button>
          <div class="quiz-action-dropdown">
            <button class="btn btn-light dropdown-toggle quiz-action-more" type="button" id="quizActionMenu" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="quizActionMenu">
              <li>
                <button class="dropdown-item" @click="editQuiz">
                  <i class="bi bi-pencil me-2"></i>Chỉnh sửa
                </button>
              </li>
              <li>
                <button class="dropdown-item text-danger" @click="deleteQuiz">
                  <i class="bi bi-trash me-2"></i>Xóa
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Question List Section -->
      <div class="questions-section">
        <div class="questions-header">
          <h2>Danh sách câu hỏi</h2>
          <div class="questions-toolbar">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showAnswers" v-model="showAnswers">
              <label class="form-check-label" for="showAnswers">Hiện đáp án</label>
            </div>
          </div>
        </div>

        <div class="questions-list">
          <div v-for="(question, index) in quiz.questions" :key="index" class="question-card">
            <div class="question-header">
              <span class="question-number">Câu {{ index + 1 }}</span>
              <span v-if="showAnswers" class="question-answer-badge">
                Đáp án: {{ getOptionLetter(question, question.correctAnswer) }}
              </span>
            </div>
            <h3 class="question-title">{{ question.question }}</h3>
            <div class="question-options">
              <div v-for="(option, optIndex) in question.options" :key="optIndex" 
                class="question-option"
                :class="{
                  'is-correct': showAnswers && option === question.correctAnswer
                }">
                <span class="option-letter">{{ getOptionLetter(null, optIndex) }}</span>
                <span class="option-text">{{ option }}</span>
                <span v-if="showAnswers && option === question.correctAnswer" class="option-correct-icon">
                  <i class="bi bi-check-circle-fill"></i>
                </span>
              </div>
            </div>
            <div v-if="question.explanation && showAnswers" class="question-explanation">
              <div class="explanation-header">
                <i class="bi bi-info-circle-fill me-2"></i>
                <span>Giải thích</span>
              </div>
              <p>{{ question.explanation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="action-footer">
        <router-link to="/quizzes" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Quay lại
        </router-link>
        <button @click="startQuiz" class="btn btn-primary">
          <i class="bi bi-play-fill me-2"></i>Làm bài kiểm tra
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'QuizDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const showAnswers = ref(false);
    
    // Computed properties
    const quiz = computed(() => store.state.quiz.currentQuiz);
    const loading = computed(() => store.state.quiz.loading);
    const error = computed(() => store.state.quiz.error);
    
    // Lifecycle hooks
    onMounted(() => {
      store.dispatch('quiz/fetchQuizById', props.id);
    });
    
    // Methods
    const startQuiz = () => {
      router.push({ name: 'QuizPlayer', params: { id: props.id } });
    };
    
    const editQuiz = () => {
      router.push({ name: 'EditQuiz', params: { id: props.id } });
    };
    
    const deleteQuiz = async () => {
      if (confirm('Bạn có chắc chắn muốn xóa quiz này không?')) {
        const success = await store.dispatch('quiz/deleteQuiz', props.id);
        if (success) {
          router.push({ name: 'Quizzes' });
        }
      }
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const getOptionLetter = (question, optionIndex) => {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      if (question && typeof optionIndex === 'string') {
        // Đang tìm chữ cái cho đáp án đúng
        const index = question.options.findIndex(opt => opt === optionIndex);
        return index >= 0 && index < letters.length ? letters[index] : '';
      } else {
        // Đang lấy chữ cái cho vị trí index
        return optionIndex < letters.length ? letters[optionIndex] : '';
      }
    };
    
    return {
      quiz,
      loading,
      error,
      showAnswers,
      startQuiz,
      editQuiz,
      deleteQuiz,
      formatDate,
      getOptionLetter
    };
  }
}
</script>

<style scoped>
.quiz-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* Loader */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loader-animation {
  margin-bottom: 1rem;
}

.dot-pulse {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #4776E6;
  color: #4776E6;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.25s;
}

.dot-pulse::before, .dot-pulse::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #4776E6;
  color: #4776E6;
}

.dot-pulse::before {
  left: -15px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  left: 15px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dot-pulse {
  0% {
    transform: scale(0.2);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.2);
    opacity: 0.7;
  }
}

/* Alert Styles */
.alert-container {
  margin: 1.5rem 0;
}

.alert-custom {
  display: flex;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.alert-danger {
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
  border-left: 4px solid #e53e3e;
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

/* Not Found */
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f6f8fc, #f0f5ff);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.not-found-icon {
  font-size: 5rem;
  color: #8e54e9;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
}

.not-found-message {
  max-width: 400px;
  margin-bottom: 2rem;
  color: #718096;
}

/* Quiz Detail Content */
.quiz-detail-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Quiz Header */
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.quiz-info {
  flex: 1;
}

.quiz-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
  background: linear-gradient(135deg, #4776E6, #8e54e9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.quiz-meta {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  gap: 1rem;
}

.quiz-meta-item {
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  color: #718096;
}

.quiz-meta-item i {
  margin-right: 0.4rem;
  color: #4776E6;
}

.quiz-description {
  color: #4a5568;
  font-size: 1.05rem;
  margin-top: 0.5rem;
}

.quiz-actions {
  display: flex;
  gap: 1rem;
}

.quiz-action-btn {
  background: linear-gradient(135deg, #4776E6, #8e54e9);
  border: none;
  box-shadow: 0 5px 15px rgba(71, 118, 230, 0.3);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.quiz-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(71, 118, 230, 0.4);
}

.quiz-action-more {
  border-radius: 10px;
  width: 50px;
  height: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  color: #4776E6;
  background: rgba(71, 118, 230, 0.1);
  border: none;
}

.quiz-action-more:hover {
  background: rgba(71, 118, 230, 0.2);
}

/* Questions Section */
.questions-section {
  margin-bottom: 3rem;
}

.questions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.questions-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.questions-toolbar {
  display: flex;
  align-items: center;
}

.form-check-input {
  width: 2.5em;
  height: 1.25em;
}

.form-check-input:checked {
  background-color: #4776E6;
  border-color: #4776E6;
}

/* Questions List */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid #4776E6;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.question-number {
  background: linear-gradient(135deg, #4776E6, #8e54e9);
  color: white;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.85rem;
}

.question-answer-badge {
  background-color: #d5ffe0;
  color: #0a853a;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.85rem;
}

.question-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #2d3748;
  line-height: 1.5;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.question-option {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  position: relative;
}

.question-option:hover {
  background-color: #f1f5f9;
}

.question-option.is-correct {
  background-color: #ecfdf4;
  border: 1px solid #10b981;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 0.8rem;
  transition: all 0.2s ease;
}

.is-correct .option-letter {
  background-color: #10b981;
  color: white;
}

.option-text {
  flex: 1;
  color: #4a5568;
}

.option-correct-icon {
  color: #10b981;
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

.question-explanation {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 3px solid #4776E6;
}

.explanation-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #4776E6;
  margin-bottom: 0.5rem;
}

.question-explanation p {
  margin: 0;
  color: #4a5568;
}

/* Action Footer */
.action-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 767.98px) {
  .quiz-header {
    flex-direction: column;
  }
  
  .quiz-actions {
    margin-top: 1rem;
    width: 100%;
  }
  
  .quiz-action-btn {
    flex: 1;
  }
  
  .action-footer {
    flex-direction: column-reverse;
    gap: 1rem;
  }
  
  .action-footer .btn {
    width: 100%;
  }
}
</style>