const state = {
  // 学生列表
  studentList: [],
  // 导航菜单
  menu: [],
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


