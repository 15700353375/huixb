webpackJsonp([1],{311:function(t,e,a){var n=a(213)(a(318),a(324),null,null,null);t.exports=n.exports},313:function(t,e,a){"use strict";e.__esModule=!0;var n=a(214),s=function(t){return t&&t.__esModule?t:{default:t}}(n);e.default=s.default||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t}},318:function(t,e,a){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=a(313),i=n(s),o=a(28),l=a(48),r=n(l),_=a(47);e.default={data:function(){return{comUtil:r.default,timeVal:{startTime:Moment().startOf("day").unix(),endTime:Moment().unix()},searchText:"",sort_index:"",region:{value:"",options:[]},version:{value:"",options:[{value:0,label:"标准版（试用)"},{value:1,label:"标准版"},{value:2,label:"增值版"}]},staff:{value:"",options:[]},tableData:[],tableCount:0,pagination:{centent:{total:0,current_page:1,last_page:0,limit:10,options:[{value:10,label:"10条/页"},{value:20,label:"20条/页"},{value:50,label:"50条/页"}]},paginationOptions:{offset:3,previousText:"<",nextText:">",alwaysShowPrevNext:!0}}}},mounted:function(){var t=this,e=this.$ajaxPost(o.urls.EMPLOYEE_ALL_EMPLOYEE);e&&e.then(function(e){e&&200==e.code&&(t.staff.options=r.default.formatEmployee(e.data))})},computed:(0,i.default)({},(0,_.mapState)({countLocalState:function(t){this.region.options=t.common.regionOptions}}),{AllData:function(){var t={start_time:this.timeVal.startTime,end_time:this.timeVal.endTime,keywords:this.searchText,city_id:this.region.value,version_type:this.version.value,user_id:this.staff.value,sort_index:this.sort_index,limit:this.pagination.centent.limit,page:this.pagination.centent.current_page};this.queryList(t)}}),methods:{formatTable:function(t){var e=this;return t.forEach(function(t){t.regionName=r.default.formatRegion(t.province_id,t.city_id,e.region.options),t.versionName=1==t.version_type?"标准版":"增值版",t.createTimeName=r.default.formatTime(t.create_time,"YYYY-MM-DD HH:mm")}),t},queryList:function(t){var e=this,a=this.$ajaxPost(o.urls.SALE_SALE_RECORD,t);a&&a.then(function(t){t&&200==t.code&&(e.tableData=e.formatTable(t.data.list),e.tableCount=t.data.sum_sale_money,e.pagination.centent.total=t.data.pagination.total_num,e.pagination.centent.last_page=t.data.pagination.total_page)})},sortCallBack:function(t){this.sort_index=t},changeCurrentPage:function(t){this.pagination.centent.current_page=t}},components:{}}},324:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"saleRecord"},[a("div",{staticClass:"condition"},[a("div",{staticClass:"displayNone"},[t._v(t._s(t.countLocalState))]),t._v(" "),a("div",{staticClass:"displayNone"},[t._v(t._s(t.AllData))])]),t._v(" "),a("div",{staticClass:"result"},[a("table",{staticClass:"table table-bordered table-hover text-center",class:{"marginB-20":!t.tableData.length}},[a("thead",[a("tr",[a("th",[t._v("序号")]),t._v(" "),a("th",[t._v("超市名称")]),t._v(" "),a("th",[t._v("区域")]),t._v(" "),a("th",[t._v("详细地址")]),t._v(" "),a("th",[t._v("联系人")]),t._v(" "),a("th",[t._v("联系电话")]),t._v(" "),a("th",[t._v("版本")]),t._v(" "),a("th",[t._v("授权数")]),t._v(" "),a("SortVue",{tag:"th",staticClass:"sortTh",attrs:{title:"授权时间",attr:"total_sale_money"},on:{sortCallBack:t.sortCallBack}}),t._v(" "),a("SortVue",{tag:"th",staticClass:"sortTh",attrs:{title:"剩余",attr:"total_sale_money"},on:{sortCallBack:t.sortCallBack}}),t._v(" "),a("th",[t._v("销售金额")]),t._v(" "),a("th",[t._v("销售员")])])]),t._v(" "),a("tbody",[t.tableData.length?t._l(t.tableData,function(e){return a("tr",[a("td",[t._v(t._s(e.index))]),t._v(" "),a("td",[t._v(t._s(e.shop_name))]),t._v(" "),a("td",[t._v(t._s(e.regionName))]),t._v(" "),a("td",[t._v(t._s(e.address))]),t._v(" "),a("td",[t._v(t._s(e.manager_name))]),t._v(" "),a("td",[t._v(t._s(e.manager_phone))]),t._v(" "),a("td",{class:{standard:1==e.version_type,increment:2==e.version_type}},[t._v(t._s(e.versionName)+"\n              ")]),t._v(" "),a("td",[t._v(t._s(e.empower_num))]),t._v(" "),a("td",[t._v(t._s(e.createTimeName))]),t._v(" "),a("td",[t._v(t._s(e.surplus_days)+"天")]),t._v(" "),a("td",[t._v(t._s(e.sale_money))]),t._v(" "),a("td",[t._v(t._s(e.username))])])}):a("tr",[a("td",{attrs:{colspan:"12"}},[t._v("暂无数据")])])],2)]),t._v(" "),t.tableData.length?a("div",{staticClass:"paginationDiv"},[a("span",{staticClass:"paginationTitle"},[t._v("\n          共"),a("b",{staticClass:"textColor"},[t._v(t._s(t.pagination.centent.total))]),t._v("条记录，销售总额:"),a("b",{staticClass:"textColor bold"},[t._v(t._s(t.comUtil.formatMoney(t.tableCount)))]),t._v("元\n        ")])]):t._e()])])},staticRenderFns:[]}}});