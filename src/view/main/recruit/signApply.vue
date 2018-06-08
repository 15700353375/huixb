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
      <!-- <Button type="primary" >下载模板</Button> -->
      <a href="/static/zip/importStudentInfo.rar"  download="导入学生信息模板.rar" class="button"><Button type="primary">下载模板</Button></a>
      <Button type="primary" @click='addAllstudent'>确认</Button>
      <Button type="primary" >返回</Button>
      <input id="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handkeFileChange">
    </div>

    <Table class="hxb_table" 
            size='default' 
            border 
            :columns="column_head" 
            :data="column_data"></Table>
    

    <!-- 新增学生 -->
    <addStudent v-if="dialogs.isAddStudent" 
                @addStudentClose='addStudentClose'>
    </addStudent>
  </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import comUtil from '@Util/comUtil';
  import { mapState } from 'vuex';
    // 引入xlsx
  var XLSX = require('xlsx');
  import addStudent from '@Components/addStudent';
  export default {
    data(){
      return {
        column_head: [
          {
              title: '姓名',
              key: 'name',
              align:'center',
          },
          {
              title: '民族',
              key: 'nation',
              align:'center',
          },
          {
              title: '身份证号',
              key: 'idCard',
              align:'center',
          },
          {
              title: '手机号',
              key: 'mobile',
              align:'center',
          },
          {
              title: '报名类型',
              key: 'signType',
              align:'center',
          },          
          {
              title: '课程/专业',
              key: 'signTargetName',
              align:'center',
          },
          {
              title: '学历',
              key: 'degree',
              align:'center',
          },
          {
              title: '课程/专业编号',
              key: 'signTargetId',
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
              key: 'province',
              align:'center',
          },
          {
              title: '入学时间',
              key: 'entranceAt',
              align:'center',
          },
          {
              title: '学校',
              key: 'schoolName',
              align:'center',
          },
          {
              title: '学校地址',
              key: 'address',
              align:'center',
          },
          {
              title: '操作',
              // key: 'secondYearPaymentStatus',
              align:'center',
              minWidth: 100,
              render: (h, params) => {
                console.log(params.row.payStatus)
                return h('div', [
                  h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small',
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                        click: (val) => {
                          
                        
                        }
                      }
                  }, '编辑'),
                  h('Button', {
                      props: {
                          type: 'error',
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
                  }, '删除'),
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
        isAddStudent: false,
      }

      }
    },
    mounted(){
      // 获取默认筛选条件
      
    },
    computed:{

      changeParmas(){
        this.parmas = {
          //分页信息
    
        };
        // this.getList(parmas);
      }
    },
    watch:{
      organization(curVal, oldVal){
        if(curVal){
          
        }else{
          this.siteList = this.siteList.splice(0,1);
        }
      },
      registrationType(curVal, oldVal){
        if(curVal){

        }else{
          this.courses = this.courses.splice(0,1);
        }
      }
    },
    methods: {


      // 交互代码
      // 新增学生
      addStudent(){
        this.dialogs.isAddStudent = true;
      },

      addStudentClose(){
        this.dialogs.isAddStudent = false;
      },
      // 导出学生
      exportStudent(){
        document.getElementById('excel-upload-input').click()
      },
      // 批量添加学生
      addAllstudent(){
        let parmas = this.column_data;
        this.$ajaxPost(urls.ADDSTUDENTEXT,parmas).then(res => {
          if(res){
            this.$message.success('添加成功')
          }          
        })
      },

      handkeFileChange (e) {
        debugger
        // this.loading = true
        const files = e.target.files
        const itemFile = files[0] // only use files[0]
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const fixedData = this.fixdata(data)
          const workbook = XLSX.read(btoa(fixedData), {type: 'base64'})
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.get_header_row(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          
          this.generateDate({header, results})
          document.getElementById('excel-upload-input').value = ''
        }
        reader.readAsArrayBuffer(itemFile)
      },
      generateDate ({header, results}) {
        let new_result = [];
        results.forEach(item => {
          new_result.push(comUtil.dealExcelHeaders(item,this.column_head));
        })
        // results = comUtil.dealExcelHeaders(results,this.column_head);
        this.column_data = new_result;
        // debugger
        // this.excelData.header = header
        // this.excelData.results = comUtil.dealExcelHeaders(results,column_head);
        // debugger
        // this.loading = false
        // for (let i in this.excelData.results) {
        //   this.excelData.results[i].isWrite = true
        //   this.batch.push(this.excelData.results[i])
        // }
        // this.hasEditBatch = false
      },      
      fixdata (data) {
        let o = ''
        let l = 0
        const w = 10240
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },
      get_header_row (sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          var cell = sheet[XLSX.utils.encode_cell({c: C, r: R})]
          /* find the cell in the first row */
          var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },

    },
    components:{
      addStudent
    }
  }
</script>
