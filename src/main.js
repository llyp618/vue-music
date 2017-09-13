import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import '@/common/less/index.less'

/* click 300ms 延迟 */
fastclick.attach(document.body) 

/* eslint-disable no-new */
new Vue({
  el: '#app', 
  router,
  render: h => h(App)
})