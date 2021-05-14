import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './assets/tailwind.css'

const vApp = createApp(App).use(store).use(router).mount('#app')

// vApp.mount('#app')
vApp.$store.commit('refreshSettings')

// (async () => {

    // try {
    //     Vue.config.productionTip = false
    //     Vue.use(router)
    //     Vue.use(store)
    //     const app = new Vue({
    //         render: h => h(App),
    //         store,
    //         router
    //     })
    //     await
        //
        // app.$store.dispatch('refreshSettings')
        // app.$mount('#app')
    // } catch (err) {
//         throw err
//     }
// })