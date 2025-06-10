<template>
  <div class="quizzes container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Quiz của bạn</h1>
      <router-link to="/quizzes/create" class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i> Tạo quiz mới
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2">Đang tải danh sách quiz...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="quizzes.length === 0" class="text-center py-5">
      <i class="bi bi-question-circle fs-1 text-secondary"></i>
      <p class="mt-3">Bạn chưa có quiz nào</p>
      <router-link to="/quizzes/create" class="btn btn-primary mt-2">
        Tạo quiz đầu tiên
      </router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="quiz in quizzes" :key="quiz._id" class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ quiz.title }}</h5>
            <p class="card-text small">
              <i class="bi bi-calendar me-1"></i>
              {{ new Date(quiz.createdAt).toLocaleDateString('vi-VN') }}
              <span class="ms-2">
                <i class="bi bi-question-circle me-1"></i>
                {{ quiz.questions ? quiz.questions.length : 0 }} câu hỏi
              </span>
            </p>
            <p class="card-text" v-if="quiz.description">
              {{ quiz.description.substring(0, 100) }}{{ quiz.description.length > 100 ? '...' : '' }}
            </p>
            <div class="d-flex mt-3">
              <router-link :to="`/quizzes/${quiz._id}/play`" class="btn btn-sm btn-outline-primary me-2">
                <i class="bi bi-play-fill me-1"></i> Làm quiz
              </router-link>
              <button @click="deleteQuiz(quiz._id)" class="btn btn-sm btn-outline-danger">
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

export default {
  name: 'QuizzesView',
  setup() {
    const store = useStore();
    
    // Computed properties
    const quizzes = computed(() => store.state.quiz.quizzes);
    const loading = computed(() => store.state.quiz.loading);
    const error = computed(() => store.state.quiz.error);
    
    // Lifecycle hooks
    onMounted(() => {
      store.dispatch('quiz/fetchQuizzes');
    });
    
    // Methods
    const deleteQuiz = async (quizId) => {
      if (confirm('Bạn có chắc chắn muốn xóa quiz này không?')) {
        await store.dispatch('quiz/deleteQuiz', quizId);
      }
    };
    
    return {
      quizzes,
      loading,
      error,
      deleteQuiz
    };
  }
}
</script>