/* eslint-disable */
import { webim } from './webim'
import store from '../../../store'
import { addMsg, addSess, updateSessDiv, onSelSess } from './chat_index'

// 初始化时，其他对象，选填
let options = {
  'isAccessFormalEnv': true, // 是否访问正式环境，默认访问正式，选填
  'isLogOn': false // 是否开启控制台打印日志,默认开启，选填
}

// 监听连接状态回调变化事件
let onConnNotify = function (resp) {
  console.log('开始监听连接状态')
  let info
  switch (resp.ErrorCode) {
    case webim.CONNECTION_STATUS.ON:
      webim.Log.warn('建立连接成功: ' + resp.ErrorInfo)
      break
    case webim.CONNECTION_STATUS.OFF:
      info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo
      webim.Log.warn(info)
      break
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

// 监听新消息
// newMsgList 为新消息数组，结构为[Msg]
function onMsgNotify (newMsgList) {
  // console.warn(newMsgList);
  let sess, newMsg
  // 获取所有聊天会话
  let sessMap = webim.MsgStore.sessMap()

  console.log('newMsgList')
  console.log(newMsgList)
  store.state.chat.messageCount = store.state.chat.messageCount + 1
  for (let j in newMsgList) { // 遍历新消息
    newMsg = newMsgList[j]
    // if (!store.state.chat.selToID) { // 没有聊天对象
    //   store.state.chat.selToID = newMsg.getSession().id() // 设置当前聊天对象
    //   store.state.chat.selType = newMsg.getSession().type() // 设置当前聊天类型
    //   store.state.chat.selSess = newMsg.getSession() // 设置当前会话
    //   let headUrl
    //   if (store.state.chat.selType === webim.SESSION_TYPE.C2C) { // 如果是私聊使用默认私聊头像
    //     headUrl = store.state.chat.friendHeadUrl
    //   } else { // 如果是私聊使用默认群聊头像
    //     headUrl = store.state.chat.groupHeadUrl
    //   }
    //   // addSess(store.state.chat.selType, store.state.chat.selToID, newMsg.getSession().name(), headUrl, 0, 'sesslist', newMsg) // 新增一个对象
    //   // setSelSessStyleOn(store.state.chat.selToID)
    if (store.state.chat.selToID && newMsg.getSession().id() === store.state.chat.selToID) { // 为当前聊天对象的消息
      // 在聊天窗体中新增一条消息
      // console.warn(newMsg);
      addMsg(newMsg)

      // 消息已读上报，以及设置会话自动已读标记
      webim.setAutoRead(store.state.chat.selSess, true, true)
    } else if (store.state.chat.selToID && newMsg.getSession().id() !== store.state.chat.selToID) {
      let data = store.state.chat.SessionItem
      data.forEach(item => {
        if (item.SessionId === newMsg.getSession().id()) {
          item.UnreadMsgCount = item.UnreadMsgCount + 1
          if (newMsg.elems[0].type === 'TIMTextElem') {
            console.log(newMsg.elems[0].content.text)
            item.MsgShow = newMsg.elems[0].content.text
          } else if (newMsg.elems[0].type === 'TIMFaceElem') {
            item.MsgShow = '[表情]'
          } else if (newMsg.elems[0].type === 'TIMImageElem') {
            item.MsgShow = '[图片]'
          } else if (newMsg.elems[0].type === 'TIMSoundElem') {
            item.MsgShow = '[语音]'
          }
          item.MsgTimeStamp = webim.Tool.formatTimeStamp(newMsg.getTime()).substring(11)
          console.log(newMsg.getTime())
          // item.MsgTimeStamp =
          // item.MsgShow =
        }
      })
      store.state.chat.SessionItem = data
    } else {
      let data = store.state.chat.SessionItem
      data.forEach(item => {
        if (item.SessionId === newMsg.getSession().id()) {
          item.UnreadMsgCount = item.UnreadMsgCount + 1
          if (newMsg.elems[0].type === 'TIMTextElem') {
            console.log(newMsg.elems[0].content.text)
            item.MsgShow = newMsg.elems[0].content.text
          } else if (newMsg.elems[0].type === 'TIMFaceElem') {
            item.MsgShow = '[表情]'
          } else if (newMsg.elems[0].type === 'TIMImageElem') {
            item.MsgShow = '[图片]'
          } else if (newMsg.elems[0].type === 'TIMSoundElem') {
            item.MsgShow = '[语音]'
          }
          item.MsgTimeStamp = webim.Tool.formatTimeStamp(newMsg.getTime()).substring(11)
        }
      })
    }
    // msgList.push(newMsg.elems[0].content.text)
  }

  let saveItem
  let dataSore = store.state.chat.SessionItem
  dataSore.forEach((item, index, object) => {
    if (item.SessionId === newMsg.getSession().id()) {
      saveItem = item
      object.splice(index, 1)
    }
  })
  dataSore.unshift(saveItem)
  store.state.chat.SessionItem = dataSore
  // let data = []
  // for (let j in newMsgList) {
  //   let newMsg = newMsgList[j]
  //   let id = newMsg.getSession().id()
  //   for (let i in store.state.chat.SessionItem) {
  //     if (store.state.chat.SessionItem[i].SessionId === id) {
  //       data.unshift(store.state.chat.SessionItem[i])
  //     } else {
  //       data.push(store.state.chat.SessionItem[i])
  //     }
  //   }
  // }
  // store.state.chat.SessionItem = data
  // 消息已读上报，以及设置会话自动已读标记
  // webim.setAutoRead(store.state.chat.selSess, true, true)

  // for (var i in sessMap) {
  //   sess = sessMap[i]
  //   if (store.state.chat.selToID !== sess.id()) { // 更新其他聊天对象的未读消息数
  //     // if (!dateStart) {
  //     //   dateStart = new Date()
  //     // }
  //     updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread())
  //     console.debug(sess.id(), sess.unread())
  //     // dateEnd = new Date()
  //   }
  // }
}

function onMsgReadedNotify () {}
function onMultipleDeviceKickedOut () {
  webim.Log.error('多终端登录，被T了')
}
// 监听C2C系统消息通道
var onC2cEventNotifys = {
  '92': onMsgReadedNotify, // 消息已读通知,
  '96': onMultipleDeviceKickedOut
}

// 各种监听
let listeners = {
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
}

// 初始化最近联系人列表
var initRecentContactList = function (cbOK, cbErr) {
  console.log('初始化最近联系人列表')
  var options = {
    'Count': store.state.chat.reqRecentSessCount // 要拉取的最近会话条数
  }
  webim.getRecentContactList(
    options,
    function (resp) {
      console.log('初始化最近联系人列表成功')
      let data = [] // 保存最近联系人列表
      let tempSess // 临时会话变量
      let firstSessType // 保存第一个会话类型
      let firstSessId // 保存第一个会话id
      // 清空聊天对象列表
      store.state.chat.SessionItem = []
      if (resp.SessionItem && resp.SessionItem.length > 0) { // 如果存在最近会话记录
        for (var i in resp.SessionItem) {
          var item = resp.SessionItem[i]
          var type = item.Type // 接口返回的会话类型
          var sessType
          let typeZh
          let sessionId
          let sessionNick = ''
          let sessionImage = ''
          let senderId = ''
          let senderNick = ''
          if (type === webim.RECENT_CONTACT_TYPE.C2C) { // 私聊
            typeZh = '私聊'
            sessType = webim.SESSION_TYPE.C2C // 设置会话类型
            sessionId = item.To_Account // 会话id，私聊时为好友ID或者系统账号（值为@TIM#SYSTEM，业务可以自己决定是否需要展示），注意：从To_Account获取,
            if (sessionId === '@TIM#SYSTEM') { // 先过滤系统消息，，
              webim.Log.warn('过滤好友系统消息,sessionId=' + sessionId)
              continue
            }
            let key = sessionId
            let c2cInfo = store.state.chat.studentInfoMap[key]
            if (c2cInfo && c2cInfo.name) { // 从infoMap获取c2c昵称
              sessionNick = c2cInfo.name // 会话昵称，私聊时为好友昵称，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
            } else { // 没有找到或者没有设置过
              sessionNick = sessionId // 会话昵称，如果昵称为空，默认将其设成会话id
            }
            if (c2cInfo && c2cInfo.avatar) { // 从infoMap获取c2c头像
              sessionImage = c2cInfo.avatar // 会话头像，私聊时为好友头像，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
            } else { // 没有找到或者没有设置过
              sessionImage = store.state.chat.friendHeadUrl // 会话头像，如果为空，默认将其设置demo自带的头像
            }
            senderId = senderNick = '' // 私聊时，这些字段用不到，直接设置为空
          } else {
            typeZh = '未知类型'
            sessionId = item.ToAccount
          }
          if (!sessionId) { // 会话id为空
            webim.Log.warn('会话id为空,sessionId=' + sessionId)
            continue
          }

          if (sessionId === '@TLS#NOT_FOUND') { // 会话id不存在，可能是已经被删除了
            webim.Log.warn('会话id不存在,sessionId=' + sessionId)
            continue
          }

          // if (sessionNick.length > maxNameLen) { // 帐号或昵称过长，截取一部分，出于demo需要，业务可以自己决定
          //   sessionNick = sessionNick.substr(0, maxNameLen) + "...";
          // }
          let recentSessMap = store.state.chat.recentSessMap
          tempSess = recentSessMap[sessType + '_' + sessionId]
          if (!tempSess) { // 先判断是否存在（用于去重），不存在增加一个
            if (!firstSessId) {
              firstSessType = sessType // 记录第一个会话类型
              firstSessId = sessionId // 记录第一个会话id
            }
            recentSessMap[sessType + '_' + sessionId] = {
              SessionType: sessType, // 会话类型
              SessionId: sessionId, // 会话对象id，好友id或者群id
              SessionNick: sessionNick, // 会话昵称，好友昵称或群名称
              SessionImage: sessionImage, // 会话头像，好友头像或者群头像
              C2cAccount: senderId, // 发送者id，群聊时，才有用
              C2cNick: senderNick, // 发送者昵称，群聊时，才有用
              UnreadMsgCount: item.UnreadMsgCount, // 未读消息数,私聊时需要通过webim.syncMsgs(initUnreadMsgCount)获取,参考后面的demo，群聊时不需要。
              MsgSeq: item.MsgSeq, // 消息seq
              MsgRandom: item.MsgRandom, // 消息随机数
              MsgTimeStamp: webim.Tool.formatTimeStamp(item.MsgTimeStamp).substring(11), // 消息时间戳
              MsgGroupReadedSeq: item.MsgGroupReadedSeq || 0,
              MsgShow: item.MsgShow // 消息内容,文本消息为原内容，表情消息为[表情],其他类型消息以此类推
            }

            data.push(recentSessMap[sessType + '_' + sessionId])

            // 把列表放进页面
            store.state.chat.recentSessMap = recentSessMap
            store.state.chat.SessionItem = data
          }
        }
        // 清空聊天界面
        store.state.chat.MsgList = []

        webim.syncMsgs(initUnreadMsgCount)
        if (cbOK) { // 回调
          cbOK()
        }
      }
    }, cbErr
  )
}

// 初始化最近会话的消息未读数
function initUnreadMsgCount () {
  var sess
  // var sessMap = webim.MsgStore.sessMap()
  let sessMap = webim.MsgStore.sessMap()
  let a = 0
  for (var i in sessMap) {
    sess = sessMap[i]
    // if (store.state.chat.selToID && store.state.chat.selToID !== sess.SessionId) { // 更新其他聊天对象的未读消息数
    updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread())
    a = a + sess.unread()
    // }
  }
  store.state.chat.messageCount = a
}

function initInfoMapCallbackOK () {
  initRecentContactList(initRecentContactListCallbackOK)
}

// 初始化我的最近会话列表框回调函数
function initRecentContactListCallbackOK () {
  onSelSess(store.state.chat.selType, store.state.chat.selToID)
}

// 初始化用户信息
function initDemoApp () {
  // 初始化我的资料系统消息表格
  // initGetMyProfileSystemMsgs([])
  // 初始化好友和群信息
  console.log('开始初始化好友信息')
  initInfoMap(initInfoMapCallbackOK)
}

function initInfoMap (cbOk) {
  // 读取我的好友列表
  console.log('开始读取好友列表')
  initInfoMapByMyFriends(
    // 读取我的群组列表
    initInfoMapByMyGroups(
      cbOk
    )
  )
}

// 将我的好友资料（昵称和头像）保存在infoMap
// var initInfoMapByMyFriends = function (cbOK, loginInfo) {
var initInfoMapByMyFriends = function (cbOK) {
  console.log('开始获取我的好友资料（昵称和头像）')
  let loginInfo = store.state.chat.loginInfo
  var options = {
    'From_Account': loginInfo.identifier,
    'TimeStamp': 0,
    'StartIndex': 0,
    'GetCount': 200, // 每次接口请求的条数
    'LastStandardSequence': 0,
    'TagList': [
      'Tag_Profile_IM_Nick',
      'Tag_Profile_IM_Image'
    ]
  }

  webim.getAllFriend(
    options,
    function (resp) {
      console.log('获取成功，将我的好友资料（昵称和头像）保存在infoMap')
      if (resp.FriendNum > 0) {
        let friends = resp.InfoItem
        if (!friends || friends.length === 0) {
          if (cbOK) {
            cbOK()
          }
          return
        }
        let count = friends.length
        for (let i = 0; i < count; i++) {
          let friend = friends[i]
          let friend_account = friend.Info_Account
          let friend_name = ''
          let friend_image = ''
          for (let j in friend.SnsProfileItem) {
            switch (friend.SnsProfileItem[j].Tag) {
              case 'Tag_Profile_IM_Nick':
                friend_name = friend.SnsProfileItem[j].Value
                break
              case 'Tag_Profile_IM_Image':
                friend_image = friend.SnsProfileItem[j].Value
                break
            }
          }
          let key = webim.SESSION_TYPE.C2C + '_' + friend_account
          store.state.chat.infoMap[key] = {
            'name': friend_name,
            'image': friend_image
          }
        }
        if (cbOK) {
          cbOK()
        }
      }
    },
    function (err) {
      console.log(err.ErrorInfo)
    }
  )
}

// 将我的群组资料（群名称和群头像）保存在infoMap
var initInfoMapByMyGroups = function (cbOK) {
  console.log('开始获取我的群组资料（群名称和头像）')
  let loginInfo = store.state.chat.loginInfo
  var options = {
    'Member_Account': loginInfo.identifier,
    'Limit': 200, // 每次接口请求的条数
    'Offset': 0,
    'GroupBaseInfoFilter': [
      'Name',
      'FaceUrl'
    ]
  }
  webim.getJoinedGroupListHigh(
    options,
    function (resp) {
      console.log('获取成功，将我的群组资料（群名称和头像）保存在infoMap')
      if (resp.GroupIdList && resp.GroupIdList.length) {
        for (var i = 0; i < resp.GroupIdList.length; i++) {
          var group_name = resp.GroupIdList[i].Name
          var group_image = resp.GroupIdList[i].FaceUrl
          var key = webim.SESSION_TYPE.GROUP + '_' + resp.GroupIdList[i].GroupId
          store.state.chat.infoMap[key] = {
            'name': group_name,
            'image': group_image
          }
        }
      }
      if (cbOK) {
        cbOK()
      }
    },
    function (err) {
      console.log(err.ErrorInfo)
    }
  )
}

// sdk登录
function webimLogin (loginInfo, vm) {
  webim.login(
    loginInfo, listeners, options,
    function (resp) {
      console.log('登录成功')
      store.state.chat.loginInfo = loginInfo
      localStorage.setItem('imloginInfo', JSON.stringify(loginInfo))
      loginInfo.identifierNick = resp.identifierNick // 设置当前用户昵称
      loginInfo.headurl = resp.headurl // 设置当前用户头像
      initDemoApp()
    },
    function (err) {
      vm.$Notice.warning({
        title: '提示',
        desc: '聊天系统登录失败，若想启用，请退出重新登录账户！'
      })
      console.log(err.ErrorInfo)
    }
  )
}

export { webimLogin, initDemoApp }
