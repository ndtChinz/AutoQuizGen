import { createStore } from 'vuex'
import document from './modules/document'
import quiz from './modules/quiz'

export default createStore({
  modules: {
    document,
    quiz
  }
})