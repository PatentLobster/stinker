import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './assets/tailwind.css'

const vApp = createApp(App).use(store).use(router).mount('#app')
vApp.$store.dispatch('refresh_settings')
