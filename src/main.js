import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import GoalieLogin from './components/GoalieLogin.vue'
import { store } from './store.js'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)

const routes = [
    { path: '/login', component: GoalieLogin },
    { path: '/b/:id', component: App }
]

const router = new VueRouter({
    routes
})


new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
