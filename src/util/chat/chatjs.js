import { webim } from './js/webim'
import { onMsgNotify, onMsgReadedNotify } from './chatjs/msg/receive_new_msg'
import { onMultipleDeviceKickedOut } from './chatjs/logout/logout'

// 监听连接状态回调变化事件
var onConnNotify = function (resp) {
  var info
  switch (resp.ErrorCode) {
    case webim.CONNECTION_STATUS.ON:
      webim.Log.warn('建立连接成功: ' + resp.ErrorInfo)
      break
    case webim.CONNECTION_STATUS.OFF:
      info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo
      webim.Log.warn(info)
      break;
    case webim.CONNECTION_STATUS.RECONNECT:
      info = '连接状态恢复正常: ' + resp.ErrorInfo
      webim.Log.warn(info)
      break
    default:
      webim.Log.error('未知连接状态: =' + resp.ErrorInfo)
      break
  }
}

// IE9(含)以下浏览器用到的jsonp回调函数
function jsonpCallback (rspData) {
  webim.setJsonpLastRspData(rspData)
}

var onC2cEventNotifys = {
  '92': onMsgReadedNotify, // 消息已读通知,
  '96': onMultipleDeviceKickedOut
}

const chat = {
  loginInfo: JSON.parse(localStorage.getItem('imloginInfo')),
  // 监听事件
  listeners: {
    'onConnNotify': onConnNotify, // 监听连接状态回调变化事件,必填
    'jsonpCallback': jsonpCallback, // IE9(含)以下浏览器用到的jsonp回调函数，
    'onMsgNotify': onMsgNotify, // 监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    // 'onBigGroupMsgNotify': onBigGroupMsgNotify, // 监听新消息(直播聊天室)事件，直播场景下必填
    // 'onGroupSystemNotifys': onGroupSystemNotifys, // 监听（多终端同步）群系统消息事件，如果不需要监听，可不填
    // 'onGroupInfoChangeNotify': onGroupInfoChangeNotify, // 监听群资料变化事件，选填
    // 'onFriendSystemNotifys': onFriendSystemNotifys, // 监听好友系统通知事件，选填
    // 'onProfileSystemNotifys': onProfileSystemNotifys, // 监听资料系统（自己或好友）通知事件，选填
    // 'onKickedEventCall': onKickedEventCall, // 被其他登录实例踢下线
    'onC2cEventNotifys': onC2cEventNotifys // 监听C2C系统消息通道
  },
  options: {
    // 是否访问正式环境下的后台接口，True-访问正式，False-访问测试环境默认访问正式环境接口，选填
    isAccessFormalEnv: true,
    // 是否开启控制台打印日志,True-开启;False-关闭，默认开启，选填
    isLogOn: true
  }
 }

export default chat
