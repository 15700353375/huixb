<!--
 * @Author:      changh
 * @DateTime:    2018-06-08
 * @Description: 学生信息
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

      <!-- 选择是否绑定 -->
      <Select v-model="isBindIdCard" class='selcet_default' placeholder='选择是否绑定'>
        <Option v-for="item in bindIdCard" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>

      <!-- 选择班主任 -->
      <Select v-model="classTeacher" class="selcet_default" placeholder='请选择班主任'>
        <Option v-for="item in classTeacherList" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
      </Select>

      <!-- 第一年缴费情况 -->
      <Select v-model="fPayStatus" class='selcet_default' placeholder='第一年缴费情况'>
        <Option v-for="item in fPayStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <!-- 第二年缴费情况 -->
      <Select v-model="sPayStatus" class='selcet_default' placeholder='第二年缴费情况'>
        <Option v-for="item in sPayStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>

      <Input type="text" class="search_default" v-model="condition" placeholder="请输入姓名或身份证"></Input>


      <Button type="primary" @click="getList">查询</Button>


    </div>
    
    <!-- 表格数据 -->
    <Table class="hxb_table" 
            size='default' 
            min-width='1000'
            border 
            :columns="column_head" 
            :data="column_data">
    </Table>

    <!-- 分页信息 -->
    <Page show-sizer show-elevator show-total 
          :total="page.total" 
          :page-size='page.pageSize' 
          @on-change='pageChange' 
          @on-page-size-change='sizeChange'>
    </Page>



    <!-- 转班 -->
    <changeMobile v-if="dialogs.change_mobile" 
                :studentInfo='studentInfo' 
                @mobileClose='dialogs.change_mobile=false'>
    </changeMobile>

    <studentDetail v-if="dialogs.student_datail"
                :studentItem='studentInfo' 
                @detailClose='dialogs.student_datail=false'>
    </studentDetail>
    
    
    
  </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  import { bindIdCard, registrationTypes, payStatusList } from '@Util/const';
  import changeMobile from '@Components/changeMobile';
  import studentDetail from '@Components/studentDetail';
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
              title: '身份证号',
              key: 'idCard',
              align:'center',
              minWidth: 150,
          },
          {
              title: '民族',
              key: 'nation',
              align:'center',
              minWidth: 80,
          },
          {
              title: '就读类型',
              key: 'signType',
              align:'center',
              minWidth: 80,
          },
          {
              title: '专业/课程',
              key: 'majorName',
              align:'center',
              minWidth: 120,
          },
          {
              title: '层次',
              key: 'degree',
              align:'center',
              minWidth: 80,
          },
          {
              title: '批次',
              key: 'batchNo',
              align:'center',
              minWidth: 80,
          },
          {
              title: '班主任',
              key: 'teacherName',
              align:'center',
              minWidth: 80,
          },          
          {
              title: '第一年缴费',
              key: 'firstYearPaymentStatus',
              align:'center',
              minWidth: 100,
          },
          {
              title: '第二年缴费',
              key: 'secondYearPaymentStatus',
              align:'center',
              minWidth: 100,
          },
          {
              title: '是否绑定',
              // key: 'uid',
              align:'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span',{

                },params.row.uid ? '已绑定' : '未绑定')
              }
          },
          {
              title: '操作',
              align:'center',
              minWidth: 250,
              fixed: 'right',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small',
                          disabled: params.row.uid ? false : true,
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                        click: (val) => {
                          if(!params.row.uid){
                            this.$message.warning('该学生未绑定')
                            return
                          }
                          this.studentInfo = params.row;
                          this.dialogs.student_datail = true;                            
                        }
                      }
                  }, '查看详情'),
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
                              // this.turnClass(params.row)
                          }
                      }
                  }, '发消息'),
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
                            this.studentInfo = params.row;
                            this.dialogs.change_mobile = true;    
                          }
                      }
                  }, '更改手机号')
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

      // 是否绑定
      bindIdCard: bindIdCard,
      isBindIdCard: '',

      // 报名类型
      registrationTypes: registrationTypes,
      registrationType: '',

      // 专业课程
      courses: [],
      course: '',

      // 批次号
      batchList: [],
      batch: '',

      // 班主任
      classTeacherList: [],
      classTeacher: '',

      // 缴费情况
      fPayStatusList: payStatusList,
      fPayStatus: '',
      sPayStatusList: payStatusList,
      sPayStatus: '',

      // 查询
      condition: '',

      // 请求参数
      parmas: {},

      dialogs: {
        student_datail: false,
        change_mobile: false,
      },

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
          siteId: this.site_id == 0 ? '' : Number(this.site_id),
          signType: this.registrationType,
          signTargetId: this.course == 0 ? '' : this.course,
          batchNo: this.batch == 0 ? '' : this.batch,
          teacherId: this.classTeacher == 0 ? '' : Number(this.classTeacher),
          recruitorId: this.recruit == 0 ? '' : Number(this.recruit),
          fPayStatus: this.fPayStatus == 'all' ? '' : Number(this.fPayStatus),
          sPayStatus: this.sPayStatus == 'all' ? '' : Number(this.sPayStatus),
          isBindIdCard: this.isBindIdCard == 0 ? '' : Number(this.isBindIdCard),
          condition: this.condition,
        };
        // this.getList(parmas);
      },
      changePages(){
        
        // let page = this.page.page;
        // let pageSize = this.page.pageSize;
        // this.getList();
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
        this.$ajaxPost(urls.GETSTUDENTEXTINFOBYCONDITION, parmas).then(res => {
          if(res){
            if(res.body){
              this.column_data = res.body.data;
              this.page.total = res.body.total;
            }else{
              this.column_data = [];
              // this.page.total = 0;
            }
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
            this.classTeacherList.unshift({
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


      // 转班
      turnClass(parmas){
        
        this.studentInfo = parmas;
        this.dialogs.isChangeClass = true;
      },
      classClose(){
        this.dialogs.isChangeClass = false;
      },



      // 分页相关
      pageChange(page){
        this.page.page = page;
        this.getList();
      },
      sizeChange(size){
        this.page.pageSize = size;        
        this.getList();
      },
    },
    components:{
      changeMobile,
      studentDetail,
    }
  }
</script>
