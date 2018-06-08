<!--
 * @Author:      changh
 * @DateTime:    2018-05-28
 * @Description: 招生管理 - 招生批次
 -->

<template>
  <div class="main_module">
    <!-- 计算 -->
    <div class="displayNone">{{changeParmas}}</div>

    <Table class="hxb_table" size='default' v-if="column_data && column_data.length" border :columns="column_head" :data="column_data"></Table>
    <Page show-sizer 
          show-elevator 
          show-total 
          :total="page.total" 
          :page-size='page.pageSize'             
          @on-change='pageChange' 
          @on-page-size-change='sizeChange'></Page>
  </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  export default {
    data(){
      return {
        page: {
          total: 100,
          pageSize: 10,
          page: 1,
        },

         column_head: [
          {
              title: '考次编码',
              key: 'batchCode',
              align:'center',
          },
          {
              title: '批次编码',
              key: 'examtimeCode',
              align:'center',
          },
          {
              title: '批次名称',
              key: 'batchName',
              align:'center',
          },
          {
              title: '网上报名',
              key: 'onlineApplication',
              align:'center',
          },
          {
              title: '结束时间',
              key: 'endTime',
              align:'center',
          },
          {
              title: '是否是当前批次',
              key: 'currentBatch',
              align:'center',
          }
      ],
      column_data: []

      }
    },
    mounted(){

    },
    computed:{
      changeParmas(){
        let parmas = {
          //分页信息
          page : this.page.page,
          pageSize : this.page.pageSize
        };

        this.getList(parmas);
      }
    },
    methods: {
      getList(parmas){
        this.$ajaxGet(urls.MANAGERRECRUIT, parmas).then(res => {
          
          if(res){
            this.column_data = res.body.data;
            this.page.total = res.body.total;
          }
        })    
      },

      // 分页相关
      pageChange(page){
        this.page.page = page;
      },
      sizeChange(size){
        this.page.pageSize = size;        
      },
    },
    components:{}
  }
</script>
