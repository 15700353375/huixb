import { webim } from '@Util/chat/js/webim'
import Cookies from 'js-cookie'
import common  from '@Util/chat/common';

let loginInfo, recentSessMap,messageCount;
if (!loginInfo && Cookies.get('hxbToken')) {
  loginInfo = JSON.parse(localStorage.getItem('hxb_imLoginInfo'))
  recentSessMap = {};
  messageCount = 0;
}


const state = {
    loginInfo: loginInfo, // 获取登录信息
    totalCount: 200, //每次接口请求的条数，bootstrap table 分页时用到
    infoMap: {}, // 初始化时，可以先拉取我的好友和我的群组信息,存放c2c或者群信息（c2c用户：c2c用户id，昵称，头像；群：群id，群名称，群头像）
    SessionItem: [], // 最近联系人列表展示
    friendHeadUrl: 'data:image/png;base64,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', // 默认好友头像,用于没有设置过头像的好友
    groupHeadUrl: 'static/img/logo-min.png', // 默认群头像,用于没有设置过头像的群    
    maxNameLen: 16, //最长昵称
    recentSessMap: recentSessMap, // 保存最近会话列表
    selType: webim.SESSION_TYPE.C2C, // 会话类型
    selToID: null, // 当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
    selSess: '', // 当前聊天会话对象
    messageCount: messageCount, // 未读消息数（总）
    MsgList: [], // 最近聊天记录
    reqMsgCount: 15, // 每次请求的历史消息(c2c获取群)条数
    newChat: false, // 是否插入新的聊天对象

    chatModel: false,
    isSend: false, // 是否发送成功
    
    userWith_content: '', // 最近联系人聊天发送内容
    sendPic: false, // 发送图片是否开启
    
    // selToID: '18080497911', // 当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）    
    
    
    
    // friendHeadUrl: '../../assets/images/logo.png', // 默认好友头像,用于没有设置过头像的好友
    
    
    AdminAcount: '', // 管理员账号 ``  
    reqRecentSessCount: 200, // 要拉取的最近会话条数
    emotionFlag: false, // 是否打开过表情选择框
    
    getPrePageC2CHistroyMsgInfoMap: {}, // 保留下一次拉取好友历史消息的信息
    getPrePageGroupHistroyMsgInfoMap: {}, // 保留下一次拉取群历史消息的信息
    studentInfoMap: {}, // 当前登录账户下的学生信息
    studentList: [], // 学生列表
    studentMsgList: [], // 群发消息内容
    student_content: '', // 群发消息内容(正在发送)
    // messageCount: 0, // 未读消息数（总）
    chatList: [], // 各模块发送信息
    type: function () {
      console.log(3)
    }
  }

const getters = {

};



const mutations = {
  setRecentSessMap(state,recentSessMap){
    
    state.recentSessMap = recentSessMap;
    let sessionItem = _.values(recentSessMap);
    app.$store.commit('chat/setSessionItem', sessionItem);
  },
  setSessionItem(state,sessionItem){
    
    state.SessionItem = sessionItem;
  },
  setNewChat(state,newChat){
    
    state.newChat = newChat;
  }
};
export default {
  chat: {
    namespaced: true,
    state,
    getters,
    mutations
  }
}



