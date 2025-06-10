import api from '@/services/api'

export default {
  namespaced: true,
  
  state: () => ({
    documents: [],
    currentDocument: null,
    loading: false,
    error: null
  }),
  
  mutations: {
    SET_DOCUMENTS(state, documents) {
      state.documents = documents;
    },
    SET_CURRENT_DOCUMENT(state, document) {
      state.currentDocument = document;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    ADD_DOCUMENT(state, document) {
      state.documents.unshift(document);
    },
    DELETE_DOCUMENT(state, documentId) {
      state.documents = state.documents.filter(doc => doc._id !== documentId);
    }
  },
  
  actions: {
    async fetchDocuments({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/documents');
        commit('SET_DOCUMENTS', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể lấy danh sách tài liệu');
        console.error('Error fetching documents:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchDocumentById({ commit }, documentId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/documents/${documentId}`);
        commit('SET_CURRENT_DOCUMENT', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tìm thấy tài liệu');
        console.error('Error fetching document:', error);
        return null;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async uploadDocument({ commit }, formData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        commit('ADD_DOCUMENT', response.data.document);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tải lên tài liệu');
        console.error('Error uploading document:', error);
        return null;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async deleteDocument({ commit }, documentId) {
      commit('SET_LOADING', true);
      try {
        await api.delete(`/documents/${documentId}`);
        commit('DELETE_DOCUMENT', documentId);
        commit('SET_ERROR', null);
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể xóa tài liệu');
        console.error('Error deleting document:', error);
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async generateQuizFromDocument({ commit }, documentId) {
      commit('SET_LOADING', true);
      try {
        console.log(`Calling API: /documents/${documentId}/generate-quiz`);
        const response = await api.post(`/documents/${documentId}/generate-quiz`);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        console.error('Error details:', error.response || error);
        commit('SET_ERROR', error.message || 'Không thể tạo quiz từ tài liệu');
        return null;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    allDocuments: state => state.documents,
    currentDocument: state => state.currentDocument,
    isLoading: state => state.loading,
    error: state => state.error
  }
};