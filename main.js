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
import { noTokenUrls } from '@Util/axiosConfig'

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


// 路由跳转之前，检测是否有token
router.beforeEach((to, from, next) => {
  // debugger
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
      next({ path: '/' });
    }
  }else{
    next();
  }
})
