import { createRouter, createWebHistory } from 'vue-router';

// Import các component
const Home = () => import('@/views/Home.vue');
const DocumentsView = () => import('@/views/DocumentsView.vue');
const DocumentUpload = () => import('@/components/document/DocumentUpload.vue');
const DocumentDetail = () => import('@/components/document/DocumentDetail.vue');
const QuizzesView = () => import('@/views/QuizzesView.vue');
const QuizCreator = () => import('@/components/quiz/QuizCreator.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/documents',
    name: 'Documents',
    component: DocumentsView
  },
  {
    path: '/documents/upload',
    name: 'DocumentUpload',
    component: DocumentUpload
  },
  {
    path: '/documents/:id',
    name: 'DocumentDetail',
    props: true,
    component: DocumentDetail
  },
  {
    path: '/quizzes',
    name: 'Quizzes',
    component: QuizzesView
  },
  {
    path: '/quizzes/create',
    name: 'CreateQuiz',
    component: QuizCreator
  },
  {
    path: '/quizzes/:id',
    name: 'QuizDetail',
    props: true,
    component: () => import('@/components/quiz/QuizDetail.vue')
  },
  {
    path: '/quizzes/:id/play',
    name: 'QuizPlayer',
    props: true,
    component: () => import('@/components/quiz/QuizPlayer.vue')
  },
  {
    path: '/quizzes/:id/edit',
    name: 'EditQuiz',
    props: true,
    component: () => import('@/components/quiz/QuizEdit.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;