import { webim } from './js/webim'
import { initRecentContactList } from './recent_contact_list_manager'
import { onSelSess } from './switch_chat_obj'
import { initDemoApp } from './init_friend'
import { onMsgNotify } from './receive_new_msg'

import { mapState } from 'vuex';



export { webimLogin, turnoffFacesBox, showEmotionDialog}

// 初始化时，其他对象，选填
let options = {
  'isAccessFormalEnv': true, // 是否访问正式环境，默认访问正式，选填
  'isLogOn': true // 是否开启控制台打印日志,默认开启，选填
}

//监听事件
var listeners = {
  "onConnNotify": onConnNotify//监听连接状态回调变化事件,必填
  ,"jsonpCallback": jsonpCallback//IE9(含)以下浏览器用到的 jsonp 回调函数，
  ,"onMsgNotify": onMsgNotify//监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
  // ,"onBigGroupMsgNotify": onBigGroupMsgNotify//监听新消息(直播聊天室)事件，直播场景下必填
  // ,"onGroupSystemNotifys": onGroupSystemNotifys//监听（多终端同步）群系统消息事件，如果不需要监听，可不填
  // ,"onGroupInfoChangeNotify": onGroupInfoChangeNotify//监听群资料变化事件，选填
  // ,"onFriendSystemNotifys": onFriendSystemNotifys//监听好友系统通知事件，选填
  ,"onProfileSystemNotifys": onProfileSystemNotifys//监听资料系统（自己或好友）通知事件，选填
  ,"onKickedEventCall" : onKickedEventCall//被其他登录实例踢下线
  ,"onC2cEventNotifys": onC2cEventNotifys//监听 C2C 系统消息通道
};

// 连接状态回调变化事件
let onConnNotify = function (resp) {
  console.log('开始监听连接状态')
  
  // let store;
  // let info
  // switch (resp.ErrorCode) {
  //   case webim.CONNECTION_STATUS.ON:
  //     webim.Log.warn('建立连接成功: ' + resp.ErrorInfo)
  //     break
  //   case webim.CONNECTION_STATUS.OFF:
  //     info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo
  //     webim.Log.warn(info)
  //     break
  //   case webim.CONNECTION_STATUS.RECONNECT:
  //     info = '连接状态恢复正常: ' + resp.ErrorInfo
  //     webim.Log.warn(info)
  //     break
  //   default:
  //     webim.Log.error('未知连接状态: =' + resp.ErrorInfo)
  //     break
  // }
}

// IE9(含)以下浏览器用到的jsonp回调函数
function jsonpCallback (rspData) {
  webim.setJsonpLastRspData(rspData)
}

// 监听新消息
// onMsgNotify (newMsgList)


// /监听资料系统（自己或好友）通知事件
function onProfileSystemNotifys(){

}

// 监听被踢下线
function onKickedEventCall(){

}

// 监听系统消息
function onC2cEventNotifys(){

}

// let loginInfo = localStorage.getItem('hxb_imLoginInfo');
// if(loginInfo){
//   loginInfo = JSON.parse(loginInfo)
// }
// debugger
//SDK 登录
function webimLogin(loginInfo,app) {
  webim.login(
          loginInfo, listeners, options,
          function (resp) {
              loginInfo.identifierNick = resp.identifierNick;//设置当前用户昵称
              // 设置当前用户头像  此时无头像
              // loginInfo.headurl = resp.headurl
              //登录成功-初始化好友和群组 
              initDemoApp();
          },
          function (err) {
              app.$message.error(err);
              console.log(err);
          }
  );
}

// 表情选择div的关闭方法
function turnoffFacesBox() {
  $('#wl_faces_box').fadeOut('slow')
}

// 表情选择div的打开方法
function showEmotionDialog (vm) {
  //   vm.emotionFlag = true 
  let isShow = $('#wl_faces_box').css('display');
  if(isShow == 'block'){
    $('#wl_faces_box').fadeOut('slow');
    return;
  }
  $("#emotionUL").empty();
  // debugger
  for (var index in webim.Emotions) {
    var emotions = $('<img>').attr({
      'id': webim.Emotions[index][0],
      'src': webim.Emotions[index][1],
      'style': 'cursor:pointer;'
    }).click(function () {
      selectEmotionImg(this,vm)
    })
    $('<li>').append(emotions).appendTo($('#emotionUL'))
  }
  // debugger
  $('#wl_faces_box').css({
    'display': 'block'
  })
}

// 选中表情
var selectEmotionImg = function (selImg,vm) {
  // debugger
  let text = vm.message;
  vm.message = text + selImg.id
}

