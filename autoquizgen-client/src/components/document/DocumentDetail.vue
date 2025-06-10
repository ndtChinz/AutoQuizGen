<template>
  <div class="document-detail">
    <!-- Loading State -->
    <div v-if="loading" class="detail-loader">
      <div class="pulse-loader"></div>
      <p class="mt-3">Đang tải thông tin tài liệu...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <i class="bi bi-exclamation-diamond"></i>
      </div>
      <h3 class="error-title">Không thể tải tài liệu</h3>
      <p class="error-message">{{ error }}</p>
      <div class="error-actions">
        <button @click="reload" class="btn btn-retry">
          <i class="bi bi-arrow-clockwise me-2"></i>Thử lại
        </button>
        <router-link to="/documents" class="btn btn-back">
          <i class="bi bi-arrow-left me-2"></i>Quay lại danh sách
        </router-link>
      </div>
    </div>

    <!-- Document View -->
    <div v-else-if="document" class="document-container">
      <div class="document-header">
        <div class="document-info">
          <h1 class="document-title">{{ document.title }}</h1>
          <div class="document-meta">
            <span class="meta-item">
              <i class="bi bi-calendar3 me-1"></i>
              {{ formatDate(document.createdAt) }}
            </span>
            <span class="meta-item">
              <i class="bi bi-file-earmark-text me-1"></i>
              {{ getDocumentTypeLabel(document.title) }}
            </span>
            <span v-if="document.content" class="meta-item">
              <i class="bi bi-text-paragraph me-1"></i>
              {{ calculateReadingTime(document.content) }} phút đọc
            </span>
          </div>
        </div>
        
        <div class="document-actions">
          <button @click="generateQuiz" class="btn btn-primary">
            <i class="bi bi-lightning me-2"></i>Tạo Quiz
          </button>
          <div class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="documentActions" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="documentActions">
              <li>
                <a href="#" class="dropdown-item" @click.prevent="downloadDocument">
                  <i class="bi bi-download me-2"></i>Tải xuống
                </a>
              </li>
              <li>
                <a href="#" class="dropdown-item" @click.prevent="shareDocument">
                  <i class="bi bi-share me-2"></i>Chia sẻ
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a href="#" class="dropdown-item text-danger" @click.prevent="confirmDelete">
                  <i class="bi bi-trash me-2"></i>Xóa
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- Tab Navigation -->
      <div class="tabs-container">
        <div class="nav-tabs-custom">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'summary' }" 
            @click="activeTab = 'summary'"
          >
            <i class="bi bi-journal-text me-2"></i>Tóm tắt
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'content' }" 
            @click="activeTab = 'content'"
          >
            <i class="bi bi-file-text me-2"></i>Nội dung
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'questions' }" 
            @click="activeTab = 'questions'"
          >
            <i class="bi bi-patch-question me-2"></i>Câu hỏi
            <span v-if="document.questions && document.questions.length" class="badge">
              {{ document.questions.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Summary Tab -->
        <div v-if="activeTab === 'summary'" class="tab-pane">
          <div class="content-card summary-content">
            <h3 class="content-title">
              <i class="bi bi-journal-bookmark me-2"></i>Tóm tắt tài liệu
            </h3>
            <div v-if="document.summary" class="summary-text">
              <div v-html="formatParagraphs(document.summary)"></div>
            </div>
            <div v-else class="empty-content">
              <i class="bi bi-journal-x"></i>
              <p>Chưa có tóm tắt cho tài liệu này</p>
              <button @click="generateSummary" class="btn btn-outline-primary btn-sm">
                Tạo tóm tắt
              </button>
            </div>
            
            <div class="key-concepts" v-if="document.keywords && document.keywords.length">
              <h4 class="key-concepts-title">Từ khóa chính</h4>
              <div class="key-concepts-list">
                <span v-for="(keyword, idx) in document.keywords" :key="idx" class="key-concept-tag">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Tab -->
        <div v-if="activeTab === 'content'" class="tab-pane">
          <div class="content-card document-content">
            <h3 class="content-title">
              <i class="bi bi-file-text me-2"></i>Nội dung đầy đủ
            </h3>
            <div v-if="document.content" class="content-text">
              <div v-html="formatParagraphs(document.content)"></div>
            </div>
            <div v-else class="empty-content">
              <i class="bi bi-file-earmark-x"></i>
              <p>Không có nội dung văn bản cho tài liệu này</p>
            </div>
          </div>
        </div>

        <!-- Questions Tab -->
        <div v-if="activeTab === 'questions'" class="tab-pane">
          <div class="content-card questions-content">
            <div class="questions-header">
              <h3 class="content-title">
                <i class="bi bi-patch-question me-2"></i>Câu hỏi tự động
              </h3>
              <button v-if="document.questions && document.questions.length" @click="generateQuiz" class="btn btn-sm btn-primary">
                <i class="bi bi-play-circle me-1"></i>Tạo quiz từ câu hỏi
              </button>
            </div>
            
            <div v-if="document.questions && document.questions.length" class="questions-list">
              <div v-for="(question, index) in document.questions" :key="index" class="question-item">
                <div class="question-header">
                  <div class="question-number">{{ index + 1 }}</div>
                  <h4 class="question-text">{{ question.question }}</h4>
                </div>
                
                <div class="options-list">
                  <div 
                    v-for="(option, optIndex) in question.options" 
                    :key="optIndex"
                    class="option-item"
                    :class="{'option-correct': option === question.correctAnswer}"
                  >
                    <div class="option-marker">
                      {{ ['A', 'B', 'C', 'D', 'E'][optIndex] }}
                    </div>
                    <div class="option-text">{{ option }}</div>
                    <div v-if="option === question.correctAnswer" class="option-badge">
                      <i class="bi bi-check-circle-fill"></i>
                    </div>
                  </div>
                </div>
                
                <div v-if="question.explanation" class="question-explanation">
                  <h5 class="explanation-title">
                    <i class="bi bi-info-circle me-2"></i>Giải thích
                  </h5>
                  <p>{{ question.explanation }}</p>
                </div>
              </div>
            </div>
            <div v-else class="empty-content">
              <i class="bi bi-patch-question-fill"></i>
              <p>Chưa có câu hỏi tự động cho tài liệu này</p>
              <button @click="generateQuestions" class="btn btn-outline-primary btn-sm">
                Tạo câu hỏi tự động
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Not Found -->
    <div v-else class="not-found-container">
      <div class="not-found-icon">
        <i class="bi bi-file-earmark-x"></i>
      </div>
      <h3 class="not-found-title">Không tìm thấy tài liệu</h3>
      <p class="not-found-message">Tài liệu không tồn tại hoặc đã bị xóa</p>
      <router-link to="/documents" class="btn btn-primary">
        <i class="bi bi-arrow-left me-2"></i>Quay lại danh sách tài liệu
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

export default {
  name: 'DocumentDetail',
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
    const activeTab = ref('summary');

    // Lấy id từ props hoặc route
    const docId = computed(() => props.id || route.params.id);

    // Computed properties
    const document = computed(() => store.state.document.currentDocument);
    const loading = computed(() => store.state.document.loading);
    const error = computed(() => store.state.document.error);

    // Lifecycle hooks
    onMounted(() => {
      fetchDocument();
    });

    // Methods
    const fetchDocument = () => {
      store.dispatch('document/fetchDocumentById', docId.value);
    };

    const reload = () => {
      fetchDocument();
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const getDocumentTypeLabel = (title) => {
      if (!title) return 'Tài liệu';
      const extension = title.split('.').pop().toLowerCase();
      switch (extension) {
        case 'pdf': return 'PDF';
        case 'doc':
        case 'docx': return 'Word';
        case 'txt': return 'Văn bản';
        default: return 'Tài liệu';
      }
    };

    const calculateReadingTime = (content) => {
      if (!content) return 1;
      const wordsPerMinute = 200;
      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / wordsPerMinute);
      return readingTime > 0 ? readingTime : 1;
    };

    // Sửa lại hàm formatParagraphs để luôn bọc <p>...</p>
    const formatParagraphs = (text) => {
      if (!text) return '';
      return '<p>' + text.split('\n').map(para => para.trim()).filter(para => para.length > 0).join('</p><p>') + '</p>';
    };

    const generateQuiz = async () => {
      try {
        store.commit('document/SET_LOADING', true);
        const response = await api.post(`/documents/${docId.value}/generate-quiz`);
        if (response.data && response.data.quiz) {
          router.push({
            name: 'QuizDetail',
            params: { id: response.data.quiz._id }
          });
        } else {
          throw new Error('Không nhận được dữ liệu quiz từ server');
        }
      } catch (error) {
        console.error('Error generating quiz:', error);
        alert('Có lỗi khi tạo quiz. Vui lòng thử lại sau.');
      } finally {
        store.commit('document/SET_LOADING', false);
      }
    };

    const generateSummary = async () => {
      alert('Tính năng đang được phát triển');
    };

    const generateQuestions = async () => {
      alert('Tính năng đang được phát triển');
    };

    const downloadDocument = () => {
      alert('Tính năng đang được phát triển');
    };

    const shareDocument = () => {
      alert('Tính năng đang được phát triển');
    };

    const confirmDelete = async () => {
      if (confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
        const success = await store.dispatch('document/deleteDocument', docId.value);
        if (success) {
          router.push({ name: 'Documents' });
        }
      }
    };

    return {
      activeTab,
      document,
      loading,
      error,
      formatDate,
      getDocumentTypeLabel,
      calculateReadingTime,
      formatParagraphs,
      generateQuiz,
      generateSummary,
      generateQuestions,
      downloadDocument,
      shareDocument,
      confirmDelete,
      reload
    };
  }
}
</script>

<style scoped>
.document-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%);
  min-height: 100vh;
}

/* Loader */
.detail-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: #4776e6;
  font-weight: 500;
}
.pulse-loader {
  width: 54px;
  height: 54px;
  border: 6px solid #e0e7ff;
  border-top: 6px solid #4776e6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.2rem;
}
@keyframes spin { to { transform: rotate(360deg);} }

/* Error & Not Found */
.error-container, .not-found-container {
  text-align: center;
  padding: 3rem 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 5px 20px rgba(71, 118, 230, 0.08);
}
.error-icon, .not-found-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #e53e3e;
}
.not-found-icon { color: #718096; }
.error-title, .not-found-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.error-title { color: #e53e3e; }
.not-found-title { color: #2d3748; }
.error-message, .not-found-message {
  color: #718096;
  margin-bottom: 2rem;
}
.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.btn-retry, .btn-back {
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}
.btn-retry {
  background: #fff;
  color: #e53e3e;
  border: 2px solid #e53e3e;
}
.btn-retry:hover {
  background: #e53e3e;
  color: #fff;
}
.btn-back {
  background: #f0f0f0;
  color: #4a5568;
}
.btn-back:hover {
  background: #e2e8f0;
}

/* Document Container */
.document-container {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(71, 118, 230, 0.05);
}

/* Header */
.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.document-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}
.document-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}
.meta-item {
  color: #718096;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}
.document-actions {
  display: flex;
  gap: 0.75rem;
  margin-left: auto;
}
.btn-primary {
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 4px 8px rgba(71, 118, 230, 0.15);
  transition: all 0.3s;
}
.btn-primary:hover {
  filter: brightness(1.1);
}
.btn-outline-secondary {
  border: 1.5px solid #cbd5e0;
  color: #718096;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  background: #fff;
}
.dropdown-menu {
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 0.5rem;
  min-width: 200px;
  margin-top: 0.5rem;
}
.dropdown-item {
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.dropdown-item:hover {
  background: #f8f9fa;
}

/* Tabs */
.tabs-container {
  margin-bottom: 1.5rem;
}
.nav-tabs-custom {
  display: flex;
  border-bottom: 2px solid #e0e8f0;
  overflow-x: auto;
  scrollbar-width: thin;
}
.tab-btn {
  padding: 0.75rem 1.25rem;
  color: #718096;
  background: none;
  border: none;
  font-weight: 600;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.tab-btn.active {
  color: #4776e6;
  background: #e0e7ff;
  border-radius: 1.2rem 1.2rem 0 0;
}
.tab-btn .badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.5rem;
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  color: white;
}

/* Tab Content */
.tab-content {
  min-height: 300px;
}
.content-card {
  background: #f8fafc;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(71, 118, 230, 0.04);
  padding: 2rem;
}
.content-title {
  font-size: 1.4rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* Summary & Content */
.summary-text, .content-text {
  color: #222;
  background: #fff;
  min-height: 50px;
  font-size: 1.08rem;
  line-height: 1.7;
  padding: 0.5rem 0;
  word-break: break-word;
}
.summary-text p, .content-text p {
  color: #222;
  font-size: 1.08rem;
  line-height: 1.7;
  margin-bottom: 1rem;
  word-break: break-word;
}
.key-concepts {
  margin-top: 2rem;
  background: linear-gradient(to right, rgba(71, 118, 230, 0.05), rgba(142, 84, 233, 0.05));
  padding: 1.5rem;
  border-radius: 10px;
}
.key-concepts-title {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 600;
}
.key-concepts-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.key-concept-tag {
  background: linear-gradient(135deg, rgba(71, 118, 230, 0.2), rgba(142, 84, 233, 0.2));
  color: #4a5568;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.key-concept-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

/* Questions */
.questions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.question-item {
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  border-left: 4px solid #4776e6;
  color: #222;
  box-shadow: 0 2px 8px rgba(71, 118, 230, 0.07);
}
.question-header {
  display: flex;
  margin-bottom: 1.25rem;
  gap: 1rem;
}
.question-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  flex-shrink: 0;
}
.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.5;
}
.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}
.option-item {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #222;
  transition: border 0.2s, background 0.2s;
}
.option-correct {
  border-color: #38a169;
  background: #e6f9f0;
}
.option-marker {
  width: 24px;
  height: 24px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 1rem;
}
.option-correct .option-marker {
  background: #38a169;
  color: #fff;
}
.option-text {
  font-size: 0.98rem;
  color: #4a5568;
}
.option-badge {
  margin-left: auto;
  color: #38a169;
}
.question-explanation {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  color: #4f46e5;
  margin-top: 0.7rem;
}
.explanation-title {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* Empty Content */
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #a0aec0;
}
.empty-content i {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.empty-content p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 900px) {
  .document-header { flex-direction: column; gap: 1.5rem; }
  .document-actions { margin-left: 0; width: 100%; }
  .btn-primary { flex-grow: 1; }
  .content-card { padding: 1.2rem 0.5rem; }
}
@media (max-width: 600px) {
  .document-container { border-radius: 0.7rem; padding: 0.7rem; }
  .content-card { border-radius: 0.7rem; }
  .document-title { font-size: 1.3rem; }
  .tab-btn { font-size: 0.98rem; padding: 0.7rem 0.8rem 0.5rem 0.8rem; }
}
</style>
<style>
.summary-text, .content-text, .summary-text *, .content-text * {
  color: #222 !important;
  background: #fff !important;
  font-size: 1.08rem !important;
  line-height: 1.7 !important;
  opacity: 1 !important;
  visibility: visible !important;
}
</style>