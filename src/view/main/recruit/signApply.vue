<!--
 * @Author:      changh
 * @DateTime:    2018-05-28
 * @Description: 招生管理 - 报名信息
 -->

<template>
  <div class="main_module">
    <!-- 计算 -->
    <div class="displayNone">{{changeParmas}}</div>
    <!-- 表格的筛选信息 -->

    <!-- 机构和站点 -->
    <div class="table_select clearfix">
      <Button type="primary" @click="addStudent">添加单个学生</Button>
      <Button type="primary" @click="exportStudent">批量导入学生</Button>
      <Button type="primary" @click="getList">下载模板</Button>
      <Button type="primary" @click="getList">确认</Button>
      <Button type="primary" @click="getList">返回</Button>
    </div>

    <Table class="hxb_table" 
            size='default' 
            border 
            :columns="column_head" 
            :data="column_data"></Table>
    <!-- <div class="notData">暂无数据</div> -->
    <Page show-sizer show-elevator show-total :total="page.total" :page-size='page.pageSize' @on-change='pageChange' @on-page-size-change='sizeChange'></Page>
    <changeClass v-if="dialogs.isChangeClass"></changeClass>
  </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  
  import changeClass from '@Components/changeClass';
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
              title: '姓名',
              key: 'name',
              align:'center',
          },
          {
              title: '民族',
              key: 'name',
              align:'center',
          },
          {
              title: '身份证',
              key: 'idCard',
              align:'center',
          },
          {
              title: '手机号',
              key: 'name',
              align:'center',
          },
          {
              title: '报名类型',
              key: 'signType',
              align:'center',
          },          
          {
              title: '专业/课程',
              key: 'courseName',
              align:'center',
          },
          {
              title: '学历',
              key: 'name',
              align:'center',
          },
          {
              title: '课程/专业编号',
              key: 'name',
              align:'center',
          },
          {
              title: '报读类型',
              key: 'applyType',
              align:'center',
          },
          {
              title: '批次号',
              key: 'batchNo',
              align:'center',
          },
          {
              title: '省份',
              key: 'address',
              align:'center',
          },
          {
              title: '入学时间',
              key: 'name',
              align:'center',
          },
          {
              title: '学校',
              key: 'name',
              align:'center',
          },
          {
              title: '地址',
              key: 'name',
              align:'center',
          },
          {
              title: '操作',
              key: 'secondYearPaymentStatus',
              align:'center',
              minWidth: 160,
              render: (h, params) => {
                console.log(params.row.payStatus)
                return h('div', [
                  h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small',
                          disabled: params.row.payStatus == '已支付' ? true : false,
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                        click: (val) => {
                          
                            // this.pay(params.index)
                            this.$Modal.confirm({
                                title: '提示',
                                content: '<p>此操作将支付费用, 是否继续?</p>',
                                // okText: '是',
                                onOk: () => {
                                  setTimeout(() => {
                                      this.$Modal.remove();
                                      
                                      this.pay(params.row)
                                  }, 1000);
                              }
                            });
                        }
                      }
                  }, params.row.payStatus),
                  h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                          click: () => {
                              this.turnClass(params.row)
                          }
                      }
                  }, '转班'),
                  h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                          click: () => {
                              this.getSite(params.row)
                          }
                      }
                  }, '转站点')
                ]);
            }
          }
      ],
      column_data: [],

      parmas: {
        batch_no: null,
        divide: null,
        page: 1,
        pageSize: 10,
        recruitorId: null,
        schoolId: null,        
        signType: null,
        sign_target_id: null,
        site_id: null,
        teacher_id: null
      },
      // 机构
      organizationList: [],
      organization: '',
      // 站点
      siteList: [],
      site_id: '',

      // 报名类型
      registrationTypes: [
        {
          label: '课程',
          value: 1
        },
        {
          label: '专业',
          value: 2
        },
        {
          label: '考证',
          value: 3
        },
        {
          value: 4,
          label: '升学培训'
        }
      ],
      registrationType: '',

      // 专业课程
      courses: [],
      course: '',

      // 批次号
      batchList: [],
      batch: '',

      // 是否分班
      classList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '已分班',
          value: 1
        },
        {
          label: '未分班',
          value: 2
        }
      ],
      isClass: '',

      // 班主任
      classTeacherList: [],
      classTeacher: '',

      // 招生老师
      recruitList: [],
      recruit: '',


      // 请求参数
      parmas: {},

      dialogs: {
        isChangeClass: false,
      }

      }
    },
    mounted(){
      // 获取默认筛选条件
      this.getOrganization();
      this.getBatch();
      this.getTeacher();

      // 获取列表
      this.getList();
    },
    computed:{

      changeParmas(){
        this.parmas = {
          //分页信息
          page : this.page.page,
          pageSize : this.page.pageSize,
          schoolId: this.site_id == 0 ? '' : Number(this.organization),
          site_id: this.site_id == 0 ? '' : Number(this.site_id),
          signType: this.registrationType,
          sign_target_id: this.course == 0 ? '' : Number(this.course),
          batch_no: this.batch == 0 ? '' : this.batch,
          divide: this.isClass,
          teacher_id: this.classTeacher == 0 ? '' : Number(this.classTeacher),
          recruitorId: this.recruit == 0 ? '' : Number(this.recruit),
        };
        // this.getList(parmas);
      }
    },
    watch:{
      organization(curVal, oldVal){
        if(curVal){
          this.getSite(curVal)
        }else{
          this.siteList = this.siteList.splice(0,1);
        }
      },
      registrationType(curVal, oldVal){
        if(curVal){
          this.getCourses(curVal)
        }else{
          this.courses = this.courses.splice(0,1);
        }
      }
    },
    methods: {
      getList(){
        let parmas = this.params;
        this.$ajaxPost(urls.GETEXTBYCONDITION, parmas).then(res => {
          this.column_data = res.body.data;
          this.page.total = res.body.total;
        })  
      },
      // 获取机构
      getOrganization(){
        this.$ajaxPost(urls.GETALLSCHOOLLIST).then(res => {
          this.organizationList = res.body;  
          this.organizationList.unshift({
            schoolId: 0,
            schoolName: '全部'
          })
        })
      },
      
      // 获取批次号
      getBatch(){
        this.$ajaxPost(urls.GETBATCHLIST).then(res => {
          let batchList = res.body;  
          batchList.forEach(item =>{
            this.batchList.push({
              name: item,
              id: item,
            })
          })
          this.batchList.unshift({
            id: 0,
            name: '全部'
          })
        })
      },

      // 获取班主任-招生老师
      getTeacher(){
        this.$ajaxPost(urls.GETCONDITIONLIST).then(res => {          
          this.classTeacherList = res.body.headTeacherList;  
          this.recruitList = res.body.recruitList;  
          this.classTeacherList.unshift({
            uid: 0,
            name: '全部'
          })
          this.recruitList.unshift({
            uid: 0,
            name: '全部'
          })
        })
      },




      // 获取站点
      getSite(schoolId){
        let parmas ={
          schoolId: Number(schoolId)
        } 
        this.$ajaxPostForm(urls.GETSITELIST,parmas).then(res => {
          this.siteList = res.body;  
          this.siteList.unshift({
            siteId: 0,
            siteName: '全部'
          })        
        })
      },

      // 获取专业、课程
      getCourses(type){
        let parmas ={
          type: Number(type)
        } 
        this.$ajaxPostForm(urls.GETMAJORNAMEBYTYPE,parmas).then(res => {
          this.courses = res.body;  
          this.courses.unshift({
            no: 0,
            name: '全部'
          })        
        })
      },

      // 支付
      pay(parmas){
        
        let parma = {
          idCard: parmas.idCard,
          majorNo: parmas.signTargetId,
          schoolId: parmas.schoolId,
          signLevel: parmas.signLevel,
          signType: parmas.signType,
          siteId: parmas.siteId,
        }
        
        this.$ajaxPost(urls.GETPAYMONEY,parma).then(res => {
          debugger   
          parmas.payStatus = '已支付'   
        })
        
      },
      // 转班
      turnClass(parmas){
        this.dialogs.isChangeClass = true;
      },
      // 转站点
      turnSite(parmas){        
        this.$ajaxPost(urls.GETSITELIST, parmas).then(res => {
          this.column_data = res.body;
          this.page.total = res.body[0].count;
        })
      },

      // 交互代码
      // 新增学生
      addStudent(){

      },
      // 导出学生
      exportStudent(){

      },

      // 分页相关
      pageChange(page){
        this.page.page = page;
      },
      sizeChange(size){
        this.page.pageSize = size;        
      },
    },
    components:{
      changeClass
    }
  }
</script>
