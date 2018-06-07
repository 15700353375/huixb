import Cookies from 'js-cookie'

let token = Cookies.get("hxbToken");
if(token){
  var hxb_studentList = [];
  var _hxb_studentList = localStorage.getItem('hxb_studentList');
  
  if(_hxb_studentList && _hxb_studentList.length){
    hxb_studentList = JSON.parse(_hxb_studentList)
  }
  
  var hxb_menu = localStorage.getItem('hxb_menu');
  if(hxb_menu && hxb_menu.length){
    hxb_menu = JSON.parse(hxb_menu)
  }
}

const state = {
  // 学生列表
  studentList: hxb_studentList,
  // 导航菜单
  menu: hxb_menu,
  // 是否显示小导航菜单
  littleNav: false,
  // 顶部路由面包屑
  routeBread: {},

  flages: false,

  // 顶部浏览页
  routeTags: [
    {
      meta: {title: '首页'},
      path: '/home', 
      name: 'home'
    }
  ],

  
};

const getters = {
  routeTags: state => {    
    return state.routeTags
  },
};


const mutations = {
  // 设置学生列表
  setStudentList(state,studentList) {
    // debugger
    // localStorage.setItem('studentList',studentList)
    state.studentList = studentList;
  },
  // 设置导航菜单
  setMenu(state, menu){
    state.menu = menu;
  },
  // 改变导航
  setLittleNav(state, littleNav){
    state.littleNav = littleNav;
  },
  // 改变顶部路由面包屑
  setRouteBread(state, routeBread){
    state.routeBread = routeBread;
  },
  setRouteTags(state, routeTags){
    state.routeTags = routeTags;
  },
};


export default {
  common: {
    namespaced: true,
    state,
    getters,
    mutations
  }
}


