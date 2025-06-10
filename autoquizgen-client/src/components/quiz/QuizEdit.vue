<template>
  <div class="quiz-edit">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin quiz...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <span>{{ error }}</span>
    </div>

    <div v-else class="quiz-edit-container">
      <div class="edit-header">
        <h1><i class="bi bi-pencil-square"></i> Chỉnh sửa Quiz</h1>
        <p class="subtitle">Cập nhật nội dung quiz của bạn</p>
      </div>

      <div class="content-card">
        <form @submit.prevent="saveQuiz">
          <div class="form-group">
            <label for="title">
              <i class="bi bi-bookmark"></i> Tiêu đề
            </label>
            <input type="text" id="title" v-model="quizForm.title" required 
                   placeholder="Nhập tiêu đề cho quiz của bạn">
          </div>

          <div class="form-group">
            <label for="description">
              <i class="bi bi-card-text"></i> Mô tả
            </label>
            <textarea id="description" v-model="quizForm.description" rows="3"
                      placeholder="Mô tả ngắn gọn về nội dung quiz"></textarea>
          </div>

          <div class="section-header">
            <h2><i class="bi bi-list-ol"></i> Danh sách câu hỏi</h2>
            <button type="button" class="btn btn-add" @click="addQuestion">
              <i class="bi bi-plus-circle"></i> Thêm câu hỏi
            </button>
          </div>
          
          <div v-if="quizForm.questions.length === 0" class="empty-state">
            <i class="bi bi-question-circle"></i>
            <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
          </div>
          
          <div v-for="(question, index) in quizForm.questions" :key="index" class="question-card">
            <div class="question-header">
              <h3>Câu hỏi {{ index + 1 }}</h3>
              <button type="button" class="btn-icon" @click="removeQuestion(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            
            <div class="question-body">
              <div class="form-group">
                <label :for="'question-' + index">Nội dung câu hỏi</label>
                <input type="text" :id="'question-' + index" v-model="question.question" required
                       placeholder="Nhập câu hỏi của bạn">
              </div>

              <div class="options-container">
                <label class="options-label">Các lựa chọn</label>
                <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-item">
                  <div class="option-radio">
                    <input type="radio" :name="'correct-' + index"
                           :id="`option-${index}-${optIndex}`"
                           :checked="option === question.correctAnswer"
                           @change="setCorrectAnswer(index, option)">
                    <label :for="`option-${index}-${optIndex}`">
                      Đúng
                    </label>
                  </div>
                  <input type="text" v-model="question.options[optIndex]"
                         placeholder="Nhập lựa chọn" required>
                  <button v-if="question.options.length > 2" type="button" class="btn-icon remove-option"
                          @click="removeOption(question, optIndex)">
                    <i class="bi bi-x"></i>
                  </button>
                </div>

                <button v-if="question.options.length < 5" type="button" class="btn btn-option"
                        @click="addOption(question)">
                  <i class="bi bi-plus-circle"></i> Thêm lựa chọn
                </button>
              </div>

              <div class="form-group">
                <label :for="'explanation-' + index">
                  <i class="bi bi-info-circle"></i> Giải thích (không bắt buộc)
                </label>
                <textarea :id="'explanation-' + index" v-model="question.explanation" rows="2"
                          placeholder="Giải thích tại sao đáp án này là đúng"></textarea>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="$router.go(-1)">
              <i class="bi bi-x-circle"></i> Hủy
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="bi bi-check-circle"></i> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'QuizEdit',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // State
    const quizForm = reactive({
      title: '',
      description: '',
      questions: []
    });
    
    // Computed
    const quiz = computed(() => store.state.quiz.currentQuiz);
    const loading = computed(() => store.state.quiz.loading);
    const error = computed(() => store.state.quiz.error);
    
    // Watch
    watch(quiz, (newQuiz) => {
      if (newQuiz) {
        quizForm.title = newQuiz.title;
        quizForm.description = newQuiz.description;
        quizForm.questions = JSON.parse(JSON.stringify(newQuiz.questions || []));
      }
    }, { immediate: true });
    
    // Lifecycle Hooks
    onMounted(async () => {
      await store.dispatch('quiz/fetchQuizById', props.id);
    });
    
    // Methods
    const addQuestion = () => {
      quizForm.questions.push({
        question: '',
        options: ['', ''],
        correctAnswer: '',
        explanation: ''
      });
    };
    
    const removeQuestion = (index) => {
      if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
        quizForm.questions.splice(index, 1);
      }
    };
    
    const addOption = (question) => {
      if (question.options.length < 5) {
        question.options.push('');
      }
    };
    
    const removeOption = (question, optIndex) => {
      if (question.options.length > 2) {
        // Nếu xóa đáp án đúng, reset correctAnswer
        if (question.options[optIndex] === question.correctAnswer) {
          question.correctAnswer = '';
        }
        question.options.splice(optIndex, 1);
      } else {
        alert('Cần ít nhất 2 lựa chọn cho mỗi câu hỏi');
      }
    };
    
    const setCorrectAnswer = (questionIndex, option) => {
      quizForm.questions[questionIndex].correctAnswer = option;
    };
    
    const saveQuiz = async () => {
      // Kiểm tra các câu hỏi có đáp án đúng chưa
      const invalidQuestions = quizForm.questions.filter(
        q => !q.correctAnswer || q.question.trim() === ''
      );
      
      if (invalidQuestions.length > 0) {
        alert('Vui lòng điền đầy đủ nội dung câu hỏi và chọn đáp án đúng cho tất cả câu hỏi');
        return;
      }
      
      try {
        await store.dispatch('quiz/updateQuiz', {
          id: props.id,
          quizData: quizForm
        });
        
        router.push({
          name: 'QuizDetail',
          params: { id: props.id }
        });
      } catch (error) {
        console.error('Error updating quiz:', error);
      }
    };
    
    return {
      quizForm,
      quiz,
      loading,
      error,
      addQuestion,
      removeQuestion,
      addOption,
      removeOption,
      setCorrectAnswer,
      saveQuiz
    };
  }
}
</script>

<style scoped>
.quiz-edit {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(74, 77, 231, 0.2);
  border-left-color: #4a4de7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-container p {
  color: #666;
  font-size: 1.1rem;
}

.error-message {
  background-color: #fff1f0;
  border-left: 4px solid #ff4d4f;
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
}

.error-message i {
  color: #ff4d4f;
  font-size: 1.2rem;
}

.edit-header {
  text-align: center;
  margin-bottom: 2rem;
}

.edit-header h1 {
  color: #4a4de7;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s ease;
  background: #f9f9f9;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #4a4de7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 77, 231, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2.5rem 0 1.5rem;
}

.section-header h2 {
  font-size: 1.3rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.question-card {
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  border: 1px solid #eee;
  transition: box-shadow 0.2s ease;
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.question-header {
  background: #f0f0ff;
  padding: 0.8rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9e9ff;
}

.question-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #4a4de7;
}

.question-body {
  padding: 1.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #ec4040;
}

.options-container {
  margin-bottom: 1.5rem;
}

.options-label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: #333;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  gap: 8px;
}

.option-radio {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f0f0ff;
  padding: 4px 10px;
  border-radius: 6px;
  min-width: 70px;
}

.option-radio input[type="radio"] {
  margin-right: 5px;
}

.option-radio label {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4a4de7;
  color: white;
}

.btn-primary:hover {
  background: #3d40c0;
  box-shadow: 0 4px 10px rgba(74, 77, 231, 0.3);
}

.btn-primary:disabled {
  background: #a1a2e6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #555;
  text-decoration: none;
}

.btn-secondary:hover {
  background: #eaeaea;
  color: #333;
}

.btn-add {
  background: #4a4de7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.btn-add:hover {
  background: #3d40c0;
  transform: translateY(-2px);
}

.btn-option {
  background: #f0f0ff;
  color: #4a4de7;
  border: 1px dashed #c5c6ff;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-option:hover {
  background: #e5e6ff;
}

.remove-option {
  color: #999;
  font-size: 1.2rem;
}

.remove-option:hover {
  color: #ec4040;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  color: #777;
  margin-bottom: 1.5rem;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #aaa;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .quiz-edit {
    padding: 1rem;
  }
  
  .content-card {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .question-body {
    padding: 1rem;
  }
  
  .option-item {
    flex-wrap: wrap;
  }
  
  .option-radio {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>