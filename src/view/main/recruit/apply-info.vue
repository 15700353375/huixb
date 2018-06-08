<!--
 * @Author:      changh
 * @DateTime:    2018-05-28
 * @Description: 招生管理 - 报名信息
 -->

<template>
  <div class="main_module">
    <!-- 计算 -->
    <div class="displayNone">{{changeParmas}} {{changePages}}</div>
    <!-- 表格的筛选信息 -->

    <!-- 机构和站点 -->
    <div class="table_select">
      <Select v-model="organization" class="selcet_default" placeholder='请选择机构'>
        <Option v-for="item in organizationList" :value="item.schoolId" :key="item.schoolId">{{ item.schoolName }}</Option>
      </Select>
      <Select v-model="site_id" class='selcet_default' placeholder='请选择站点'>
        <Option v-for="item in siteList" :value="item.siteId" :key="item.siteId">{{ item.siteName }}</Option>
      </Select>

      <!-- 选择报名信息 -->
      <Select v-model="registrationType" class="selcet_default" placeholder='请选择报名类型'>
        <Option v-for="item in registrationTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="course" class='selcet_default' placeholder='请选择专业/课程'>
        <Option v-for="item in courses" :value="item.no" :key="item.no">{{ item.name }}</Option>
      </Select>

      <!-- 选择批次号 -->
      <Select v-model="batch" class='selcet_default' placeholder='请选择批次号'>
        <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>

      <!-- 选择是否分班 -->
      <Select v-model="isClass" class='selcet_default' placeholder='请选择分班'>
        <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>

      <!-- 选择班主任 -->
      <Select v-model="classTeacher" class="selcet_default" placeholder='请选择班主任'>
        <Option v-for="item in classTeacherList" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
      </Select>

      <!-- 选择招生人员 -->
      <Select v-model="recruit" class='selcet_default' placeholder='请选择招生人员'>
        <Option v-for="item in recruitList" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
      </Select>

      <Button type="primary" @click="getList">查询</Button>

      <div class="clearfix">
        <Button type="primary" @click="addStudent">新增学生</Button>
        <Button type="primary" @click="exportStudent">导出</Button>
      </div>

    </div>
    
    <!-- 表格数据 -->
    <Table class="hxb_table" 
            size='default' 
            min-width='1000'
            border 
            :columns="column_head" 
            :data="column_data">
    </Table>

    <!-- 导出表格数据 -->
    <Table class="hxb_table displayNone"
            ref="table" 
            size='default' 
            min-width='1000'
            border 
            :columns="column_head_export" 
            :data="column_data_export">
    </Table>

    <!-- 分页信息 -->
    <Page show-sizer show-elevator show-total 
          :total="page.total" 
          :page-size='page.pageSize' 
          @on-change='pageChange' 
          @on-page-size-change='sizeChange'>
    </Page>

    <!-- 支付 -->
    <pay v-if="dialogs.pay" 
        :payData='payData' 
        @payClose='payClose' 
        @checkStatus='checkStatus'>
    </pay>

    <!-- 转班 -->
    <changeClass v-if="dialogs.isChangeClass" 
                :classTeacherList='classTeacherList' 
                :studentInfo='studentInfo' 
                @classClose='classClose'>
    </changeClass>

    <!-- 转站点 -->
    <changeSite v-if="dialogs.isChangeSite" 
                :studentInfo='studentInfo' 
                @siteClose='dialogs.isChangeSite=false'>
    </changeSite>
    
    
    
  </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  import { registrationTypes } from '@Util/const';
  import changeClass from '@Components/changeClass';
  import changeSite from '@Components/changeSite';
  import pay from '@Components/pay';
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
              minWidth: 100,
              fixed: 'left'
          },
          {
              title: '身份证',
              key: 'idCard',
              align:'center',
              minWidth: 150,
          },
          {
              title: '报名类型',
              key: 'signType',
              align:'center',
              minWidth: 80,
          },
          {
              title: '专业/课程',
              key: 'courseName',
              align:'center',
              minWidth: 80,
          },
          {
              title: '报读类型',
              key: 'applyType',
              align:'center',
              minWidth: 80,
          },
          {
              title: '批次号',
              key: 'batchNo',
              align:'center',
              minWidth: 80,
          },
          {
              title: '省份',
              key: 'address',
              align:'center',
              minWidth: 100,
          },
          {
              title: '在读高校名称',
              key: 'schoolName',
              align:'center',
              minWidth: 100,
          },
          {
              title: '班主任',
              key: 'teacherName',
              align:'center',
              minWidth: 100,
          },
          {
              title: '招生人员',
              key: 'recruitorName',
              align:'center',
              minWidth: 100,
          },
          {
              title: '报名状态',
              key: 'secondYearPaymentStatus',
              align:'center',
              minWidth: 190,
              fixed: 'right',
              render: (h, params) => {
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
                              this.turnSite(params.row)
                          }
                      }
                  }, '转站点')
                ]);
            }
          }
      ],
      column_data: [],

      // 导出数据
      column_head_export: [],
      column_data_export: [],


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
      registrationTypes: registrationTypes,
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


      // 传入支付的数据
      payData: {},
      // 请求参数
      parmas: {},

      dialogs: {
        isChangeClass: false,
        isChangeSite: false,
        pay: false
      },
      timer: null,

      // 当前学生信息、
      studentInfo: {},

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
          schoolId: this.organization == 0 ? '' : Number(this.organization),
          site_id: this.site_id == 0 ? '' : Number(this.site_id),
          signType: this.registrationType,
          sign_target_id: this.course == 0 ? '' : this.course,
          batch_no: this.batch == 0 ? '' : this.batch,
          divide: this.isClass,
          teacher_id: this.classTeacher == 0 ? '' : Number(this.classTeacher),
          recruitorId: this.recruit == 0 ? '' : Number(this.recruit),
        };
        // this.getList(parmas);
      },
      changePages(){
        
        let page = this.page.page;
        let pageSize = this.page.pageSize;
        this.getList();
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
        let parmas = this.parmas;
        this.$ajaxPost(urls.GETEXTBYCONDITION, parmas).then(res => {
          if(res){
            this.column_data = res.body.data;
            this.page.total = res.body.total;
          }          
        })  
      },
      // 获取机构
      getOrganization(){
        this.$ajaxPost(urls.GETALLSCHOOLLIST).then(res => {
          if(res){
            this.organizationList = res.body;  
            this.organizationList.unshift({
              schoolId: 0,
              schoolName: '全部'
            })
          }
        })
      },
      
      // 获取批次号
      getBatch(){
        this.$ajaxPost(urls.GETBATCHLIST).then(res => {
          if(res){
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
          }
        })
      },

      // 获取班主任-招生老师
      getTeacher(){
        this.$ajaxPost(urls.GETCONDITIONLIST).then(res => {          
          if(res){
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
          }
        })
      },




      // 获取站点
      getSite(schoolId){
        let parmas ={
          schoolId: Number(schoolId)
        } 
        this.$ajaxPostForm(urls.GETSITELIST,parmas).then(res => {
          if(res){
            this.siteList = res.body;  
            this.siteList.unshift({
              siteId: 0,
              siteName: '全部'
            })  
          }      
        })
      },

      // 获取专业、课程
      getCourses(type){
        let parmas ={
          type: Number(type)
        } 
        this.$ajaxPostForm(urls.GETMAJORNAMEBYTYPE,parmas).then(res => {
          if(res){
            this.courses = res.body;  
            this.courses.unshift({
              no: 0,
              name: '全部'
            }) 
          }       
        })
      },
      // 关闭支付弹窗
      payClose(){
        this.dialogs.pay = false;
      },
      checkStatus(){
        window.clearInterval(this.timer)
        this.timer = setInterval(()=>{
          this.$ajaxPostForm(urls.GETORDERSTATUS,{sn: this.payData.sn}).then(res => {
            if(res.body == '支付成功'){
              this.$message.success('支付成功')
              this.getList();
              clearInterval(this.timer)
            }
            if(res.body == '支付失败'){
              this.$message.error('支付失败')
               clearInterval(this.timer)
            }
          })
        },10000)
        
      },
      // 支付
      pay(parmas){
        
        let parma = [{
          idCard: parmas.idCard,
          majorNo: parmas.signTargetId,
          schoolId: parmas.schoolId,
          signLevel: this.changeSignLevel(parmas.signLevel),
          signType: this.changeSignType(parmas.signType),
          siteId: parmas.siteId,
        }]
        
        this.$ajaxPost(urls.GETPAYMONEY,parma).then(res => {
          
          if(res){
            this.dialogs.pay = true; 
            this.payData = res.body;
          }
        })        
      },
      // 转化signLevel
      changeSignLevel(data){
        let newData = ''
        switch(data){
          case '基础学': newData = 0;break;
          case '智慧学': newData = 1;break;
          case '专享学': newData = 2;break;
        }
        return newData
      },
      // 转化signLevel
      changeSignType(data){
        let newData = ''
        switch(data){
          case '课程': newData = 1;break;
          case '专业': newData = 2;break;
        }
        return newData
      },
      // 转班
      turnClass(parmas){
        
        this.studentInfo = parmas;
        this.dialogs.isChangeClass = true;
      },
      classClose(){
        this.dialogs.isChangeClass = false;
      },
      // 转站点
      turnSite(parmas){  
        this.studentInfo = parmas;
        this.dialogs.isChangeSite = true;   
           
      },
      siteClose(){
        this.dialogs.isChangeSite = false;
      },
      chooseClassOrSite(id){

      },

      // 交互代码
      // 新增学生
      addStudent(){
        this.$router.push({name:'sign-apply'})
      },
      // 导出学生
      exportStudent(){
        let parmas = this.parmas;
        parmas.pageSize = this.page.total;
        this.$ajaxPost(urls.GETEXTBYCONDITION, parmas).then(res => {
          this.column_data_export = res.body.data;
          this.column_head_export = this.column_head;
          this.column_head_export = this.column_head_export.filter((col, index) => index < 10);
          this.$nextTick(()=>{
            this.$refs.table.exportCsv({
              filename: '学生报名信息'
            })
          })
        });
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
      changeClass,
      changeSite,
      pay
    }
  }
</script>
