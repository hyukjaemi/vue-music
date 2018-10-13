import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import fastclick from 'fastclick';
import MintUI from 'mint-ui';
import'mint-ui/lib/style.css'
Vue.use(MintUI);
Vue.config.productionTip = false

fastclick.attach(document.body);
import {Swipe,SwipeItem} from "mint-ui";
/* eslint-disable no-new */
Vue.component(Swipe.name,Swipe);
Vue.component(SwipeItem.name,SwipeItem);

import VueResource from "vue-resource";
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;
// axios.defaults.baseURL = '/api';
Vue.prototype.$axios = axios;
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
