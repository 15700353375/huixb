import Cookies from 'js-cookie'
let userInfo
if (!userInfo && Cookies.get('hxbToken')) {
  userInfo = JSON.parse(localStorage.getItem('hxb_userInfo'))
}



const state = {
  // 登录用户信息
  userInfo: userInfo
};

const getters = {};


const mutations = {
  setUserInfo (state,userInfo) {
    // 变更状态
    state.userInfo = userInfo;
  },
};


export default {
  login: {
    namespaced: true,
    state,
    getters,
    mutations
  }
}


