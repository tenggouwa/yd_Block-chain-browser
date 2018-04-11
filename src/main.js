// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import ElementUI from 'element-ui'
import 	'element-ui/lib/theme-chalk/index.css' 
import "babel-polyfill";

import 'mint-ui/lib/style.css';
Vue.use(Mint);
Vue.use(ElementUI);
Vue.config.productionTip = false;
// 注册全局过滤器
import filters from './assets/js/filters.js';
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
