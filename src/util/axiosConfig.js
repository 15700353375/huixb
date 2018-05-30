/*
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 请求路径
 */

let base_url = 'http://192.168.0.100:9130/';

if (process.env.NODE_ENV == 'production') {
  // 测试部使用的生产环境，上线时改为发布环境
  base_url = 'http://m.hanlinhx.com:9130/';

}else{
  // 开发环境
  base_url = 'http://192.168.0.100:9130/';
}


export const baseUrl = base_url;

// 所有请求具体url链接
export const urls = {
  BASE_URL: base_url,
  // 登录
  LOGIN: 'login',
  // 学生列表
  GET_STUDENT_LIST: 'user-api/getMsgStudentList',
  // 获取导航菜单
  GET_MENU: 'db-api/menu',

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

