/**
 * 极光推送服务
 * 文档目录： /docs/jpush.md
 * 目前绑定到vue.prototype.jpushService
 * 使用方法调用jpushService.init()
 * router.afterEach里面做了页面刷新登录检测调用_checkLogin()方法
 */

import { webimLogin } from '@Util/chat/login.js'

// let loginInfo = hxb_imLoginInfo.getItem('hxb_imLoginInfo');

let imMessage = {
  jpushLoging: false,
  imLogin: _imLogin,
  // initIm: _init,

}

function _imLogin(){
  let loginInfo = localStorage.getItem('hxb_imLoginInfo');
  loginInfo = JSON.parse(loginInfo)
  
  webimLogin(loginInfo, app)
}
export default imMessage;
