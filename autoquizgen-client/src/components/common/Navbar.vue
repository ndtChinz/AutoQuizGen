<template>
  <nav class="navbar navbar-expand-lg navbar-custom shadow-sm sticky-top">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <div class="brand-icon me-2">
          <i class="bi bi-lightbulb-fill"></i>
        </div>
        <span class="brand-text">AutoQuizGen</span>
      </router-link>
      
      <button class="navbar-toggler border-0" type="button" @click="toggleNavbar" 
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <i class="bi" :class="isCollapsed ? 'bi-list' : 'bi-x-lg'"></i>
      </button>
      
      <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="isCollapsed = true">
              <i class="bi bi-house-door me-1"></i> Trang chủ
            </router-link>
          </li>
          
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" @click.prevent="toggleDropdown('document')" aria-expanded="false">
              <i class="bi bi-file-earmark-text me-1"></i> Tài liệu
            </a>
            <ul class="dropdown-menu dropdown-menu-custom shadow-sm border-0" :class="{ show: activeDropdown === 'document' }">
              <li>
                <router-link class="dropdown-item" to="/documents" @click="closeDropdowns">
                  <i class="bi bi-grid me-2"></i> Xem tất cả
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" to="/documents/upload" @click="closeDropdowns">
                  <i class="bi bi-cloud-arrow-up me-2"></i> Tải lên
                </router-link>
              </li>
            </ul>
          </li>
          
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" @click.prevent="toggleDropdown('quiz')" aria-expanded="false">
              <i class="bi bi-question-circle me-1"></i> Quiz
            </a>
            <ul class="dropdown-menu dropdown-menu-custom shadow-sm border-0" :class="{ show: activeDropdown === 'quiz' }">
              <li>
                <router-link class="dropdown-item" to="/quizzes" @click="closeDropdowns">
                  <i class="bi bi-collection me-2"></i> Xem tất cả
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" to="/quizzes/create" @click="closeDropdowns">
                  <i class="bi bi-plus-circle me-2"></i> Tạo mới
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li class="nav-item" v-if="isLoggedIn">
            <button class="btn btn-custom-outline" @click="logout">
              <i class="bi bi-box-arrow-right me-1"></i> Đăng xuất
            </button>
          </li>
          <li class="nav-item" v-else>
            <router-link class="btn btn-custom-primary" to="/login">
              <i class="bi bi-person me-1"></i> Đăng nhập
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isCollapsed = ref(true);
    const activeDropdown = ref(null);
    
    const user = computed(() => store.state.auth?.user || null);
    const isLoggedIn = computed(() => !!user.value);
    
    const toggleNavbar = () => {
      isCollapsed.value = !isCollapsed.value;
    };
    
    const toggleDropdown = (dropdownName) => {
      if (activeDropdown.value === dropdownName) {
        activeDropdown.value = null;
      } else {
        activeDropdown.value = dropdownName;
      }
    };
    
    const closeDropdowns = () => {
      activeDropdown.value = null;
      isCollapsed.value = true;
    };
    
    const handleClickOutside = (event) => {
      if (activeDropdown.value && !event.target.closest('.dropdown')) {
        activeDropdown.value = null;
      }
    };
    
    const logout = async () => {
      try {
        await store.dispatch('auth/logout');
        router.push('/login');
      } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      isCollapsed,
      activeDropdown,
      user,
      isLoggedIn,
      toggleNavbar,
      toggleDropdown,
      closeDropdowns,
      logout
    };
  }
}
</script>

<style scoped>
.navbar-custom {
  background: linear-gradient(135deg, #4776e6, #8e54e9);
  padding: 15px 0;
  transition: all 0.3s ease;
}

.navbar-brand {
  font-weight: 700;
  color: white !important;
}

.brand-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.brand-text {
  font-size: 1.4rem;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-toggler {
  color: white;
  font-size: 1.5rem;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.navbar-toggler:focus {
  box-shadow: none;
  outline: none;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85) !important;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 10px;
  margin: 0 3px;
  transition: all 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.dropdown-menu-custom {
  border-radius: 12px;
  margin-top: 10px;
  background-color: white;
  overflow: hidden;
  animation: dropdown-fade 0.3s ease;
}

@keyframes dropdown-fade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 10px 20px;
  color: #4a5568;
  font-weight: 500;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f8fafc;
  color: #4776e6;
  transform: translateX(5px);
}

.dropdown-divider {
  margin: 0.25rem 0;
  opacity: 0.1;
}

.btn-custom-primary {
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  border: none;
  color: white;
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-custom-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.btn-custom-outline {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-custom-outline:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Responsive styling */
@media (max-width: 992px) {
  .navbar-collapse {
    background: linear-gradient(135deg, #4776e6, #8e54e9);
    border-radius: 12px;
    padding: 15px;
    margin-top: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-menu-custom {
    background: rgba(255, 255, 255, 0.1);
    margin-top: 0;
  }
  
  .dropdown-item {
    color: white;
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
}
</style>