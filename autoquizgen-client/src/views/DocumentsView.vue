<template>
  <div class="documents container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Tài liệu của bạn</h1>
      <router-link to="/documents/upload" class="btn btn-primary">
        <i class="bi bi-upload me-1"></i> Tải lên tài liệu
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2">Đang tải danh sách tài liệu...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="documents.length === 0" class="text-center py-5">
      <i class="bi bi-file-earmark-x fs-1 text-secondary"></i>
      <p class="mt-3">Bạn chưa có tài liệu nào</p>
      <router-link to="/documents/upload" class="btn btn-primary mt-2">
        Tải lên tài liệu đầu tiên
      </router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="document in documents" :key="document._id" class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ document.title }}</h5>
            <p class="card-text small">
              <i class="bi bi-calendar me-1"></i>
              {{ new Date(document.createdAt).toLocaleDateString('vi-VN') }}
            </p>
            <p class="card-text" v-if="document.summary">
              {{ document.summary.substring(0, 100) }}...
            </p>
            <div class="d-flex mt-3">
              <router-link :to="`/documents/${document._id}`" class="btn btn-sm btn-outline-primary me-2">
                <i class="bi bi-eye me-1"></i> Xem chi tiết
              </router-link>
              <button @click="generateQuiz(document._id)" class="btn btn-sm btn-outline-success me-2">
                <i class="bi bi-lightning me-1"></i> Tạo quiz
              </button>
              <button @click="deleteDocument(document._id)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash me-1"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import api from '@/services/api';

export default {
  name: 'DocumentsView',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // Computed properties
    const documents = computed(() => store.state.document.documents);
    const loading = computed(() => store.state.document.loading);
    const error = computed(() => store.state.document.error);
    
    // Lifecycle hooks
    onMounted(() => {
      store.dispatch('document/fetchDocuments');
    });
    
    // Methods
    const generateQuiz = async (documentId) => {
      try {
        const response = await api.post(`/documents/${documentId}/generate-quiz`);
        
        if (response.data && response.data.quiz) {
          router.push({
            name: 'QuizDetail',
            params: { id: response.data.quiz._id }
          });
        }
      } catch (error) {
        console.error('Error generating quiz:', error);
      }
    };
    
    const deleteDocument = async (documentId) => {
      if (confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
        await store.dispatch('document/deleteDocument', documentId);
      }
    };
    
    return {
      documents,
      loading,
      error,
      generateQuiz,
      deleteDocument
    };
  }
}
</script>