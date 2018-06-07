/*
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 请求路径
 */

let base_url = 'http://192.168.0.99:9130/';

if (process.env.NODE_ENV == 'production') {
  // 测试部使用的生产环境，上线时改为发布环境
  base_url = 'http://m.hanlinhx.com:9130/';

}else{
  // 开发环境
  base_url = 'http://192.168.0.99:9130/';
}


export const baseUrl = base_url;

// 所有请求具体url链接
export const urls = {
  BASE_URL: base_url,
  // 登录
  LOGIN: 'login',
  // 退出
  EXIT: 'logout',
  // 学生列表
  GET_STUDENT_LIST: 'user-api/getMsgStudentList',
  // 获取头像昵称
  GET_AVATAR_NICK_LIST: 'user-api/getUserAvatarAndNickName',
  // 获取导航菜单
  GET_MENU: 'user-api/getUserMenu',
  // 发送通知消息
  MSENDMESSAGE: 'user-api/MSendMessage',

  // 获取招生批次
  MANAGERRECRUIT: 'user-api/managerRecruit',

  // 获取报名信息
  GETEXTBYCONDITION: 'user-api/getExtByCondition',

  // 获取站点信息
  GETSITELIST: 'user-api/getSiteList',

  // 消息群发
  MSENDMESSAGE: '/user-api/MSendMessage',

  // 获取群发消息记录
  GETMSGLOG: 'user-api/getMsgLog',

  // 获取机构列表
  GETALLSCHOOLLIST: 'user-api/getAllSchoolList',
  
  // 获取班主任与招生人员
  GETCONDITIONLIST: 'user-api/getConditionList',

  // 获取站点
  GETSITELIST: 'user-api/getSiteList',

  // 获取专业、课程
  GETMAJORNAMEBYTYPE: 'user-api/getMajorNameByType',

  // 获取批次号
  GETBATCHLIST: 'user-api/getBatchList',

  // 支付
  GETPAYMONEY: 'user-api/getPayMoney',

  // 查询支付状态
  GETORDERSTATUS: 'user-api/getOrderStatus',

  // 转班
  UPDATETEACHERID: 'user-api/updateTeacherID',

  
  
  

};

// 不需要token的请求
export const noTokenReq = [
  'login'
];

// 不需要token的路由
export const noTokenUrls = [
  '/',
  '/login',
];

