import Vue from 'vue';
import VueAnalytics from 'vue-analytics'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue';

Vue.use(ElementUI)
Vue.use(VueAnalytics, {
  id: 'UA-112736828-1'
})

new Vue({
  el: '#app',
  
  
  render: h => h(App)
});
