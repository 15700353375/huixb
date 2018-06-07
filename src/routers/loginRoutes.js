/**
 * @Author:      changh
 * @DateTime:    2018-05-28
 * @Description: 登录路由
 */

const login = r => require.ensure( [], () => r(require('@Src/view/login/login')), 'login');
const ErrorPage404 = r => require.ensure( [], () => r(require('@Components/ErrorPage/404')), 'ErrorPage404');
const LockingPage = r => require.ensure( [], () => r(require('@Components/lock/LockingPage')), 'LockingPage');

export default [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/locking',
    name: 'locking',
    meta: {title: '锁屏'},
    component: LockingPage
  }
]
