import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//install bootstrap first
import 'bootstrap/dist/css/bootstrap.css'
import BootstrapVue from "bootstrap-vue";

// Configure axios defaults
axios.defaults.withCredentials = true
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(BootstrapVue);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
