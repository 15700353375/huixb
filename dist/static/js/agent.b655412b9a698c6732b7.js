webpackJsonp([0],{309:function(t,e,a){var s=a(213)(a(316),a(327),null,null,null);t.exports=s.exports},313:function(t,e,a){"use strict";e.__esModule=!0;var s=a(214),i=function(t){return t&&t.__esModule?t:{default:t}}(s);e.default=i.default||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(t[s]=a[s])}return t}},314:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(313),i=function(t){return t&&t.__esModule?t:{default:t}}(s),n=a(47);e.default={props:["navData"],data:function(){return{activeLi:{staffSaleStatist:!1,customerList:!1,distributePower:!1,staffList:!1,systemList:!1},roleId:""}},methods:{initActiveLi:function(t){if(!$(t.target).hasClass("opend"))for(var e in this.activeLi)this.activeLi[e]=!1},navMenuClick:function(t){this.initActiveLi(t);var e=t.target.dataset.pathname,a=t.target.dataset.bread,s=t.target.dataset.tabs;this.$store.commit("common/setBread",a),this.$store.commit("common/setActiveLi",e),this.$store.commit("common/setActiveTab",s),this.$router.push({name:e})}},computed:(0,i.default)({},(0,n.mapState)({countLocalState:function(t){this.activeLi[t.common.activeLi]=!0,this.roleId=t.login.userInfo.role_id}}))}},315:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(47);e.default={props:["navData"],data:function(){return{option:[{value:"SelfInfoDialog",label:"个人信息"},{value:"editPassWordDialog",label:"修改密码"},{value:"exit",label:"退出"}],dialogs:{SelfInfoDialog:!1,editPassWordDialog:!1}}},mounted:function(){},computed:(0,s.mapState)({username:function(t){return t.login.userInfo.username},agentCode:function(t){return t.login.userInfo.agent_code},bread:function(t){return t.common.bread}}),methods:{liChange:function(t){switch(t){case"SelfInfoDialog":case"editPassWordDialog":this.dialogs[t]=!0;break;case"exit":this.exit()}},close:function(t){this.dialogs[t]=!1},exit:function(){sessionStorage.removeItem("agentToken"),sessionStorage.removeItem("vuexData"),this.$store.commit("common/setBread","销售报表"),this.$store.commit("common/setActiveLi","staffSaleStatist"),this.$store.commit("common/setActiveTab","staffSaleStatist"),this.$router.push({path:"/"})}},components:{}}},316:function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=a(320),n=s(i),o=a(321),r=s(o);e.default={data:function(){return{keywords:"",minLen:5,navData:[{index:"1",name:"销售报表",class:"zm-icomoon-icon_report-form",hasPermission:!0,list:[{index:"1-1",name:"汇总报表",hasPermission:!0,url:"/shop/report/collectReport"},{index:"1-2",name:"销售报表",hasPermission:!0,url:"/shop/report/collectReport"}]},{index:"2",name:"超市管理",class:"zm-icomoon-icon_report-form",hasPermission:!0,list:[{index:"2-1",name:"超市管理1",hasPermission:!0,url:"/shop/report/collectReport"},{index:"2-2",name:"超市管理2",hasPermission:!0,url:"/shop/report/collectReport"}]}]}},mounted:function(){},methods:{mask:function(t){return t.toLowerCase().replace(/^[^a-z]+/,"").replace(/[^a-z0-9]/g,"")}},components:{NavMenuVue:n.default,TopbarVue:r.default}}},320:function(t,e,a){var s=a(213)(a(314),a(323),null,null,null);t.exports=s.exports},321:function(t,e,a){var s=a(213)(a(315),a(322),null,null,null);t.exports=s.exports},322:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mainRight"},[a("div",{staticClass:"topBar"},[a("div",{staticClass:"menue"},[a("div",{staticClass:"name pull-left"},[t._v("代理商ID："+t._s(t.agentCode))]),t._v(" "),t._m(0)]),t._v(" "),a("div",{staticClass:"bread"},[a("span",[t._v(t._s(t.bread))])])]),t._v(" "),a("div",{staticClass:"content"},[a("router-view")],1)])},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"service pull-right"},[a("span",{staticClass:"phone"},[t._v("客服电话：400-881-5661")])])}]}},323:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mainLeft"},[a("div",{staticClass:"displayNone"},[t._v(t._s(t.countLocalState))]),t._v(" "),a("div",{staticClass:"logo"}),t._v(" "),a("dl",{staticClass:"text-center navMenu",on:{click:t.navMenuClick}},[a("dt",{class:{opend:t.activeLi.staffSaleStatist},attrs:{"data-pathName":"staffSaleStatist","data-bread":"销售报表","data-tabs":"staffSaleStatist"}},[t._v("销售报表\n    ")]),t._v(" "),a("dt",{class:{opend:t.activeLi.customerList},attrs:{"data-pathName":"customerList","data-bread":"超市管理"}},[t._v("超市管理\n    ")]),t._v(" "),1==t.roleId?a("dt",{class:{opend:t.activeLi.distributePower},attrs:{"data-pathName":"distributePower","data-bread":"授权管理","data-tabs":"distributePower"}},[t._v("授权管理\n    ")]):t._e(),t._v(" "),1==t.roleId?a("dt",{class:{opend:t.activeLi.staffList},attrs:{"data-pathName":"staffList","data-bread":"员工管理"}},[t._v("员工管理\n    ")]):t._e(),t._v(" "),1==t.roleId?a("dt",{class:{opend:t.activeLi.systemList},attrs:{"data-pathName":"systemList","data-bread":"系统管理"}},[t._v("系统管理\n    ")]):t._e()])])},staticRenderFns:[]}},327:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"vueRouter"}},[a("NavMenuVue"),t._v(" "),a("TopbarVue")],1)},staticRenderFns:[]}}});