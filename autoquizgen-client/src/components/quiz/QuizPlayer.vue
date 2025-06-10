<template>
  <div class="quiz-player-container">
    <!-- Loading State -->
    <div v-if="loading" class="quiz-loading">
      <div class="quiz-loader">
        <svg class="pencil-loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
          <path class="pencil-path" d="M150,0 L200,50 L150,100 L100,50 Z"></path>
          <line class="pencil-line" x1="150" y1="100" x2="150" y2="200"></line>
        </svg>
      </div>
      <p class="loader-text">Đang tải bài kiểm tra...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="!quiz" class="quiz-error">
      <div class="error-icon">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <h3 class="error-title">Bài kiểm tra không tồn tại</h3>
      <p class="error-description">Không tìm thấy bài kiểm tra hoặc đã có lỗi xảy ra.</p>
      <router-link to="/quizzes" class="btn-return">
        <i class="bi bi-arrow-left me-2"></i>Quay lại danh sách
      </router-link>
    </div>

    <div v-else class="quiz-player">
      <!-- Quiz Header -->
      <div v-if="!quizCompleted" class="quiz-header">
        <h2 class="quiz-title">{{ quiz.title }}</h2>
        <p v-if="quiz.description" class="quiz-description">{{ quiz.description }}</p>
        
        <div class="quiz-status-bar">
          <div class="progress-wrapper">
            <div class="progress-info">
              <span class="progress-label">Tiến độ</span>
              <span class="progress-count">{{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
          
          <div v-if="timeLimit > 0" class="timer-wrapper">
            <div class="timer" :class="{'timer-warning': remainingTime < 60}">
              <i class="bi bi-clock"></i>
              <span class="timer-value">{{ formatTime(remainingTime) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Display -->
      <div v-if="!quizCompleted && currentQuestion" class="question-content">
        <div class="question-card">
          <div class="question-header">
            <span class="question-number">Câu hỏi {{ currentQuestionIndex + 1 }}</span>
            <span class="question-dots">
              <span v-for="(_, i) in quiz.questions.length" :key="i" 
                    class="question-dot" :class="{ active: i === currentQuestionIndex }"></span>
            </span>
          </div>
          
          <div class="question-body">
            <h3 class="question-text">{{ currentQuestion.question }}</h3>
            
            <div class="answer-options">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index" 
                class="answer-option"
                :class="{ 
                  'selected': selectedAnswers[currentQuestionIndex] === option
                }"
                @click="selectedAnswers[currentQuestionIndex] = option"
              >
                <div class="option-check">
                  <div class="check-circle" :class="{ 'checked': selectedAnswers[currentQuestionIndex] === option }">
                    <i v-if="selectedAnswers[currentQuestionIndex] === option" class="bi bi-check2"></i>
                  </div>
                </div>
                <div class="option-text">{{ option }}</div>
              </div>
            </div>
          </div>
          
          <div class="question-footer">
            <button 
              class="btn-prev" 
              @click="previousQuestion" 
              :disabled="currentQuestionIndex === 0"
            >
              <i class="bi bi-arrow-left me-2"></i>Câu trước
            </button>

            <div class="question-pagination">
              <button 
                v-for="(_, index) in quiz.questions" 
                :key="index"
                class="pagination-btn"
                :class="{ 
                  'active': index === currentQuestionIndex,
                  'answered': selectedAnswers[index] 
                }"
                @click="goToQuestion(index)"
              >
                {{ index + 1 }}
              </button>
            </div>

            <button 
              v-if="currentQuestionIndex < quiz.questions.length - 1"
              class="btn-next" 
              @click="nextQuestion"
            >
              Câu tiếp theo<i class="bi bi-arrow-right ms-2"></i>
            </button>
            <button 
              v-else
              class="btn-submit" 
              @click="confirmSubmit"
            >
              <i class="bi bi-check2-circle me-1"></i>Nộp bài
            </button>
          </div>
        </div>

        <div class="submit-container">
          <button class="btn-submit-fixed" @click="confirmSubmit">
            <i class="bi bi-check2-circle me-2"></i>Nộp bài
          </button>
          <div class="quiz-stat">
            <div class="stat-item">
              <span class="stat-value">{{ quiz.questions.length - unansweredCount }}</span>
              <span class="stat-label">Đã trả lời</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ unansweredCount }}</span>
              <span class="stat-label">Chưa trả lời</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Result Screen -->
      <div v-if="quizCompleted" class="quiz-result">
        <div class="result-header">
          <h2 class="result-title">Kết quả bài kiểm tra</h2>
          <h3 class="result-subtitle">{{ quiz.title }}</h3>
        </div>
        
        <div class="result-summary">
          <div class="result-score-container">
            <div class="result-score-circle">
              <svg viewBox="0 0 36 36" class="score-chart">
                <path class="score-circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="score-circle"
                  :stroke-dasharray="`${Math.round((score/quiz.questions.length)*100)}, 100`"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" class="score-text">{{ Math.round((score/quiz.questions.length)*100) }}%</text>
              </svg>
              <div class="score-value">{{ score }}/{{ quiz.questions.length }}</div>
            </div>
          </div>
          
          <div class="result-details">
            <h4 class="result-message">{{ getResultMessage() }}</h4>
            
            <div class="result-stats">
              <div class="stat-group">
                <div class="result-stat correct">
                  <div class="stat-icon"><i class="bi bi-check-circle-fill"></i></div>
                  <div class="stat-info">
                    <div class="stat-value">{{ score }}</div>
                    <div class="stat-label">Câu đúng</div>
                  </div>
                </div>
                <div class="result-stat incorrect">
                  <div class="stat-icon"><i class="bi bi-x-circle-fill"></i></div>
                  <div class="stat-info">
                    <div class="stat-value">{{ quiz.questions.length - score }}</div>
                    <div class="stat-label">Câu sai</div>
                  </div>
                </div>
              </div>
              
              <div class="result-stat time">
                <div class="stat-icon"><i class="bi bi-clock-fill"></i></div>
                <div class="stat-info">
                  <div class="stat-value">{{ formatTime(quizDuration) }}</div>
                  <div class="stat-label">Thời gian làm bài</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="result-actions">
          <button class="btn-action review" @click="showReview = !showReview">
            <i class="bi" :class="showReview ? 'bi-eye-slash' : 'bi-eye'"></i>
            {{ showReview ? 'Ẩn chi tiết' : 'Xem chi tiết' }}
          </button>
          <button class="btn-action restart" @click="restartQuiz">
            <i class="bi bi-arrow-repeat"></i> Làm lại bài
          </button>
          <router-link to="/quizzes" class="btn-action return">
            <i class="bi bi-grid"></i> Quay lại danh sách
          </router-link>
        </div>
        
        <!-- Detailed Review -->
        <div v-if="showReview" class="review-section">
          <h3 class="review-header">Chi tiết câu trả lời</h3>
          
          <div class="review-questions">
            <div 
              v-for="(question, index) in quiz.questions" 
              :key="index" 
              class="review-question-card"
              :class="{
                'correct': selectedAnswers[index] === question.correctAnswer,
                'incorrect': selectedAnswers[index] !== question.correctAnswer
              }"
            >
              <div class="review-question-header">
                <h4 class="review-question-title">
                  <span class="question-number">Câu {{ index + 1 }}</span>
                  {{ question.question }}
                </h4>
                <div class="review-question-status">
                  <span 
                    class="status-badge"
                    :class="selectedAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'"
                  >
                    {{ selectedAnswers[index] === question.correctAnswer ? 'Đúng' : 'Sai' }}
                  </span>
                </div>
              </div>
              
              <div class="review-options">
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  class="review-option"
                  :class="{
                    'correct-answer': option === question.correctAnswer,
                    'incorrect-answer': option === selectedAnswers[index] && option !== question.correctAnswer,
                    'selected': option === selectedAnswers[index]
                  }"
                >
                  <div class="option-indicator">
                    <i v-if="option === question.correctAnswer" class="bi bi-check-circle-fill"></i>
                    <i v-else-if="option === selectedAnswers[index]" class="bi bi-x-circle-fill"></i>
                  </div>
                  <div class="option-text">{{ option }}</div>
                </div>
              </div>
              
              <div v-if="question.explanation" class="review-explanation">
                <div class="explanation-header">
                  <i class="bi bi-info-circle"></i> Giải thích
                </div>
                <p class="explanation-text">{{ question.explanation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import api from '@/services/api';

export default {
  name: 'QuizPlayer',
  props: {
    id: {
      type: String,
      required: true
    },
    timeLimit: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    // Giữ nguyên logic từ file gốc
    const quiz = ref(null);
    const loading = ref(true);
    const currentQuestionIndex = ref(0);
    const selectedAnswers = ref([]);
    const score = ref(0);
    const quizCompleted = ref(false);
    const startTime = ref(null);
    const quizDuration = ref(0);
    const remainingTime = ref(props.timeLimit);
    const timer = ref(null);
    const showReview = ref(false);
    
    // Computed
    const currentQuestion = computed(() => {
      if (!quiz.value || !quiz.value.questions) return null;
      return quiz.value.questions[currentQuestionIndex.value];
    });
    
    const progress = computed(() => {
      if (!quiz.value || !quiz.value.questions) return 0;
      return (currentQuestionIndex.value / quiz.value.questions.length) * 100;
    });
    
    const unansweredCount = computed(() => {
      return selectedAnswers.value.filter(answer => answer === null || answer === undefined).length;
    });
    
    // Lifecycle hooks
    onMounted(async () => {
      try {
        console.log('Tải quiz với ID:', props.id);
        
        const response = await api.get(`/quizzes/${props.id}`);
        
        console.log('Dữ liệu quiz nhận được:', response.data);
        quiz.value = response.data;
        
        if (quiz.value && quiz.value.questions && quiz.value.questions.length > 0) {
          // Khởi tạo mảng trả lời
          selectedAnswers.value = new Array(quiz.value.questions.length).fill(null);
          
          // Bắt đầu tính thời gian
          startTime.value = new Date();
          
          if (props.timeLimit > 0) {
            remainingTime.value = props.timeLimit;
            startTimer();
          }
        } else {
          console.error('Quiz không có câu hỏi hoặc định dạng không đúng:', quiz.value);
        }
      } catch (error) {
        console.error('Lỗi khi tải quiz:', error);
      } finally {
        loading.value = false;
      }
    });
    
    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });
    
    // Methods
    const goToQuestion = (index) => {
      currentQuestionIndex.value = index;
    };
    
    const nextQuestion = () => {
      if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
        currentQuestionIndex.value++;
      }
    };
    
    const previousQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
      }
    };
    
    const confirmSubmit = () => {
      const unanswered = unansweredCount.value;
      
      if (unanswered > 0) {
        if (!confirm(`Bạn còn ${unanswered} câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?`)) {
          return;
        }
      } else if (!confirm('Bạn có chắc chắn muốn nộp bài?')) {
        return;
      }
      
      submitQuiz();
    };
    
    const submitQuiz = () => {
      // Tính điểm
      score.value = 0;
      for (let i = 0; i < quiz.value.questions.length; i++) {
        if (selectedAnswers.value[i] === quiz.value.questions[i].correctAnswer) {
          score.value++;
        }
      }
      
      finishQuiz();
    };
    
    const startTimer = () => {
      if (timer.value) clearInterval(timer.value);
      
      timer.value = setInterval(() => {
        if (remainingTime.value <= 0) {
          clearInterval(timer.value);
          alert('Hết thời gian! Bài làm của bạn sẽ được nộp tự động.');
          submitQuiz();
        } else {
          remainingTime.value--;
        }
      }, 1000);
    };
    
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSecs = seconds % 60;
      return `${minutes}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
    };
    
    const finishQuiz = () => {
      quizCompleted.value = true;
      showReview.value = false; // Bắt đầu với kết quả tổng quan
      const endTime = new Date();
      quizDuration.value = Math.floor((endTime - startTime.value) / 1000);
      
      if (timer.value) {
        clearInterval(timer.value);
      }
    };
    
    const restartQuiz = () => {
      if (confirm('Bạn có chắc chắn muốn làm lại bài kiểm tra này?')) {
        currentQuestionIndex.value = 0;
        selectedAnswers.value = new Array(quiz.value.questions.length).fill(null);
        score.value = 0;
        quizCompleted.value = false;
        showReview.value = false;
        
        startTime.value = new Date();
        if (props.timeLimit > 0) {
          remainingTime.value = props.timeLimit;
          startTimer();
        }
      }
    };
    
    const getResultMessage = () => {
      const percentage = (score.value / quiz.value.questions.length) * 100;
      
      if (percentage >= 90) {
        return 'Xuất sắc! Bạn thực sự thông thạo chủ đề này.';
      } else if (percentage >= 70) {
        return 'Tốt! Bạn có hiểu biết vững chắc về chủ đề này.';
      } else if (percentage >= 50) {
        return 'Khá! Bạn đã nắm được các kiến thức cơ bản.';
      } else {
        return 'Bạn cần ôn tập thêm về chủ đề này.';
      }
    };
    
    return {
      quiz,
      loading,
      currentQuestionIndex,
      selectedAnswers,
      score,
      quizCompleted,
      startTime,
      quizDuration,
      remainingTime,
      showReview,
      currentQuestion,
      progress,
      unansweredCount,
      goToQuestion,
      nextQuestion,
      previousQuestion,
      confirmSubmit,
      submitQuiz,
      formatTime,
      restartQuiz,
      getResultMessage
    };
  }
}
</script>

<style scoped>
.quiz-player-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Loading State */
.quiz-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.quiz-loader {
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
}

.pencil-loader {
  animation: pencil-animation 3s infinite ease-in-out;
}

.pencil-path {
  fill: #4776E6;
  stroke: #3A66CC;
  stroke-width: 2;
}

.pencil-line {
  stroke: #8E54E9;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 10;
  stroke-dashoffset: 10;
  animation: pencil-line-animation 3s infinite ease-in-out;
}

@keyframes pencil-animation {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(15px); }
}

@keyframes pencil-line-animation {
  0% { stroke-dashoffset: 100; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -100; }
}

.loader-text {
  font-size: 1.2rem;
  color: #4a5568;
  text-align: center;
}

/* Error State */
.quiz-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  color: #FC8181;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 1rem;
}

.error-description {
  font-size: 1rem;
  color: #718096;
  max-width: 400px;
  margin-bottom: 2rem;
}

.btn-return {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.btn-return:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

/* Quiz Player */
.quiz-player {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeIn 0.5s ease;
}

/* Quiz Header */
.quiz-header {
  padding: 2rem;
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  color: white;
  position: relative;
}

.quiz-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.quiz-description {
  opacity: 0.85;
  margin-bottom: 1.5rem;
}

.quiz-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.progress-wrapper {
  flex: 1;
  margin-right: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.progress-count {
  font-size: 0.9rem;
  font-weight: 600;
}

.progress-track {
  height: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.timer-wrapper {
  min-width: 100px;
  text-align: right;
}

.timer {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-weight: 600;
}

.timer-warning {
  color: #fff;
  background-color: rgba(239, 68, 68, 0.7);
  animation: pulse 1s infinite;
}

.timer i {
  margin-right: 0.5rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Question Content */
.question-content {
  padding: 0;
}

.question-card {
  padding: 2rem;
  border-bottom: 1px solid #edf2f7;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.question-number {
  font-weight: 700;
  font-size: 1rem;
  color: #4776E6;
  background: linear-gradient(to right, #4776E6, #8E54E9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.question-dots {
  display: flex;
  gap: 0.25rem;
}

.question-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e2e8f0;
  transition: all 0.3s ease;
}

.question-dot.active {
  width: 16px;
  border-radius: 4px;
  background: linear-gradient(to right, #4776E6, #8E54E9);
}

.question-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.answer-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #edf2f7;
  border-radius: 12px;
  transition: all 0.25s ease;
  cursor: pointer;
}

.answer-option:hover {
  border-color: #cbd5e0;
  background-color: #f7fafc;
  transform: translateY(-2px);
}

.answer-option.selected {
  border-color: #4776E6;
  background-color: #ebf4ff;
}

.option-check {
  margin-right: 1rem;
}

.check-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #cbd5e0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.check-circle.checked {
  border-color: #4776E6;
  background-color: #4776E6;
  color: white;
}

.option-text {
  font-size: 1rem;
  color: #4a5568;
  flex: 1;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #edf2f7;
}

.btn-prev, .btn-next, .btn-submit {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-prev {
  background-color: #edf2f7;
  color: #4a5568;
}

.btn-prev:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.btn-prev:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-next {
  background: linear-gradient(to right, #4776E6, #8E54E9);
  color: white;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(71, 118, 230, 0.3);
}

.btn-submit {
  background: linear-gradient(to right, #2FCE7C, #16BE52);
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(47, 206, 124, 0.3);
}

.question-pagination {
  display: none;
}

.submit-container {
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8fafc;
}

.btn-submit-fixed {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #2FCE7C, #16BE52);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-submit-fixed:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(47, 206, 124, 0.3);
}

.quiz-stat {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
}

/* Quiz Result */
.quiz-result {
  padding: 2rem;
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.result-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(to right, #4776E6, #8E54E9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.result-subtitle {
  font-size: 1.25rem;
  color: #718096;
  font-weight: 500;
}

.result-summary {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  background-color: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
}

.result-score-container {
  display: flex;
  justify-content: center;
}

.result-score-circle {
  position: relative;
  width: 180px;
  height: 180px;
}

.score-chart {
  width: 100%;
  height: 100%;
}

.score-circle-bg {
  fill: none;
  stroke: #edf2f7;
  stroke-width: 3.8;
}

.score-circle {
  fill: none;
  stroke: url(#scoreGradient);
  stroke-width: 3.8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 1s ease;
}

.score-text {
  fill: #4a5568;
  font-size: 0.6em;
  text-anchor: middle;
  font-weight: 700;
}

.score-value {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 1.25rem;
  color: #4776E6;
  font-weight: 700;
}

.result-details {
  text-align: center;
}

.result-message {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.result-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.stat-group {
  display: flex;
  gap: 1rem;
}

.result-stat {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  flex: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.result-stat.correct {
  border-left: 4px solid #48BB78;
}

.result-stat.incorrect {
  border-left: 4px solid #F56565;
}

.result-stat.time {
  border-left: 4px solid #4299E1;
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.result-stat.correct .stat-icon {
  color: #48BB78;
}

.result-stat.incorrect .stat-icon {
  color: #F56565;
}

.result-stat.time .stat-icon {
  color: #4299E1;
}

.stat-info {
  text-align: left;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-action i {
  margin-right: 0.5rem;
}

.btn-action.review {
  background-color: #ebf8ff;
  color: #4299E1;
}

.btn-action.review:hover {
  background-color: #bee3f8;
}

.btn-action.restart {
  background: linear-gradient(to right, #4776E6, #8E54E9);
  color: white;
}

.btn-action.restart:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(71, 118, 230, 0.3);
}

.btn-action.return {
  background-color: #edf2f7;
  color: #4a5568;
  text-decoration: none;
}

.btn-action.return:hover {
  background-color: #e2e8f0;
}

/* Review Section */
.review-section {
  margin-top: 3rem;
  animation: fadeIn 0.5s ease;
}

.review-header {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
}

.review-questions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-question-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.review-question-card.correct {
  border-left: 4px solid #48BB78;
}

.review-question-card.incorrect {
  border-left: 4px solid #F56565;
}

.review-question-header {
  padding: 1.25rem;
  background-color: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.review-question-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  padding-right: 1rem;
}

.review-question-title .question-number {
  margin-right: 0.5rem;
  color: #4a5568;
  background: none;
  -webkit-text-fill-color: initial;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.correct {
  background-color: #C6F6D5;
  color: #22543D;
}

.status-badge.incorrect {
  background-color: #FED7D7;
  color: #822727;
}

.review-options {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.review-option {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #f8fafc;
}

.review-option.correct-answer {
  background-color: #C6F6D5;
}

.review-option.incorrect-answer {
  background-color: #FED7D7;
}

.review-option.selected {
  border: 2px solid #CBD5E0;
}

.option-indicator {
  width: 24px;
  margin-right: 0.75rem;
  color: #718096;
}

.review-option.correct-answer .option-indicator {
  color: #48BB78;
}

.review-option.incorrect-answer .option-indicator {
  color: #F56565;
}

.review-explanation {
  padding: 1.25rem;
  background-color: #FEFEFE;
  border-top: 1px solid #edf2f7;
}

.explanation-header {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.explanation-header i {
  margin-right: 0.5rem;
  color: #4299E1;
}

.explanation-text {
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* SVG Definitions */
svg {
  overflow: visible;
}

/* Responsive Styles */
@media (min-width: 768px) {
  .result-summary {
    flex-direction: row;
    align-items: center;
  }
  
  .result-score-container {
    flex: 1;
  }
  
  .result-details {
    flex: 2;
    text-align: left;
  }
  
  .question-pagination {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem;
    max-width: 300px;
    scrollbar-width: thin;
    justify-content: center;
  }
  
  .pagination-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: #edf2f7;
    border: none;
    color: #718096;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  
  .pagination-btn:hover {
    background-color: #e2e8f0;
  }
  
  .pagination-btn.active {
    background: linear-gradient(to right, #4776E6, #8E54E9);
    color: white;
  }
  
  .pagination-btn.answered:not(.active) {
    background-color: #C6F6D5;
    color: #2F855A;
  }
}

@media (max-width: 767px) {
  .quiz-player-container {
    padding: 1rem 0.5rem;
  }
  
  .quiz-header {
    padding: 1.5rem;
  }
  
  .quiz-title {
    font-size: 1.5rem;
  }
  
  .question-card {
    padding: 1.5rem;
  }
  
  .question-text {
    font-size: 1.1rem;
  }
  
  .submit-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-submit-fixed {
    width: 100%;
  }
  
  .stat-group {
    flex-direction: column;
  }
  
  .question-footer {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .btn-prev, .btn-next, .btn-submit {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>