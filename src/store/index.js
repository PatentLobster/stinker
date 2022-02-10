// import { defineStore } from 'pinia'
// import {readSettings, updateConfig} from "../services/settings";
// // useStore could be anything like useUser, useCart
// // the first argument is a unique id of the store across your application
// // pinia.use(SettingsPlugin)
// export const useStore = defineStore('main', {
//     state: () => {
//       return   {
//             appPath: "",
//             phpPath:"",
//             env:"",
//             args:"",
//             name: "",
//             email: "",
//             gravatar: ""
//             }
//     },
//     actions: {
//         async set_settings() {
//             console.log("s")
//             const settings = await readSettings()
//             this.appPath = settings.appPath
//             this.phpPath = settings.phpPath
//             this.env = settings.env
//             this.args = settings.args
//             this.name = settings.name
//             this.email = settings.email
//             this.gravatar = settings.gravatar
//         }
//     }
// })


// import {createStore} from 'vuex'
//
// export default createStore({
//     state: {
//             appPath: "",
//             phpPath:"",
//             env:"",
//             args:"",
//             name:"",
//             email:"",
//             gravatar:""
//     },
//     mutations: {
//
//     },
//     actions: {
//         async set_settings(context) {
//             const settings = await readSettings();
//             context.state.name = settings.name
//             context.state.email = settings.email
//             context.state.gravatar = settings.gravatar
//             context.state.phpPath = settings.phpPath
//             context.state.appPath = settings.appPath
//             context.state.args = settings.args
//             context.state.env = settings.env
//             return context
//         },
//         async set_setting(context, payload) {
//             await updateConfig(payload.key, payload.value)
//             await context.dispatch("set_settings")
//         }
//     }
//
// })

