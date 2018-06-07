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
  matchNick(recentSessMap){
    
    let parmas = {
      idList: getMobile(_.values(recentSessMap),'SessionId')      
    }
    let newRecentSessMap;

    if(!parmas.idList || !parmas.idList.length) return;
   
    app.$ajaxPost(urls.GET_AVATAR_NICK_LIST, parmas).then(res => {
      // 当前账户的学生列表存vuex
      console.log(res);
      newRecentSessMap = matchRecent(recentSessMap, res.body);
      
      app.$store.commit('chat/setRecentSessMap', newRecentSessMap);
      // app.$store.state.chat.SessionItem = recentSessMap;
      console.log(newRecentSessMap)

      
    }).catch(error => {
      app.$message.error(error);
    })
  }

}

// 获取电话号码作为参数去获取头像
function getMobile(list,name){
  if(!list || !list.length) return;
  let mobileList = [];
  list.forEach(item => {
    mobileList.push(item[name])
  })
  return mobileList;
}

// 匹配头像
function matchRecent(recentSessMap, list){
  if(!list || !list.length) return;
  for(var j in recentSessMap){   //variable 为属性名
    list.forEach(item => {
      if(recentSessMap[j].SessionId == item.identify){
        recentSessMap[j].nickName = item.nickname;
        recentSessMap[j].SessionImage = item.avatar;
      }
    })
  }

  return recentSessMap;
}