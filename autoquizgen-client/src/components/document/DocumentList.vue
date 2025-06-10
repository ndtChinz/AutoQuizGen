<template>
  <div class="document-list">
    <!-- Loading State -->
    <div v-if="loading" class="loader-container">
      <div class="loader-animation">
        <div class="book-loader">
          <div class="book">
            <div class="book__page"></div>
            <div class="book__page"></div>
            <div class="book__page"></div>
          </div>
        </div>
      </div>
      <p class="loader-text">Đang tải danh sách tài liệu...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <i class="bi bi-exclamation-octagon"></i>
      </div>
      <h3 class="error-title">Có lỗi xảy ra</h3>
      <p class="error-message">{{ error }}</p>
      <button class="btn btn-refresh" @click="fetchDocuments">
        <i class="bi bi-arrow-repeat me-2"></i>Thử lại
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="documents.length === 0" class="empty-state">
      <div class="empty-illustration">
        <i class="bi bi-file-earmark-text"></i>
      </div>
      <h3 class="empty-title">Chưa có tài liệu nào</h3>
      <p class="empty-message">Bắt đầu bằng cách tải lên tài liệu đầu tiên của bạn</p>
      <router-link to="/documents/upload" class="btn btn-primary btn-lg mt-3 upload-btn">
        <i class="bi bi-cloud-arrow-up me-2"></i>Tải lên tài liệu đầu tiên
      </router-link>
    </div>

    <!-- Documents Grid -->
    <div v-else>
      <div class="document-header">
        <h2 class="section-title">Tài liệu của bạn</h2>
        <router-link to="/documents/upload" class="btn btn-add">
          <i class="bi bi-plus-circle me-2"></i>Tải lên tài liệu mới
        </router-link>
      </div>
      
      <div class="documents-grid">
        <div v-for="document in documents" :key="document._id" class="document-card">
          <div class="document-type-indicator" :class="getDocumentTypeClass(document.title)">
            <i :class="getDocumentTypeIcon(document.title)"></i>
          </div>
          <div class="document-card-content">
            <h3 class="document-title" :title="document.title">{{ document.title }}</h3>
            <div class="document-meta">
              <span class="document-date">
                <i class="bi bi-calendar3 me-1"></i>
                {{ formatDate(document.createdAt) }}
              </span>
              <span v-if="document.pages" class="document-pages">
                <i class="bi bi-file-earmark-text me-1"></i>
                {{ document.pages }} trang
              </span>
            </div>
            <p class="document-summary" v-if="document.summary">
              {{ truncateSummary(document.summary, 120) }}
            </p>
            <div class="document-actions">
              <router-link :to="`/documents/${document._id}`" class="btn-action btn-view" title="Xem chi tiết">
                <i class="bi bi-eye"></i>
                <span>Xem</span>
              </router-link>
              <button @click="generateQuiz(document._id)" class="btn-action btn-quiz" title="Tạo quiz">
                <i class="bi bi-lightning"></i>
                <span>Tạo quiz</span>
              </button>
              <button @click="confirmDelete(document._id)" class="btn-action btn-delete" title="Xóa">
                <i class="bi bi-trash"></i>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'DocumentList',
  
  computed: {
    ...mapState('document', ['loading', 'error']),
    ...mapGetters('document', ['allDocuments']),
    documents() {
      return this.allDocuments;
    }
  },
  
  created() {
    this.fetchDocuments();
  },
  
  methods: {
    ...mapActions('document', ['fetchDocuments', 'deleteDocument', 'generateQuizFromDocument']),
    
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },
    
    truncateSummary(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    
    getDocumentTypeClass(filename) {
      if (!filename) return 'type-other';
      const extension = filename.split('.').pop().toLowerCase();
      
      if (extension === 'pdf') return 'type-pdf';
      if (['doc', 'docx'].includes(extension)) return 'type-word';
      if (['xls', 'xlsx', 'csv'].includes(extension)) return 'type-excel';
      if (['ppt', 'pptx'].includes(extension)) return 'type-powerpoint';
      if (['txt', 'md'].includes(extension)) return 'type-text';
      
      return 'type-other';
    },
    
    getDocumentTypeIcon(filename) {
      if (!filename) return 'bi bi-file-earmark';
      const extension = filename.split('.').pop().toLowerCase();
      
      if (extension === 'pdf') return 'bi bi-file-earmark-pdf';
      if (['doc', 'docx'].includes(extension)) return 'bi bi-file-earmark-word';
      if (['xls', 'xlsx', 'csv'].includes(extension)) return 'bi bi-file-earmark-excel';
      if (['ppt', 'pptx'].includes(extension)) return 'bi bi-file-earmark-slides';
      if (['txt', 'md'].includes(extension)) return 'bi bi-file-earmark-text';
      
      return 'bi bi-file-earmark';
    },
    
    async generateQuiz(documentId) {
      try {
        const result = await this.generateQuizFromDocument(documentId);
        if (result) {
          this.$router.push({
            name: 'QuizCreate',
            query: { documentId },
            params: { questions: result.questions, title: result.documentTitle }
          });
        }
      } catch (error) {
        console.error('Error generating quiz:', error);
      }
    },
    
    confirmDelete(documentId) {
      if (confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
        this.deleteDocument(documentId);
      }
    }
  }
}
</script>

<style scoped>
.document-list {
  padding: 1.5rem 0;
}

/* Loading Animation */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loader-animation {
  margin-bottom: 1.5rem;
}

.book-loader {
  --color: #4776e6;
  --duration: 6.8s;
  width: 32px;
  height: 12px;
  position: relative;
  margin: 32px auto;
}

.book {
  width: 32px;
  height: 12px;
  position: relative;
  perspective: 60px;
}

.book__page {
  --color: #4776e6;
  position: absolute;
  top: 0;
  width: 16px;
  height: 12px;
  transform-origin: left center;
  animation: var(--duration) page-flip infinite ease-in-out;
  background-color: var(--color);
  z-index: 1;
}

.book__page:nth-child(1) {
  --duration: 1.4s;
  --delay: 0.2s;
  left: 0;
  animation-delay: var(--delay);
}

.book__page:nth-child(2) {
  --duration: 1.4s;
  --delay: 0.4s;
  left: 0;
  animation-delay: var(--delay);
}

.book__page:nth-child(3) {
  --duration: 1.4s;
  --delay: 0.6s;
  left: 0;
  animation-delay: var(--delay);
}

@keyframes page-flip {
  0% {
    transform: rotateY(0deg);
    z-index: 1;
  }
  25% {
    z-index: 2;
  }
  50% {
    transform: rotateY(-180deg);
    z-index: 1;
  }
  75% {
    z-index: 1;
  }
  100% {
    transform: rotateY(0deg);
    z-index: 1;
  }
}

.loader-text {
  color: #4776e6;
  font-weight: 500;
  margin-top: 1rem;
}

/* Error State */
.error-container {
  background-color: #fff0f0;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 5px 20px rgba(221, 107, 107, 0.1);
}

.error-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.error-title {
  color: #e74c3c;
  font-weight: 600;
  margin-bottom: 1rem;
}

.error-message {
  color: #7d7d7d;
  margin-bottom: 2rem;
}

.btn-refresh {
  background-color: #ffffff;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-refresh:hover {
  background-color: #e74c3c;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  border-radius: 16px;
  margin: 2rem auto;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.empty-illustration {
  font-size: 5rem;
  color: #8e54e9;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-title {
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

.empty-message {
  color: #777;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.upload-btn {
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  border: none;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(71, 118, 230, 0.2);
}

/* Document List */
.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  position: relative;
  padding-left: 1rem;
  margin: 0;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #4776e6, #8e54e9);
  border-radius: 4px;
}

.btn-add {
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(71, 118, 230, 0.3);
}

/* Document Grid */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.document-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.document-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.document-type-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
}

.type-pdf {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

.type-word {
  background: linear-gradient(135deg, #4776e6, #1d9bf0);
}

.type-excel {
  background: linear-gradient(135deg, #38ef7d, #11998e);
}

.type-powerpoint {
  background: linear-gradient(135deg, #f09819, #ff512f);
}

.type-text {
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
}

.type-other {
  background: linear-gradient(135deg, #9bafd9, #103783);
}

.document-card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.document-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 2rem;
}

.document-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #718096;
}

.document-summary {
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
}

.btn-view {
  color: #4776e6;
  background-color: rgba(71, 118, 230, 0.1);
}

.btn-view:hover {
  background-color: rgba(71, 118, 230, 0.2);
}

.btn-quiz {
  color: #8e54e9;
  background-color: rgba(142, 84, 233, 0.1);
}

.btn-quiz:hover {
  background-color: rgba(142, 84, 233, 0.2);
}

.btn-delete {
  color: #e53e3e;
  background-color: rgba(229, 62, 62, 0.1);
}

.btn-delete:hover {
  background-color: rgba(229, 62, 62, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .document-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .documents-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 576px) {
  .documents-grid {
    grid-template-columns: 1fr;
  }
}
</style>