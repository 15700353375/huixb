/* eslint-disable */
import { webim } from './webim'
import store from '../../../store'

// 在聊天框添加一条消息
function addMsg (msg) {
  console.log('往聊天框增加一条消息')
  let isSelfSend = msg.getIsSend()// 消息是否为自己发的
  let fromAccount = msg.getFromAccount()// 消息发送者ID
  let fromAccountNick
  let fromAccountImage

  // isSelfSend = msg.getIsSend()// 消息是否为自己发的
  // fromAccount = msg.getFromAccount()// 消息发送者ID

  if (isSelfSend) { // 如果是自己发的消息
    // 自己的称呼，没有则是id
    if (store.state.chat.loginInfo.identifierNick) {
      fromAccountNick = store.state.chat.loginInfo.identifierNick
    } else {
      fromAccountNick = fromAccount
    }
    // 获取自己的头像，没有则使用默认头像
    if (store.state.user.userActUrl) {
      fromAccountImage = store.state.user.userActUrl
    } else {
      fromAccountImage = store.state.chat.friendHeadUrl
    }
  } else { // 如果是对方发的消息
    let key = fromAccount
    let info = store.state.chat.studentInfoMap[key] // 获取发送者信息
    // 获取称呼
    if (info && info.name) { // 如果信息存在，并且有称呼
      fromAccountNick = info.name
    } else if (msg.getFromAccountNick()) { // 如果信息不存在或没有称呼，则从im调取
      fromAccountNick = msg.getFromAccountNick()
    } else { // 如果im也没有，则使用id
      fromAccountNick = fromAccount
    }
    // 获取头像
    if (info && info.avatar) {
      fromAccountImage = info.avatar
    } else if (msg.fromAccountHeadurl) {
      fromAccountImage = msg.fromAccountHeadurl
    } else { // 如果信息中没有，并且im中也没有，则使用默认头像
      fromAccountImage = store.state.chat.friendHeadUrl
    }
  }

  let a = ''
  a = document.getElementById('message-info').scrollTop

  msg.fromAccountNick = fromAccountNick
  msg.fromAccountImage = fromAccountImage

  // 调整时间格式
  msg.time = webim.Tool.formatTimeStamp(msg.time)

  // 解析消息
  msg.COMMON = convertMsgtoHtml(msg)
  // 把消息调加到消息消息列表
  console.log(msg)
  store.state.chat.MsgList.push(msg)
  for (let i in store.state.chat.SessionItem) {
    if (store.state.chat.SessionItem[i].SessionId === msg.fromAccount) {
      store.state.chat.SessionItem[i].MsgShow = msg.COMMON
      store.state.chat.SessionItem[i].MsgTimeStamp = msg.time.substring(11)
    }
  }
}

// 把消息转换成Html
function convertMsgtoHtml (msg) {
  var html = ''
  var elems
  var elem
  var type
  var content
  let eleHtml
  elems = msg.getElems() // 获取消息包含的元素数组
  var count = elems.length
  for (var i = 0; i < count; i++) {
    elem = elems[i]
    type = elem.getType() // 获取元素类型
    content = elem.getContent() // 获取元素对象
    switch (type) {
      case webim.MSG_ELEMENT_TYPE.TEXT: // 解析文本消息
        eleHtml = convertTextMsgToHtml(content)
        // 转义，防XSS
        html += webim.Tool.formatText2Html(eleHtml)
        break
      case webim.MSG_ELEMENT_TYPE.FACE: // 解析表情消息
        html += convertFaceMsgToHtml(content)
        break
      case webim.MSG_ELEMENT_TYPE.IMAGE: // 解析图片消息
        if (i <= count - 2) {
          var customMsgElem = elems[i + 1] // 获取保存图片名称的自定义消息elem
          var imgName = customMsgElem.getContent().getData() // 业务可以自定义保存字段，demo中采用data字段保存图片文件名
          html += convertImageMsgToHtml(content, imgName)
          i++ // 下标向后移一位
        } else {
          html += convertImageMsgToHtml(content)
        }
        break
      case webim.MSG_ELEMENT_TYPE.SOUND: // 解析语音消息
        html += convertSoundMsgToHtml(content)
        break
      case webim.MSG_ELEMENT_TYPE.CUSTOM: // 解析自定义消息
        eleHtml = convertCustomMsgToHtml(content)
        // 转义，防XSS
        html += webim.Tool.formatText2Html(eleHtml)
        break
      default:
        webim.Log.error('未知消息元素类型: elemType=' + type)
        break
    }
  }
  return html
}

// 解析文本消息元素
function convertTextMsgToHtml (content) {
  return content.getText()
}
// 解析表情消息元素
function convertFaceMsgToHtml (content) {
  var faceUrl = null
  var data = content.getData()
  var index = webim.EmotionDataIndexs[data]
  var emotion = webim.Emotions[index]
  if (emotion && emotion[1]) {
    faceUrl = emotion[1]
  }
  if (faceUrl) {
    return "<img src='" + faceUrl + "'/>"
  } else {
    return data
  }
}

// 解析图片消息元素
function convertImageMsgToHtml (content, imageName) {
  var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL) // 小图
  var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE) // 大图
  var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN) // 原图
  if (!bigImage) {
    bigImage = smallImage
  }
  if (!oriImage) {
    oriImage = smallImage
  }
  return "<img name='" + imageName + "' src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() +
         "' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "' onclick='imageClick(this)' />"
}

// 解析语音消息元素
function convertSoundMsgToHtml (content) {
  // var second = content.getSecond() // 获取语音时长
  var downUrl = content.getDownUrl()
  if (webim.BROWSER_INFO.type === 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
    return '[这是一条语音消息]暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl
  }
  return '<audio id="uuid_' + content.uuid + '" src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>'
}

// 解析自定义消息元素
function convertCustomMsgToHtml (content) {
  var data = content.getData() // 自定义数据
  var desc = content.getDesc() // 描述信息
  var ext = content.getExt() // 扩展信息
  return 'data=' + data + ', desc=' + desc + ', ext=' + ext
}

// 在最近联系人中搜索，若已存在，则执行点击事件，若不存在，则在顶部添加一条，并执行点击事件
function addSess (sessType, toId, name, faceUrl, unreadMsgCount, sesslist, addPositonType, newMsg) {
  let isOn = true // 联系人中是否已存在 true代表不存在， false代表存在
  store.state.chat.SessionItem.forEach(item => {
    if (item.SessionId === toId) {
      document.getElementById(item.SessionId).click()
      isOn = false
    }
  })
  if (isOn) {
    store.state.chat.SessionItem.unshift(newMsg)
    addSess(sessType, toId, name, faceUrl, unreadMsgCount, sesslist, addPositonType, newMsg)
  }
}

// 更新最近会话的未读消息数
function updateSessDiv (sessType, toId, name, unreadMsgCount) {
  let isOn = true // 联系人中是否已存在, true代表不存在， false代表存在
  store.state.chat.SessionItem.forEach(item => {
    if (item.SessionId === toId) {
      item.UnreadMsgCount = unreadMsgCount
      isOn = false
    }
  })
  if (isOn) {
    // 获取最近联系人
  }
  let a = 0
  for (let i in store.state.chat.SessionItem) {
    a = store.state.chat.SessionItem[i].UnreadMsgCount + a
  }
  store.state.chat.messageCount = a
}

// 切换好友或群组聊天对象
function onSelSess (sessType, toId) {
  if (toId !== null) {
    console.log('开始切换聊天对象')
    // 将之前选中用户的样式置为未选中样式
    // setSelSessStyleOff(selToID)

    // 设置之前会话的已读消息标记
    if (sessType) {
      webim.setAutoRead(store.state.chat.selSess, false, false)
    }

    // 清空聊天界面
    store.state.chat.MsgList = []

    store.state.chat.selToID = toId

    // 设置当前选中用户的样式为选中样式
    // setSelSessStyleOn(toId)

    if (store.state.chat.selType === webim.SESSION_TYPE.GROUP) {
      store.state.chat.selType = webim.SESSION_TYPE.C2C
    }

    // 拉取漫游消息
    getLastC2CHistoryMsgs(function (msgList) {
      getHistoryMsgCallback(msgList)
    }, function (err) {
      console.log(err.ErrorInfo)
    })
  }
}

// 获取最新的c2c历史消息,用于切换好友聊天，重新拉取好友的聊天消息
var getLastC2CHistoryMsgs = function (cbOk, cbError) {
  console.log('开始聊天对象的最近聊天近路')
  if (store.state.chat.selType === webim.SESSION_TYPE.GROUP) {
    console.log('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作')
    return
  }
  if (!store.state.chat.selToID || store.state.chat.selToID === '@TIM#SYSTEM') {
    console.log('当前的聊天id非法，selToID=' + store.state.chat.selToID)
    return
  }
  var lastMsgTime = 0 // 第一次拉取好友历史消息时，必须传0
  var msgKey = ''
  var options = {
    'Peer_Account': store.state.chat.selToID, // 好友帐号
    'MaxCnt': store.state.chat.reqMsgCount, // 拉取消息条数
    'LastMsgTime': lastMsgTime, // 最近的消息时间，即从这个时间点向前拉取历史消息
    'MsgKey': msgKey
  }
  store.state.chat.selSess = null
  webim.MsgStore.delSessByTypeId(store.state.chat.selType, store.state.chat.selToID)

  webim.getC2CHistoryMsgs(
    options,
    function (resp) {
      // let complete = resp.Complete // 是否还有历史消息可以拉取，1-表示没有，0-表示有

      console.log('成功获取聊天对象的最近聊天近路')
      if (resp.MsgList.length === 0) {
        webim.Log.warn('没有历史消息了:data=' + JSON.stringify(options))
        return
      }
      // getPrePageC2CHistroyMsgInfoMap[selToID] = { // 保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
      //   'LastMsgTime': resp.LastMsgTime,
      //   'MsgKey': resp.MsgKey
      // }
      // 清空聊天界面
      store.state.chat.MsgList = []
      if (cbOk) {
        cbOk(resp.MsgList)
      }
    },
    cbError
  )
}

// 获取历史消息(c2c或者group)成功回调函数
// msgList 为消息数组，结构为[Msg]
function getHistoryMsgCallback (msgList, prepage) {
  console.log('把聊天记录放进聊天框')
  let msg
  // prepage = prepage || false

  // 如果是加载前几页的消息，消息体需要prepend，所以先倒排一下
  // if (prepage) {
  //   msgList.reverse()
  // }
  for (var j in msgList) { // 遍历新消息
    msg = msgList[j]
    // if (msg.getSession().id() === store.state.chat.selToID) { // 为当前聊天对象的消息
    store.state.chat.selSess = msg.getSession()
    // 在聊天窗体中新增一条消息
    addMsg(msg, prepage)
    let a = parseInt(j) + 1
    if (a === msgList.length) {
      updataleft(msg)
    }
    // }
  }
  // 消息已读上报，并将当前会话的消息设置成自动已读
  webim.setAutoRead(store.state.chat.selSess, true, true)
}

// 发送消息(文本或者表情)
function onSendMsg (msgContent, vm) {
  console.log('获取到消息内容')
  if (!store.state.chat.selToID) {
    vm.$Notice.info({
      title: '提示',
      desc: '你还没有选中好友或者群组，暂不能聊天'
    })
    return
  }
  // 获取消息内容
  var msgLen = webim.Tool.getStrBytes(msgContent)

  if (msgContent.length < 1) {
    vm.$Notice.info({
      title: '提示',
      desc: '发送的消息不能为空'
    })
    return
  }
  var maxLen, errInfo
  if (store.state.chat.selType === webim.SESSION_TYPE.C2C) {
    maxLen = webim.MSG_MAX_LENGTH.C2C
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)'
  } else {
    maxLen = webim.MSG_MAX_LENGTH.GROUP
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)'
  }
  if (msgLen > maxLen) {
    console.log(errInfo)
    return
  }
  // 发消息处理
  handleMsgSend(msgContent, vm)
}

function handleMsgSend (msgContent, vm) {
  console.log('处理消息')
  let selSess
  if (!store.state.chat.selSess) {
    selSess = new webim.Session(store.state.chat.selType, store.state.chat.selToID, store.state.chat.selToID, store.state.chat.friendHeadUrl, Math.round(new Date().getTime() / 1000))
  } else {
    selSess = store.state.chat.selSess
  }
  let isSend = true // 是否为自己发送
  let seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
  let random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
  let msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
  let subType // 消息子类型
  if (store.state.chat.selType === webim.SESSION_TYPE.C2C) {
    subType = webim.C2C_MSG_SUB_TYPE.COMMON
  } else {
    // webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    // webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    // webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    // webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON
  }
  let msg = new webim.Msg(selSess, isSend, seq, random, msgTime, store.state.chat.loginInfo.identifier, subType, store.state.chat.loginInfo.identifierNick)

  let textObj, faceObj, tmsg, emotionIndex, emotion, restMsgIndex
  // 解析文本和表情
  let expr = /\[[^[\]]{1,3}\]/mg
  let emotions = msgContent.match(expr)
  if (!emotions || emotions.length < 1) {
    textObj = new webim.Msg.Elem.Text(msgContent)
    msg.addText(textObj)
  } else {
    for (let i = 0; i < emotions.length; i++) {
      tmsg = msgContent.substring(0, msgContent.indexOf(emotions[i]))
      if (tmsg) {
        textObj = new webim.Msg.Elem.Text(tmsg)
        msg.addText(textObj)
      }
      emotionIndex = webim.EmotionDataIndexs[emotions[i]]
      emotion = webim.Emotions[emotionIndex]

      if (emotion) {
        faceObj = new webim.Msg.Elem.Face(emotionIndex, emotions[i])
        msg.addFace(faceObj)
      } else {
        textObj = new webim.Msg.Elem.Text(emotions[i])
        msg.addText(textObj)
      }
      restMsgIndex = msgContent.indexOf(emotions[i]) + emotions[i].length
      msgContent = msgContent.substring(restMsgIndex)
    }
    if (msgContent) {
      textObj = new webim.Msg.Elem.Text(msgContent)
      msg.addText(textObj)
    }
  }

  msg.PushInfo = {
    'PushFlag': 0,
    'Desc': '测试离线推送内容', // 离线推送内容
    'Ext': '测试离线推送透传内容', // 离线推送透传内容
    'AndroidInfo': {
      'Sound': 'android.mp3' // 离线推送声音文件路径。
    },
    'ApnsInfo': {
      'Sound': 'apns.mp3', // 离线推送声音文件路径。
      'BadgeMode': 1
    }
  }

  msg.PushInfoBoolean = true // 是否开启离线推送push同步
  msg.sending = 1
  msg.originContent = msgContent
  turnoffFacesBox()

  console.log('开始发送')
  webim.sendMsg(msg, function (resp) {
    console.log('发送成功')
    // 发送成功，更新到左边列表
    updataleft(msg)
    // 发送成功，把sending清理
    addMsg(msg)
    store.state.chat.userWith_content = ''
  }, function (err) {
    // 提示重发
    if (err.ErrorCode === 20003) {
      vm.$Notice.warning({
        title: '警告',
        desc: '该生暂未导入聊天系统，请联系管理员'
      })
      return
    }
    if (err.ErrorCode === 20004) {
      vm.$Notice.warning({
        title: '异常',
        desc: '网络异常，请重试！'
      })
      return
    }
    if (err.ErrorCode === 20005) {
      vm.$Notice.warning({
        title: '异常',
        desc: '服务器异常，请重试！'
      })
      return
    }
    vm.$Notice.warning({
      title: '警告',
      desc: '发送失败，请重试！'
    })
  })
}

function updataleft (msg) {
  let data = store.state.chat.SessionItem
  let sess = msg.sess
  data.forEach(item => {
    if (item.SessionId === sess.id()) {
      if (msg.elems.length > 1) {
        item.MsgShow = ''
        for (let i in msg.elems) {
          if (msg.elems[i].type === 'TIMTextElem') {
            item.MsgShow = item.MsgShow + msg.elems[i].content.text
          } else if (msg.elems[i].type === 'TIMFaceElem') {
            item.MsgShow = item.MsgShow + '[表情]'
          }
        }
      } else {
        if (msg.elems[0].type === 'TIMTextElem') {
          item.MsgShow = msg.elems[0].content.text
        } else if (msg.elems[0].type === 'TIMFaceElem') {
          item.MsgShow = '[表情]'
        } else if (msg.elems[0].type === 'TIMImageElem') {
          item.MsgShow = '[图片]'
        } else if (msg.elems[0].type === 'TIMSoundElem') {
          item.MsgShow = '[语音]'
        }
      }
      if (isNaN(msg.time)) {
        item.MsgTimeStamp = msg.time.substring(11)
      } else {
        item.MsgTimeStamp = webim.Tool.formatTimeStamp(msg.getTime()).substring(11)
      }
    }
  })
}

// 表情选择div的打开方法
function showEmotionDialog () {
  // let Emotions1 = webim.Emotions
  // let Emotions = []
  // console.log('Emotions')
  // console.log(Emotions1)

  // for (let index in Emotions1) {
  //   console.log(Emotions1[index])
  //   Emotions[index] = Emotions1[index]
  // }
  // store.state.chat.Emotions = Emotions
  if (store.state.chat.emotionFlag) {
    $('#wl_faces_box').css({
      'display': 'block'
    })
    return
  }
  store.state.chat.emotionFlag = true

  for (var index in webim.Emotions) {
    var emotions = $('<img>').attr({
      'id': webim.Emotions[index][0],
      'src': webim.Emotions[index][1],
      'style': 'cursor:pointer;'
    }).click(function () {
      selectEmotionImg(this)
    })
    $('<li>').append(emotions).appendTo($('#emotionUL'))
  }
  $('#wl_faces_box').css({
    'display': 'block'
  })
}

// 表情选择div的关闭方法
var turnoffFacesBox = function () {
  $('#wl_faces_box').fadeOut('slow')
}

// 选中表情
var selectEmotionImg = function (selImg) {
  var txt = store.state.chat.userWith_content
  store.state.chat.userWith_content = txt + selImg.id
}

// 群发信息
function sendGround (msgContent, toIdList) {

  toIdList.forEach(item => {
    handleMsgSendGround(msgContent, item)
  })

  addMsgGround(msgContent)
}

function handleMsgSendGround (msgContent, toId) {
  console.log('处理群发消息')
  let selSess
  let qf = ''
  // if (!store.state.chat.selSess) {
  selSess = new webim.Session(store.state.chat.selType, toId, toId, qf, Math.round(new Date().getTime() / 1000))
  // } else {
  // selSess = store.state.chat.selSess
  // }
  let isSend = true // 是否为自己发送
  let seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
  let random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
  let msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
  let subType // 消息子类型
  if (store.state.chat.selType === webim.SESSION_TYPE.C2C) {
    subType = webim.C2C_MSG_SUB_TYPE.COMMON
  } else {
    // webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    // webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    // webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    // webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON
  }
  let msg = new webim.Msg(selSess, isSend, seq, random, msgTime, store.state.chat.loginInfo.identifier, subType, store.state.chat.loginInfo.identifierNick)

  let textObj, faceObj, tmsg, emotionIndex, emotion, restMsgIndex
  // 解析文本和表情
  let expr = /\[[^[\]]{1,3}\]/mg
  let emotions = msgContent.match(expr)
  if (!emotions || emotions.length < 1) {
    textObj = new webim.Msg.Elem.Text(msgContent)
    msg.addText(textObj)
  } else {
    for (let i = 0; i < emotions.length; i++) {
      tmsg = msgContent.substring(0, msgContent.indexOf(emotions[i]))
      if (tmsg) {
        textObj = new webim.Msg.Elem.Text(tmsg)
        msg.addText(textObj)
      }
      emotionIndex = webim.EmotionDataIndexs[emotions[i]]
      emotion = webim.Emotions[emotionIndex]

      if (emotion) {
        faceObj = new webim.Msg.Elem.Face(emotionIndex, emotions[i])
        msg.addFace(faceObj)
      } else {
        textObj = new webim.Msg.Elem.Text(emotions[i])
        msg.addText(textObj)
      }
      restMsgIndex = msgContent.indexOf(emotions[i]) + emotions[i].length
      msgContent = msgContent.substring(restMsgIndex)
    }
    if (msgContent) {
      textObj = new webim.Msg.Elem.Text(msgContent)
      msg.addText(textObj)
    }
  }

  msg.PushInfo = {
    'PushFlag': 0,
    'Desc': '测试离线推送内容', // 离线推送内容
    'Ext': '测试离线推送透传内容', // 离线推送透传内容
    'AndroidInfo': {
      'Sound': 'android.mp3' // 离线推送声音文件路径。
    },
    'ApnsInfo': {
      'Sound': 'apns.mp3', // 离线推送声音文件路径。
      'BadgeMode': 1
    }
  }

  msg.PushInfoBoolean = true // 是否开启离线推送push同步
  msg.sending = 1
  msg.originContent = msgContent
  turnoffFacesBox()

  console.log('开始发送')
  webim.sendMsg(msg, function (resp) {
    console.log('发送群发成功')
    // 发送成功，把sending清理
    // addMsg(msg)
    if (store.state.chat.selToID === msg.sess.id()) {
      addMsg(msg)
    }
    updataleft(msg)
    store.state.chat.userWith_content = ''
  }, function (err) {
    console.log(err.ErrorInfo)
    // 提示重发
    handleMsgSend(msgContent)
  })
}

function addMsgGround (msgContent) {
  let fromAccountImage
  let time

  // 获取自己的头像，没有则使用默认头像
  if (store.state.chat.loginInfo.headurl) {
    fromAccountImage = store.state.chat.loginInfo.headurl
  } else {
    fromAccountImage = store.state.chat.friendHeadUrl
  }

  time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
  // time = webim.Tool.formatTimeStamp(new Date().getTime())

  store.state.chat.studentMsgList.push({
    fromAccountImage: fromAccountImage,
    time: time,
    msg: msgContent
  })

  store.state.chat.student_content = ''
}

// 获取最近联系人
function getRecentContactList (cbOK, cbErr) {
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
      // store.state.chat.recentSessMap = []
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
          // if (!tempSess) { // 先判断是否存在（用于去重），不存在增加一个
          //   if (!firstSessId) {
          //     firstSessType = sessType // 记录第一个会话类型
          //     firstSessId = sessionId // 记录第一个会话id
          //   }
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
          // window.setTimeout(function () {
          //   document.getElementById('userwith').getElementsByTagName('li')[0].click()
          // }, 1000)
          // }
        }
        // 清空聊天界面
        // store.state.chat.MsgList = []
        webim.syncMsgs(initUnreadMsgCount)
        if (cbOK) { // 回调
          cbOK()
        }
      }
    }, function (reg) {
      console.log(reg)
    }
  )
}

// 初始化最近会话的消息未读数
function initUnreadMsgCount (reg) {
  console.log(reg)
  var sess
  // var sessMap = webim.MsgStore.sessMap()
  let sessMap = webim.MsgStore.sessMap()
  for (var i in sessMap) {
    sess = sessMap[i]
    // if (store.state.chat.selToID && store.state.chat.selToID !== sess.SessionId) { // 更新其他聊天对象的未读消息数
    updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread())
    // }
  }
}

function getTochatInfo (mobile) {
  let options = {
    'To_Account': [mobile],
    'TagList': [
      "Tag_Profile_IM_Nick", // 昵称
      "Tag_Profile_IM_Image" // 头像
    ]
  }
  webim.getProfilePortrait(
    options,
    function (resp) {
      console.log(resp)
    },
    function (err) {
      console.log(err.ErrorInfo)
    }
  )
}

export { addMsg, addSess, updateSessDiv, onSelSess, onSendMsg, showEmotionDialog, turnoffFacesBox, sendGround, getRecentContactList, getTochatInfo }
