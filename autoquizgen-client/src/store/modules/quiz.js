import api from '@/services/api'

export default {
  namespaced: true,
  
  state: () => ({
    quizzes: [],
    currentQuiz: null,
    loading: false,
    error: null
  }),
  
  mutations: {
    SET_QUIZZES(state, quizzes) {
      state.quizzes = quizzes;
    },
    SET_CURRENT_QUIZ(state, quiz) {
      state.currentQuiz = quiz;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    ADD_QUIZ(state, quiz) {
      state.quizzes.unshift(quiz);
    },
    DELETE_QUIZ(state, quizId) {
      state.quizzes = state.quizzes.filter(q => q._id !== quizId);
    }
  },
  
  actions: {
    async fetchQuizzes({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/quizzes');
        commit('SET_QUIZZES', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể lấy danh sách quiz');
        console.error('Error fetching quizzes:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchQuizById({ commit }, quizId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/quizzes/${quizId}`);
        commit('SET_CURRENT_QUIZ', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tìm thấy quiz');
        console.error('Error fetching quiz:', error);
        return null;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async createQuiz({ commit }, quizData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/quizzes', quizData);
        commit('ADD_QUIZ', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tạo quiz');
        console.error('Error creating quiz:', error);
        return null;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async updateQuiz({ commit }, { id, quizData }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/quizzes/${id}`, quizData);
        commit('SET_CURRENT_QUIZ', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể cập nhật quiz');
        console.error('Error updating quiz:', error);
        return null;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async deleteQuiz({ commit }, quizId) {
      commit('SET_LOADING', true);
      try {
        await api.delete(`/quizzes/${quizId}`);
        commit('DELETE_QUIZ', quizId);
        commit('SET_ERROR', null);
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể xóa quiz');
        console.error('Error deleting quiz:', error);
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async generateQuiz({ commit }, textData) {
      commit('SET_LOADING', true);
      try {
        console.log('Sending data to generate quiz:', textData);
        
        // Đảm bảo dữ liệu được gửi đúng định dạng
        const payload = {
          title: textData.title,
          description: textData.description || '',
          text: textData.content 
        };
        
        const response = await api.post('/quizzes/generate', payload);
        console.log('Quiz generation response:', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        console.error('Error details:', error.response || error);
        let errorMessage = 'Không thể tạo quiz từ nội dung';
        
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }
        
        commit('SET_ERROR', errorMessage);
        return null;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    allQuizzes: state => state.quizzes,
    currentQuiz: state => state.currentQuiz,
    isLoading: state => state.loading,
    error: state => state.error
  }
};