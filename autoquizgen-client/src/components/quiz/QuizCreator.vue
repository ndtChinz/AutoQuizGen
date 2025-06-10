<template>
  <div class="quiz-creator">
    <div class="creator-header">
      <h1><i class="bi bi-lightbulb"></i> Tạo quiz mới</h1>
      <p class="subtitle">Tạo bài kiểm tra tương tác cho học sinh của bạn</p>
    </div>

    <!-- Tab navigation -->
    <div class="tab-navigation">
      <button class="tab-button" :class="{ active: activeTab === 'text' }"
              @click="activeTab = 'text'">
        <i class="bi bi-robot"></i> Tạo từ văn bản
      </button>
      <button class="tab-button" :class="{ active: activeTab === 'manual' }"
              @click="activeTab = 'manual'">
        <i class="bi bi-pencil-square"></i> Tạo thủ công
      </button>
    </div>

    <!-- Thông báo thành công -->
    <div v-if="successMessage" class="status-message success">
      <i class="bi bi-check-circle"></i>
      <span>{{ successMessage }}</span>
    </div>

    <!-- Tạo từ văn bản -->
    <div v-if="activeTab === 'text'" class="tab-content">
      <div class="content-card">
        <form @submit.prevent="generateQuizFromText">
          <div class="form-group">
            <label for="quizTitle">
              <i class="bi bi-bookmark"></i> Tiêu đề Quiz
            </label>
            <input v-model="textQuiz.title" type="text" id="quizTitle" required 
                   placeholder="Nhập tiêu đề cho bài quiz của bạn">
          </div>
          
          <div class="form-group">
            <label for="quizDescription">
              <i class="bi bi-card-text"></i> Mô tả (tuỳ chọn)
            </label>
            <textarea v-model="textQuiz.description" id="quizDescription" rows="2"
                      placeholder="Thêm mô tả ngắn về bài quiz"></textarea>
          </div>
          
          <div class="form-group">
            <label for="quizText">
              <i class="bi bi-file-text"></i> Nội dung văn bản
            </label>
            <textarea v-model="textQuiz.text" id="quizText" rows="10" required
                      placeholder="Dán nội dung văn bản vào đây để AI tạo câu hỏi tự động..."></textarea>
          </div>
          
          <div v-if="loading" class="status-message loading">
            <div class="spinner"></div>
            <div>
              <strong>Đang xử lý...</strong>
              <p>AI đang phân tích nội dung và tạo câu hỏi. Quá trình này có thể mất vài phút.</p>
            </div>
          </div>
          
          <div v-if="error" class="status-message error">
            <i class="bi bi-exclamation-triangle"></i>
            <span>{{ error }}</span>
          </div>
          
          <div class="form-actions">
            <router-link to="/quizzes" class="btn btn-secondary">
              <i class="bi bi-x-circle"></i> Huỷ
            </router-link>
            <button type="submit" class="btn btn-primary" :disabled="loading || !textQuiz.text">
              <i class="bi bi-lightning"></i> Tạo quiz tự động
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tạo thủ công -->
    <div v-if="activeTab === 'manual'" class="tab-content">
      <div class="content-card">
        <form @submit.prevent="saveManualQuiz">
          <div class="form-group">
            <label for="manualQuizTitle">
              <i class="bi bi-bookmark"></i> Tiêu đề Quiz
            </label>
            <input v-model="manualQuiz.title" type="text" id="manualQuizTitle" required
                   placeholder="Nhập tiêu đề cho bài quiz của bạn">
          </div>
          
          <div class="form-group">
            <label for="manualQuizDescription">
              <i class="bi bi-card-text"></i> Mô tả (tuỳ chọn)
            </label>
            <textarea v-model="manualQuiz.description" id="manualQuizDescription" rows="2"
                      placeholder="Thêm mô tả ngắn về bài quiz"></textarea>
          </div>
          
          <div class="section-header">
            <h2><i class="bi bi-list-ol"></i> Câu hỏi</h2>
            <button type="button" class="btn btn-add" @click="addManualQuestion">
              <i class="bi bi-plus-circle"></i> Thêm câu hỏi
            </button>
          </div>
          
          <div v-if="manualQuiz.questions.length === 0" class="empty-state">
            <i class="bi bi-question-circle"></i>
            <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
          </div>
          
          <div v-for="(question, index) in manualQuiz.questions" :key="index" class="question-card">
            <div class="question-header">
              <h3>Câu hỏi {{ index + 1 }}</h3>
              <button type="button" class="btn-icon" @click="removeManualQuestion(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="question-body">
              <div class="form-group">
                <label :for="`question-${index}`">Nội dung câu hỏi</label>
                <input v-model="question.question" type="text" :id="`question-${index}`" required
                       placeholder="Nhập câu hỏi của bạn">
              </div>
              
              <div class="options-container">
                <label class="options-label">Đáp án</label>
                <div v-for="(option, optIndex) in question.options" :key="`${index}-${optIndex}`" 
                    class="option-item">
                  <div class="option-radio">
                    <input type="radio" :name="`correct-${index}`"
                          :id="`option-${index}-${optIndex}`"
                          :checked="option === question.correctAnswer"
                          @change="setCorrectAnswer(index, option)">
                    <label :for="`option-${index}-${optIndex}`">
                      Đúng
                    </label>
                  </div>
                  <input v-model="question.options[optIndex]" type="text"
                        :placeholder="`Đáp án ${optIndex + 1}`" required>
                  <button v-if="question.options.length > 2" type="button" class="btn-icon remove-option"
                          @click="removeOption(question, optIndex)">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                
                <button v-if="question.options.length < 6" type="button" class="btn btn-option"
                        @click="addOption(question)">
                  <i class="bi bi-plus-circle"></i> Thêm đáp án
                </button>
              </div>
              
              <div class="form-group">
                <label :for="`explanation-${index}`">
                  <i class="bi bi-info-circle"></i> Giải thích (tùy chọn)
                </label>
                <textarea v-model="question.explanation" :id="`explanation-${index}`" rows="2"
                          placeholder="Giải thích tại sao đáp án này là đúng"></textarea>
              </div>
            </div>
          </div>
          
          <div v-if="loading" class="status-message loading">
            <div class="spinner"></div>
            <span>Đang lưu quiz...</span>
          </div>
          
          <div v-if="error" class="status-message error">
            <i class="bi bi-exclamation-triangle"></i>
            <span>{{ error }}</span>
          </div>
          
          <div class="form-actions">
            <router-link to="/quizzes" class="btn btn-secondary">
              <i class="bi bi-x-circle"></i> Huỷ
            </router-link>
            <button type="submit" class="btn btn-primary" :disabled="loading || manualQuiz.questions.length === 0">
              <i class="bi bi-save"></i> Lưu quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'QuizCreator',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // State
    const activeTab = ref('text'); // Mặc định là tab 'text'
    const successMessage = ref(''); // Thêm state để lưu thông báo thành công
    
    const textQuiz = reactive({
      title: '',
      description: '',
      text: ''
    });
    
    const manualQuiz = reactive({
      title: '',
      description: '',
      questions: []
    });
    
    // Computed
    const loading = computed(() => store.state.quiz.loading);
    const error = computed(() => store.state.quiz.error);
    
    // Methods cho tab text
    const generateQuizFromText = async () => {
      if (!textQuiz.text || !textQuiz.title) {
        alert('Vui lòng nhập tiêu đề và nội dung văn bản');
        return;
      }
      
      try {
        // Log thông tin gửi đi để kiểm tra
        console.log('Đang gửi dữ liệu:', {
          title: textQuiz.title,
          description: textQuiz.description,
          content: textQuiz.text
        });
        
        // Sửa lại dữ liệu gửi đi để đúng định dạng
        const response = await store.dispatch('quiz/generateQuiz', {
          title: textQuiz.title,
          description: textQuiz.description,
          content: textQuiz.text // Đảm bảo key này là 'content' không phải 'text'
        });
        
        console.log('Response received:', response);
        
        if (response && response._id) {
          // Hiển thị thông báo thành công
          successMessage.value = 'Tạo quiz thành công!';
          
          // Chuyển hướng về trang danh sách quiz sau 1.5 giây
          setTimeout(() => {
            router.push('/quizzes');
          }, 1500);
        } else if (response && response.questions) {
          // Có thể API trả về câu hỏi mà không tạo quiz
          // Chuyển câu hỏi sang tab manual để người dùng xem và chỉnh sửa
          manualQuiz.title = textQuiz.title;
          manualQuiz.description = textQuiz.description;
          manualQuiz.questions = response.questions;
          activeTab.value = 'manual';
        } else {
          console.error('Không nhận được dữ liệu hợp lệ từ API:', response);
        }
      } catch (error) {
        console.error('Lỗi khi tạo quiz từ văn bản:', error);
      }
    };
    
    // Methods cho tab manual
    const addManualQuestion = () => {
      manualQuiz.questions.push({
        question: '',
        options: ['', ''],
        correctAnswer: '',
        explanation: ''
      });
    };
    
    const removeManualQuestion = (index) => {
      if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
        manualQuiz.questions.splice(index, 1);
      }
    };
    
    const addOption = (question) => {
      if (question.options.length < 6) {
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
      manualQuiz.questions[questionIndex].correctAnswer = option;
    };
    
    const saveManualQuiz = async () => {
      // Validate - đảm bảo mỗi câu hỏi có một đáp án đúng
      const invalidQuestions = manualQuiz.questions.filter(q => !q.correctAnswer || !q.question);
      
      if (invalidQuestions.length > 0) {
        alert('Vui lòng đảm bảo tất cả câu hỏi đều có nội dung và đáp án đúng được chọn');
        return;
      }
      
      try {
        const response = await store.dispatch('quiz/createQuiz', {
          title: manualQuiz.title,
          description: manualQuiz.description,
          questions: manualQuiz.questions
        });
        
        if (response && response._id) {
          // Hiển thị thông báo thành công
          successMessage.value = 'Lưu quiz thành công!';
          
          // Chuyển hướng về trang danh sách quiz sau 1.5 giây
          setTimeout(() => {
            router.push('/quizzes');
          }, 1500);
        }
      } catch (error) {
        console.error('Lỗi khi lưu quiz:', error);
      }
    };
    
    // Khởi tạo với 1 câu hỏi mẫu
    addManualQuestion();
    
    return {
      activeTab,
      textQuiz,
      manualQuiz,
      loading,
      error,
      successMessage, // Thêm vào return để sử dụng trong template
      generateQuizFromText,
      addManualQuestion,
      removeManualQuestion,
      addOption,
      removeOption,
      setCorrectAnswer,
      saveManualQuiz
    };
  }
}
</script>

<style scoped>
.status-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.loading {
  background: #e5f3ff;
  color: #0072c6;
}

.error {
  background: #ffe5e5;
  color: #d9534f;
}

/* Thêm CSS cho thông báo thành công */
.success {
  background: #e5fff2;
  color: #28a745;
  animation: fadeIn 0.5s ease;
}
.quiz-creator {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.creator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.creator-header h1 {
  color: #4a4de7;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.tab-navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.tab-button {
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button:hover {
  background: #e9e9ff;
  color: #4a4de7;
}

.tab-button.active {
  background: #4a4de7;
  color: white;
  box-shadow: 0 3px 10px rgba(74, 77, 231, 0.2);
}

.tab-content {
  animation: fadeIn 0.4s ease;
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

.status-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.loading {
  background: #e5f3ff;
  color: #0072c6;
}

.error {
  background: #ffe5e5;
  color: #d9534f;
}

.success {
  background: #e6ffed;
  color: #28a745;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 114, 198, 0.2);
  border-top-color: #0072c6;
  border-radius: 50%;
  animation: spin 1s infinite linear;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .quiz-creator {
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
  
  .tab-navigation {
    flex-direction: column;
  }
  
  .tab-button {
    width: 100%;
    justify-content: center;
  }
}
</style>