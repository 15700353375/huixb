/**
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: main.js
 */

// 引入相关依赖
import Vue from 'vue';
import Vuex from 'vuex';
import iView from 'iview';
import VueRouter from 'vue-router';
import storeMain from '@Src/store/storeMain';
import routes from '@Src/routers';
import App from '@Src/App';
import Pace from 'pace';
import moment from 'moment';
import _ from 'lodash';
import $ from "jquery";
import Cookies from 'js-cookie'
import registerAxios from '@Util/registerAxios';
import clickOutside from '@Util/clickOutside';
import comUtil from '@Util/comUtil';
import { noTokenUrls } from '@Util/axiosConfig';
import webStorage from '@Util/webStorage';

// im即时通讯
import { webimLogin } from '@Util/chat/login'
import '@Src/directive/comTools'
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(iView);

// 引入Vuex配置文件
const store = new Vuex.Store({
  modules: storeMain,
  plugins: [comUtil.vuexReload]
});

// 引入路由
const router = new VueRouter({
  linkActiveClass: 'red',
  routes
});

const app = new Vue({
  el: '#app',
  store,
  router,
  components:{
    App: App
  },
  template: '<App/>',
});

// 设置全局变量
window.$ = $;
window._ = _;
window.Moment = moment;
window.app = app;
window.Cookies = Cookies;
// 全局提示，再次封装
Vue.prototype.$message={
  error(title, msg) {
    app.$Notice.error({
      title: title,
      desc: msg ? msg : ''
    });
  },
  success(title, msg) {
    app.$Notice.success({
      title: title,
      desc: msg ? msg : ''
    });
  },
  warning(title, msg) {
    app.$Notice.warning({
      title: title,
      desc: msg ? msg : ''
    });
  },
  info(title, msg) {
    app.$Notice.info({
      title: title,
      desc: msg ? msg : ''
    });
  }
}

// 打开路由判断当前页面跳转路由
let token = Cookies.get("hxbToken");
if(!token){
  app.$router.push({name: 'login'})
}else{
  webStorage.getStudentList()
  webStorage.getMenu()
  // app.$router.push({name: 'home'})
}

// 路由跳转之前，检测是否有token
router.beforeEach((to, from, next) => {
  app.$Loading.start();
  let current = {
    parent: to.meta.parents,
    title: to.meta.title
  }
  app.$store.commit('common/setRouteBread', current);
  let routeTags = app.$store.state.common.routeTags

  // 打开的标签页处理  --后期优化
  if(!to.path || to.path == '/'){
    next({name: 'home'});
    return;
  }
  if(!comUtil.queryData(routeTags, to.name)){
    routeTags.push({
      meta: {title: to.meta.title},
      path: to.path, 
      name: to.name
    })
    
    app.$store.commit('common/setRouteTags', routeTags);
  }

  if (noTokenUrls.indexOf(to.path) == -1) {
    // 跳转需要token的路由,检测session是否有token
    let token = Cookies.get("hxbToken");
    if(token){
      next();
      
    }else{
      next({ path: '/login' });
    }
  }else{
    next();
  }
})

router.afterEach((to) => {
  app.$Loading.finish();
})


// 页面刷新后重新登录im
if (Cookies.get('hxbToken')) {
  // 处理刷新之后vuex未清空问题
  // app.$store.state.chat.messageCount = 0;
  
  let loginInfo = JSON.parse(localStorage.getItem('hxb_imLoginInfo'))
  // webimLogin(loginInfo,app);
}