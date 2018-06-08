/*
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 聊天-公共方法
 */
import {urls} from '@Util/axiosConfig';
import comUtil from '@Util/comUtil';
import { mapState } from 'vuex';
export default {


// 匹配最近联系人的昵称头像
getStudentList(){
    
  app.$ajaxPost(urls.GET_STUDENT_LIST).then(res => {
    if(res){
      // 当前账户的学生列表存vuex
      app.$store.commit('common/setStudentList', res.body);
      if(res.body && res.body.length){
        localStorage.setItem('hxb_studentList', JSON.stringify(res.body))
      }      
    }
    
  })
},

// 获取左侧导航菜单
getMenu() {
  app.$ajaxPost(urls.GET_MENU).then(res => {
    if(res){
      app.$store.commit('common/setMenu', res.body);
      if(res.body && res.body.length){
        localStorage.setItem('hxb_menu',JSON.stringify(res.body))
      }
    }
  })
},



}

