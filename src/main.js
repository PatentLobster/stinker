import { createApp } from 'vue'
import App from './App.vue'
import "./assets/app.css"
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import {SettingsPlugin} from "./store/settingsPlugin"

// import 'virtual:windi.css';
// import 'virtual:windi-devtools';



// import store from "./store/index";

import Home from "./views/Home.vue"
import Settings from "./views/Settings.vue";
import Interpreter from "./views/Interpreter.vue";
import Snippets from "./views/Snippets.vue";

const routes = [
    {path: "/", component: Home, name: "Home"},
    {path: "/settings", component: Settings, name: "Settings"},
    {path: "/snippets", component: Snippets, name: "Snippets"},
    {path: "/interpreter", component: Interpreter, name: "Interpreter"},
    {path: "/interpreter/:id", component: Interpreter, name: ""}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)

app.use(router)



const pinia = createPinia()
app.use(pinia)

pinia.use(SettingsPlugin)

app.mount('#app')
