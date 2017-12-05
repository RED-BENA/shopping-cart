import Vue from 'vue'
import store from './store'
import Shop from './components/Shop.vue'
import axios from 'axios';

Vue.prototype.$axios = axios;
Vue.config.productionTop = false

new Vue({
  store,
  el: '#app',
  render: h => h(Shop)
})
