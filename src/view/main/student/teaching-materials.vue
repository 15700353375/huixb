<!--
 * @Author:      changh
 * @DateTime:    2018-06-08
 * @Description: 学生综合管理 - 教辅资料
 -->


<template>
  <div class="main_module">
    <!-- 计算 -->
    <div class="displayNone">{{changeParmas}} {{changePages}}</div>
    <!-- 表格的筛选信息 -->

    <!-- 机构和站点 -->
    <div class="table_select">

      <!-- 选择报名信息 -->
      <Select v-model="majorNo" class="selcet_default" placeholder='请选择专业'>
        <Option v-for="item in majorList" :value="item.majorNo" :key="item.majorNo">{{ item.fullName }}</Option>
      </Select>
      <Select v-model="course" class='selcet_default' placeholder='请选择课程'>
        <Option v-for="item in courses" :value="item.courseNo" :key="item.courseNo">{{ item.shortForm }}</Option>
      </Select>

      <!-- 选择批次号 -->
      <Select v-model="batch" class='selcet_default' placeholder='请选择批次号'>
        <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>

      <!-- 选择班主任 -->
      <Select v-model="classTeacher" class="selcet_default" placeholder='请选择班主任'>
        <Option v-for="item in classTeacherList" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
      </Select>

      <!-- 第一年缴费情况 -->
      <Select v-model="bookletType" class='selcet_default' placeholder='教辅类型'>
        <Option v-for="item in bookletTypeList" :value="item" :key="item">{{ item }}</Option>
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

    
    
    
  </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  import { bindIdCard, registrationTypes, payStatusList } from '@Util/const';
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
              title: '课程',
              key: 'courseName',
              align:'center',
              minWidth: 150,
          },
          {
              title: '班主任',
              key: 'teacherName',
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
              title: '教辅类型',
              key: 'bookletType',
              align:'center',
              minWidth: 80,
          },
          {
              title: 'description',
              key: 'majorName',
              align:'center',
              minWidth: 120,
          },
          {
              title: '领取状态',
              key: 'receiveStatus',
              align:'center',
              minWidth: 80,
          },        
          {
              title: '领取时间',
              key: 'receiveTime',
              align:'center',
              minWidth: 100,
          },

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

      // 教辅类型
      bookletTypeList: [],
      bookletType: '',

      // 专业类型
      majorList: [],
      majorNo: '',

      // 课程
      courses: [],
      course: '',

      // 批次号
      batchList: [],
      batch: '',

      // 班主任
      classTeacherList: [],
      classTeacher: '',

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
      this.getBatch();
      this.getBooks();

      // 获取列表
      this.getList();
    },
    computed:{

      changeParmas(){
        this.parmas = {
          //分页信息
          page : this.page.page,
          pageSize : this.page.pageSize,
          bookletType: this.bookletType == 0 ? '' : Number(this.bookletType),
          courseNo: this.course,
          majorNo: this.majorNo,          
          batchNo: this.batch == 0 ? '' : this.batch,
          teacherId: this.classTeacher == 0 ? '' : Number(this.classTeacher),
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
      majorNo(curVal, oldVal){
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
        this.$ajaxPost(urls.GETRECEIVEBOOKLETINFO, parmas).then(res => {
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


      // 获取站点
      getBooks(schoolId){
        this.$ajaxPostForm(urls.GETBOOKLETDROPDOWNLIST).then(res => {
          if(res){
            this.bookletTypeList = res.body.bookletTypeList; 
            this.classTeacherList = res.body.headTeacherList;  
            this.majorList = res.body.majorList;
            this.classTeacherList.unshift({
              uid: 0,
              name: '全部'
            }) 
            this.bookletTypeList.unshift('全部')  
          }      
        })
      },

      // 获取专业、课程
      getCourses(type){
        let parmas ={
          majorNo: Number(type)
        } 
        this.$ajaxPostForm(urls.GETCOURSELISTBYMAJORNO,parmas).then(res => {
          if(res){
            this.courses = res.body;  
            this.courses.unshift({
              courseNo: 0,
              shortForm: '全部'
            }) 
          }       
        })
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
   
    }
  }
</script>
