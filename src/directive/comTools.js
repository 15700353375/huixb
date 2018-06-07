/**
 * @Author: changh
 * @Date: 2018-06-05
 * @Description: 自定义指令集
 */

import Vue from 'vue'




Vue.directive('clickoutside', {
  bind (el, binding, vnode) {
      function documentHandler (e) {
          
          if (el.contains(e.target)) {
              return false;
          }else{
            $('#wl_faces_box').css({
                'display':'none'
              })
          }
          if (binding.expression) {
              binding.value(e);
              
          }
          
      }
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
  },
  unbind (el, binding) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
  }
});
