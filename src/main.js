import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'
import './registerServiceWorker'
// import { store } from './store.js'

Vue.config.productionTip = false
Vue.use(VueFire)

new Vue({
  // store,
  render: h => h(App)
}).$mount('#app')
