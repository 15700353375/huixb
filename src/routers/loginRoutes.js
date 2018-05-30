/**
 * @Author:      cyzeng
 * @DateTime:    2017-06-16 23:11:25
 * @Description: 登录路由
 */

const login = r => require.ensure( [], () => r(require('@Src/view/login/login')), 'login');
const ErrorPage404 = r => require.ensure( [], () => r(require('@Components/ErrorPage/404')), 'ErrorPage404');

export default [
  {
    path: '/',
    name: 'login',
    component: login
  },
  // {
  //   path: '/*',
  //   name: 'error-404',
  //   meta: {title: '404-页面不存在'},
  //   component: ErrorPage404
  // }
]
