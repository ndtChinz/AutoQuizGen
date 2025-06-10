<template>
  <div class="document-upload">
    <div class="upload-container">
      <div class="upload-header">
        <h1 class="upload-title">Tải lên tài liệu</h1>
        <p class="upload-subtitle">
          Tải lên tài liệu của bạn để tạo quiz tự động và phân tích nội dung
        </p>
      </div>

      <div class="upload-card">
        <div class="upload-steps">
          <div class="step" :class="{ 'active': currentStep >= 1, 'complete': currentStep > 1 }">
            <div class="step-number">1</div>
            <div class="step-info">
              <h3 class="step-title">Chọn tài liệu</h3>
              <p class="step-desc">Chọn tệp từ máy tính của bạn</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step" :class="{ 'active': currentStep >= 2, 'complete': currentStep > 2 }">
            <div class="step-number">2</div>
            <div class="step-info">
              <h3 class="step-title">Xử lý</h3>
              <p class="step-desc">AI phân tích nội dung tài liệu</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step" :class="{ 'active': currentStep >= 3 }">
            <div class="step-number">3</div>
            <div class="step-info">
              <h3 class="step-title">Hoàn thành</h3>
              <p class="step-desc">Tài liệu đã sẵn sàng để sử dụng</p>
            </div>
          </div>
        </div>

        <div class="upload-area" 
             :class="{ 'dragging': isDragging, 'has-file': file }"
             @dragover.prevent="handleDragOver"
             @dragleave.prevent="isDragging = false"
             @drop.prevent="handleDrop">
          
          <div v-if="!file" class="upload-placeholder">
            <div class="upload-icon">
              <i class="bi bi-cloud-arrow-up"></i>
            </div>
            <h3 class="upload-message">Kéo & thả tài liệu hoặc bấm để chọn</h3>
            <p class="upload-formats">Hỗ trợ PDF, DOC, DOCX, TXT (tối đa 10MB)</p>
            <input 
              type="file"
              id="document-upload"
              class="upload-input"
              @change="handleFileChange"
              accept=".pdf,.txt,.doc,.docx"
              ref="fileInput"
            >
            <label for="document-upload" class="btn btn-primary btn-upload">
              <i class="bi bi-folder me-2"></i>Chọn tài liệu
            </label>
          </div>
          
          <div v-else class="file-selected">
            <div class="file-preview">
              <i :class="getFileIcon(file.name)"></i>
            </div>
            <div class="file-info">
              <h4 class="file-name">{{ file.name }}</h4>
              <p class="file-meta">{{ formatFileSize(file.size) }} · {{ getFileType(file.name) }}</p>
            </div>
            <div class="file-actions">
              <button class="btn btn-outline-danger" @click="removeFile">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="document-form" v-if="file && !loading && !error">
          <div class="form-group">
            <label for="title" class="form-label">Tiêu đề tài liệu</label>
            <input
              type="text"
              id="title"
              class="form-control"
              v-model="title"
              placeholder="Nhập tiêu đề cho tài liệu"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Mô tả (không bắt buộc)</label>
            <textarea
              id="description"
              class="form-control"
              v-model="description"
              placeholder="Nhập một mô tả ngắn cho tài liệu này"
              rows="3"
            ></textarea>
          </div>
          
          <div class="document-options">
            <div class="option-tile" :class="{ 'active': generateSummary }" @click="generateSummary = !generateSummary">
              <div class="option-icon">
                <i class="bi bi-journal-text"></i>
              </div>
              <div class="option-info">
                <h4>Tóm tắt tự động</h4>
                <p>Tạo phần tóm tắt ngắn gọn nội dung chính của tài liệu</p>
              </div>
              <div class="option-toggle">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="generateSummarySwitch" v-model="generateSummary">
                </div>
              </div>
            </div>
            
            <div class="option-tile" :class="{ 'active': generateQuestions }" @click="generateQuestions = !generateQuestions">
              <div class="option-icon">
                <i class="bi bi-question-circle"></i>
              </div>
              <div class="option-info">
                <h4>Câu hỏi tự động</h4>
                <p>Tạo danh sách các câu hỏi trắc nghiệm từ nội dung tài liệu</p>
              </div>
              <div class="option-toggle">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="generateQuestionsSwitch" v-model="generateQuestions">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="upload-processing">
          <div class="processing-animation">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="processing-spark spark-1"></div>
            <div class="processing-spark spark-2"></div>
            <div class="processing-spark spark-3"></div>
          </div>
          <h3 class="processing-title">Đang xử lý tài liệu của bạn</h3>
          <p class="processing-message">
            Quá trình này có thể mất từ vài giây đến một phút tùy thuộc vào kích thước và độ phức tạp của tài liệu.
          </p>
          <div class="processing-progress">
            <div class="progress">
              <div class="progress-bar progress-bar-striped progress-bar-animated" 
                  role="progressbar" 
                  :style="{ width: uploadProgress + '%' }" 
                  :aria-valuenow="uploadProgress" 
                  aria-valuemin="0" 
                  aria-valuemax="100">
              </div>
            </div>
            <div class="processing-stage">{{ processingStage }}</div>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="upload-error">
          <div class="error-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3 class="error-title">Đã xảy ra lỗi</h3>
          <p class="error-message">{{ error }}</p>
          <button class="btn btn-primary btn-lg" @click="resetUpload">
            <i class="bi bi-arrow-repeat me-2"></i>Thử lại
          </button>
        </div>

        <div class="upload-actions" v-if="file && !loading && !error">
          <button @click="goBack" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Quay lại
          </button>
          <button @click="uploadDocument" class="btn btn-primary" :disabled="!isFormValid">
            <i class="bi bi-cloud-upload me-2"></i>Tải lên
          </button>
        </div>
      </div>

      <!-- Tips Card -->
      <div class="tips-card">
        <div class="tips-header">
          <div class="tips-icon">
            <i class="bi bi-lightbulb-fill"></i>
          </div>
          <h3>Mẹo cho kết quả tốt nhất</h3>
        </div>
        <div class="tips-content">
          <ul class="tips-list">
            <li>
              <i class="bi bi-check-circle-fill"></i>
              <span>Sử dụng tài liệu có nội dung rõ ràng, có cấu trúc để AI phân tích tốt hơn</span>
            </li>
            <li>
              <i class="bi bi-check-circle-fill"></i>
              <span>Tệp PDF không nên bị khóa hoặc bảo vệ bằng mật khẩu</span>
            </li>
            <li>
              <i class="bi bi-check-circle-fill"></i>
              <span>Tệp có định dạng văn bản sẽ cho kết quả phân tích chính xác hơn so với tệp chứa hình ảnh</span>
            </li>
            <li>
              <i class="bi bi-check-circle-fill"></i>
              <span>Tệp có kích thước dưới 5MB sẽ được xử lý nhanh hơn</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'DocumentUpload',
  setup() {
    const store = useStore();
    const router = useRouter();
    const fileInput = ref(null);
    
    // State
    const file = ref(null);
    const title = ref('');
    const description = ref('');
    const uploadProgress = ref(0);
    const isDragging = ref(false);
    const generateSummary = ref(true);
    const generateQuestions = ref(true);
    const currentStep = ref(1);
    const processingStage = ref('Đang đọc nội dung tài liệu...');
    
    // Processing stages display
    const processingStages = [
      'Đang đọc nội dung tài liệu...',
      'Đang phân tích văn bản...',
      'Đang tạo tóm tắt...',
      'Đang tạo câu hỏi...',
      'Đang hoàn thiện...'
    ];
    let stageInterval;
    
    // Computed
    const loading = computed(() => store.state.document.loading);
    const error = computed(() => store.state.document.error);
    const isFormValid = computed(() => file.value && title.value.trim() !== '');
    
    // Watch loading state changes
    watch(loading, (newValue, oldValue) => {
      if (oldValue === true && newValue === false && !error.value) {
        // Đã chuyển từ loading sang không loading và không có lỗi
        currentStep.value = 3; // Chuyển sang bước 3 (Hoàn thành)
        uploadProgress.value = 100;
        if (stageInterval) {
          clearInterval(stageInterval);
        }
      }
    });
    
    // Methods
    const handleFileChange = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        file.value = files[0];
        if (!title.value) {
          title.value = file.value.name.split('.')[0];
        }
      }
    };
    
    const handleDragOver = (e) => {
      e.preventDefault();
      isDragging.value = true;
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      isDragging.value = false;
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        file.value = files[0];
        if (!title.value) {
          title.value = file.value.name.split('.')[0];
        }
      }
    };
    
    const removeFile = () => {
      file.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };
    
    const resetUpload = () => {
      removeFile();
      title.value = '';
      description.value = '';
      store.commit('document/SET_ERROR', null);
    };
    
    const goBack = () => {
      router.push('/documents');
    };
    
    const getFileIcon = (filename) => {
      if (!filename) return 'bi bi-file-earmark';
      const extension = filename.split('.').pop().toLowerCase();
      
      if (extension === 'pdf') return 'bi bi-file-earmark-pdf-fill';
      if (['doc', 'docx'].includes(extension)) return 'bi bi-file-earmark-word-fill';
      if (['xls', 'xlsx', 'csv'].includes(extension)) return 'bi bi-file-earmark-excel-fill';
      if (['ppt', 'pptx'].includes(extension)) return 'bi bi-file-earmark-slides-fill';
      if (['txt', 'md'].includes(extension)) return 'bi bi-file-earmark-text-fill';
      
      return 'bi bi-file-earmark-fill';
    };
    
    const getFileType = (filename) => {
      if (!filename) return 'Unknown';
      const extension = filename.split('.').pop().toLowerCase();
      
      if (extension === 'pdf') return 'PDF Document';
      if (['doc', 'docx'].includes(extension)) return 'Word Document';
      if (['xls', 'xlsx'].includes(extension)) return 'Excel Spreadsheet';
      if (['ppt', 'pptx'].includes(extension)) return 'PowerPoint';
      if (['txt'].includes(extension)) return 'Text File';
      if (['md'].includes(extension)) return 'Markdown';
      
      return 'Unknown File';
    };
    
    const formatFileSize = (bytes) => {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const startProcessingAnimation = () => {
      let index = 0;
      stageInterval = setInterval(() => {
        index = (index + 1) % processingStages.length;
        processingStage.value = processingStages[index];
        uploadProgress.value = Math.min(uploadProgress.value + 5, 95); // Simulate progress
      }, 3000);
    };
    
    const uploadDocument = async () => {
      if (!isFormValid.value) return;
      
      currentStep.value = 2;
      uploadProgress.value = 10;
      startProcessingAnimation();
      
      const formData = new FormData();
      formData.append('file', file.value);
      formData.append('title', title.value);
      formData.append('description', description.value);
      formData.append('generateSummary', generateSummary.value);
      formData.append('generateQuestions', generateQuestions.value);
      
      try {
        const response = await store.dispatch('document/uploadDocument', formData);
        if (response && response._id) {
          // Chỉ cần cập nhật currentStep, chuyển trang sẽ được xử lý ở watch
          setTimeout(() => {
            router.push(`/documents/${response._id}`);
          }, 1000);
        }
      } catch (err) {
        console.error('Upload error:', err);
        currentStep.value = 1;
      }
    };
    
    // Cleanup
    onBeforeUnmount(() => {
      if (stageInterval) {
        clearInterval(stageInterval);
      }
    });
    
    return {
      file,
      fileInput,
      title,
      description,
      isDragging,
      loading,
      error,
      generateSummary,
      generateQuestions,
      isFormValid,
      currentStep,
      processingStage,
      uploadProgress,
      handleFileChange,
      handleDragOver,
      handleDrop,
      removeFile,
      resetUpload,
      goBack,
      getFileIcon,
      getFileType,
      formatFileSize,
      uploadDocument
    };
  }
}
</script>

<style scoped>
.document-upload {
  padding: 2rem 0;
  max-width: 900px;
  margin: 0 auto;
}

.upload-header {
  text-align: center;
  margin-bottom: 2rem;
}

.upload-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #4776E6;
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.upload-subtitle {
  font-size: 1.1rem;
  color: #718096;
}

.upload-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease;
  position: relative;
  overflow: hidden;
}

.upload-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding: 0 1rem;
  position: relative;
}

.step {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
  transition: all 0.3s ease;
  opacity: 0.7;
  filter: grayscale(1);
}

.step.active, .step.complete {
  opacity: 1;
  filter: grayscale(0);
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.step.active .step-number, .step.complete .step-number {
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  color: white;
  box-shadow: 0 4px 10px rgba(71, 118, 230, 0.3);
}

.step.complete .step-number::after {
  content: '✓';
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #2d3748;
}

.step-desc {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.step-connector {
  height: 3px;
  background-color: #e2e8f0;
  flex-grow: 0.5;
  margin: 0 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.step.complete + .step-connector {
  background: linear-gradient(135deg, #4776E6, #8E54E9);
}

.upload-area {
  background-color: #f8fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  cursor: pointer;
}

.upload-area:hover, .upload-area.dragging {
  background-color: #edf2f7;
  border-color: #4776E6;
}

.upload-area.has-file {
  background-color: #f0f9ff;
  border-color: #4776E6;
}

.upload-placeholder {
  text-align: center;
  width: 100%;
}

.upload-icon {
  font-size: 3.5rem;
  color: #4776E6;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.upload-message {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.upload-formats {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.upload-input {
  display: none;
}

.btn-upload {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(71, 118, 230, 0.3);
}

.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(71, 118, 230, 0.4);
}

.file-selected {
  display: flex;
  align-items: center;
  width: 100%;
}

.file-preview {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  color: #4776E6;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.file-meta {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.document-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-control {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.2);
}

.document-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-tile {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  cursor: pointer;
}

.option-tile.active {
  background: #edf7ff;
  border-color: #4776E6;
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(71, 118, 230, 0.1);
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #edf2f7;
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #4776E6;
  transition: all 0.3s;
}

.option-tile.active .option-icon {
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  color: white;
}

.option-info {
  flex: 1;
}

.option-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.option-info p {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.option-toggle {
  margin-left: 1rem;
}

.form-check-input {
  width: 2.5em;
  height: 1.25em;
}

.form-check-input:checked {
  background-color: #4776E6;
  border-color: #4776E6;
}

.upload-processing {
  text-align: center;
  padding: 3rem 0;
  animation: fadeIn 0.5s ease;
}

.processing-animation {
  margin-bottom: 2rem;
  position: relative;
  height: 100px;
}

.circle {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  border-radius: 50%;
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 1.5s infinite ease-in-out;
}

.circle:nth-child(1) {
  left: calc(50% - 40px);
  animation-delay: 0s;
}

.circle:nth-child(2) {
  animation-delay: 0.2s;
}

.circle:nth-child(3) {
  left: calc(50% + 40px);
  animation-delay: 0.4s;
}

.shadow {
  width: 20px;
  height: 5px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  filter: blur(1px);
  animation: shadow 1.5s infinite ease-in-out;
}

.shadow:nth-child(4) {
  left: calc(50% - 40px);
  animation-delay: 0s;
}

.shadow:nth-child(5) {
  animation-delay: 0.2s;
}

.shadow:nth-child(6) {
  left: calc(50% + 40px);
  animation-delay: 0.4s;
}

.processing-spark {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  opacity: 0;
  animation: spark 3s infinite ease-out;
}

.spark-1 {
  top: 20px;
  left: calc(50% - 20px);
  animation-delay: 0.2s;
}

.spark-2 {
  top: 50px;
  left: calc(50% + 30px);
  animation-delay: 0.8s;
}

.spark-3 {
  top: 30px;
  left: calc(50% - 50px);
  animation-delay: 1.5s;
}

.processing-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.processing-message {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.processing-progress {
  max-width: 400px;
  margin: 0 auto;
}

.processing-stage {
  font-size: 0.9rem;
  font-style: italic;
  color: #8E54E9;
  margin-top: 0.75rem;
}

.upload-error {
  text-align: center;
  padding: 3rem 0 2rem;
}

.error-icon {
  font-size: 4rem;
  color: #e53e3e;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.upload-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.tips-card {
  background: linear-gradient(135deg, #f6f8fc, #f0f5ff);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease 0.3s backwards;
}

.tips-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tips-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.tips-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.tips-list {
  padding-left: 0;
  list-style: none;
}

.tips-list li {
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.tips-list li:last-child {
  margin-bottom: 0;
}

.tips-list i {
  color: #4776E6;
  margin-right: 0.75rem;
  margin-top: 0.25rem;
}

.tips-list span {
  flex: 1;
  color: #4a5568;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-20px) translateX(-50%);
  }
}

@keyframes shadow {
  0%, 100% {
    transform: scale(1, 1) translateX(-50%);
  }
  50% {
    transform: scale(1.2, 1) translateX(-50%);
    opacity: 0.3;
  }
}

@keyframes spark {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    transform: scale(1) rotate(45deg);
    opacity: 1;
  }
  70% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
}

/* Responsive Styles */
@media (max-width: 767.98px) {
  .upload-title {
    font-size: 1.8rem;
  }
  
  .upload-card {
    padding: 1.5rem;
  }
  
  .upload-steps {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step {
    width: 100%;
  }
  
  .step-connector {
    height: 30px;
    width: 3px;
  }
  
  .document-options {
    grid-template-columns: 1fr;
  }
  
  .upload-area {
    padding: 1.5rem;
  }
  
  .upload-actions {
    flex-direction: column;
  }
  
  .upload-actions button {
    width: 100%;
  }
}
</style>