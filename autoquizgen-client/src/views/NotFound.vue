<template>
  <div class="not-found container text-center py-5">
    <h1 class="display-1 text-danger">404</h1>
    <h2 class="mb-4">Không tìm thấy trang</h2>
    <p class="mb-4">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
    <button @click="goBack" class="btn btn-secondary">Quay lại trang trước</button>
    <router-link to="/" class="btn btn-primary">Quay về trang chủ</router-link>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter();
    
    const goBack = () => {
      router.go(-1);
    };
    
    const goHome = () => {
      router.push('/');
    };
    
    return {
      goBack,
      goHome
    };
  }
}
</script>