<!--
 * @Author:      cyzeng
 * @DateTime:    2017年7月31日13:49:25
 * @Description: 销售报表
 -->

<template>
  <div class="saleRecord">
    <div class="condition">
      <div class="displayNone">{{countLocalState}}</div>
      <div class="displayNone">{{AllData}}</div>


    </div>

    <div class="result">
        <table class="table table-bordered table-hover text-center"
               :class="{'marginB-20': !tableData.length }">
          <thead>
            <tr>
              <th>序号</th>
              <th>超市名称</th>
              <th>区域</th>
              <th>详细地址</th>
              <th>联系人</th>
              <th>联系电话</th>
              <th>版本</th>
              <th>授权数</th>
              <th is="SortVue"
                  class="sortTh"
                  title="授权时间"
                  attr="total_sale_money"
                  @sortCallBack="sortCallBack">
              </th>
              <th is="SortVue"
                  class="sortTh"
                  title="剩余"
                  attr="total_sale_money"
                  @sortCallBack="sortCallBack">
              </th>

              <th>销售金额</th>
              <th>销售员</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="tableData.length">
              <tr v-for="itemParent in tableData">
                <td>{{itemParent.index}}</td>
                <td>{{itemParent.shop_name}}</td>
                <td>{{itemParent.regionName}}</td>
                <td>{{itemParent.address}}</td>
                <td>{{itemParent.manager_name}}</td>
                <td>{{itemParent.manager_phone}}</td>
                <td :class="{'standard': itemParent.version_type == 1,
                             'increment': itemParent.version_type == 2}">{{itemParent.versionName}}
                </td>
                <td>{{itemParent.empower_num}}</td>
                <td>{{itemParent.createTimeName}}</td>
                <td>{{itemParent.surplus_days}}天</td>
                <td>{{itemParent.sale_money}}</td>
                <td>{{itemParent.username}}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="12">暂无数据</td>
            </tr>
          </tbody>
        </table>

        <div v-if="tableData.length"
             class="paginationDiv">
          <span class="paginationTitle">
            共<b class="textColor">{{pagination.centent.total}}</b>条记录，销售总额:<b class="textColor bold">{{comUtil.formatMoney(tableCount)}}</b>元
          </span>

        </div>
    </div>
  </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import comUtil from '@Util/comUtil';
  import { mapState } from 'vuex';
  export default {
    data(){
      return {

        // 公共方法
        comUtil: comUtil,

        // 时间
        timeVal: {
          startTime:  Moment().startOf('day').unix(),
          endTime: Moment().unix()
        },

        // 搜索key
        searchText: '',

        // 排序
        sort_index: '',

        // 区域
        region: {
          value: '',
          options: []
        },

        // 版本
        version: {
          value: '',
          options: [
            {
              value: 0,
              label: '标准版（试用)'
            },
            {
              value: 1,
              label: '标准版'
            },
            {
              value: 2,
              label: '增值版'
            }
          ]
        },

        // 员工
        staff: {
          value: '',
          options: []
        },

        // 表格数据
        tableData: [],

        // 表格统计
        tableCount: 0,

        // 分页信息
        pagination: {
          centent: {
            total: 0,
            current_page: 1,
            last_page: 0,
            limit: 10,
            options: [
              {
                value: 10,
                label: '10条/页'
              },
              {
                value: 20,
                label: '20条/页'
              },
              {
                value: 50,
                label: '50条/页'
              }
           ]
          },
          paginationOptions: {
            offset: 3,
            previousText: '<',
            nextText: '>',
            alwaysShowPrevNext: true
          }
        },

      }
    },
    mounted(){
      // 获取员工下拉菜单
      let employeePromsie = this.$ajaxPost(urls.EMPLOYEE_ALL_EMPLOYEE);
      if(employeePromsie){
        employeePromsie.then((res) =>{
          if(res){
            if(res.code == 200){
              this.staff.options = comUtil.formatEmployee(res.data);
            }
          }
        })
      }
    },
    computed:{
      ...mapState({
        // 区域option，从vuex中获取
        countLocalState(state){
          this.region.options = state.common.regionOptions;
        }
      }),
      //计算属性，任意数据改变，更改表格数据tableData
      AllData(){
        let param = {
          //日期查询
          start_time: this.timeVal.startTime,
          end_time: this.timeVal.endTime,

          // 搜索key
          keywords: this.searchText,

          // 区域
          city_id: this.region.value,

          // 版本
          version_type: this.version.value,

          // 授权人
          user_id: this.staff.value,

          // 排序
          sort_index: this.sort_index,

          // 分页信息
          limit: this.pagination.centent.limit,
          page: this.pagination.centent.current_page,
        };

        this.queryList(param);
      }
    },
    methods: {

      // 格式化服务器数据
      formatTable(list){
        list.forEach((item)=>{
          item.regionName = comUtil.formatRegion(item.province_id, item.city_id, this.region.options);
          item.versionName = item.version_type == 1 ? '标准版' : '增值版';
          item.createTimeName = comUtil.formatTime(item.create_time, 'YYYY-MM-DD HH:mm');
        })
        return list;
      },

      //获取查询结果数据
      queryList(param){
        let tablePromsie = this.$ajaxPost(urls.SALE_SALE_RECORD, param);
        if(tablePromsie){
          tablePromsie.then((res) =>{
            if(res){
              if(res.code == 200){
                this.tableData = this.formatTable(res.data.list);
                this.tableCount = res.data.sum_sale_money;
                this.pagination.centent.total = res.data.pagination.total_num;
                // this.pagination.centent.current_page = res.data.pagination.page;
                this.pagination.centent.last_page = res.data.pagination.total_page;
              }
            }
          })
        }
      },

      // 排序
      sortCallBack(value){
        this.sort_index = value;
      },

      // 分页输入框跳转事件
      changeCurrentPage(page){
        this.pagination.centent.current_page = page;
      }

    },
    components:{

    }
  }
</script>
