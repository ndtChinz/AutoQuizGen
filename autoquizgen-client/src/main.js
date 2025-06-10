import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import Bootstrap bundle từ CDN
const bootstrapScript = document.createElement('script')
bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
document.head.appendChild(bootstrapScript)

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')