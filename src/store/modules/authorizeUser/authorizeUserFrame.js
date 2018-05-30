const state = {
  // reset
  refresh: false,
};

const getters = {};


const mutations = {
  setRefresh(state,refresh) {
    // 变更状态
    state.refresh = refresh;
  }
};


export default {
  authorizeUserFrame: {
    namespaced: true,
    state,
    getters,
    mutations
  }
}


