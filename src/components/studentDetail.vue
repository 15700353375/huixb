<!--
 * @Author:      changh
 * @DateTime:    2018-06-08
 * @Description: 学生信息-详情弹窗
 -->

<template>
   <div>     
      <Modal scrollable title="学生详情" v-model="student_datail" class-name="studentDetail" @on-cancel='close' width='1055'>
        <div class="student_content clearfix">
          <div class="studentInfo clearfix">
            <h2>个人信息</h2>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">姓名:</div>
              <div class="studentInfo_item_right">{{studentInfo.name}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">身份证:</div>
              <div class="studentInfo_item_right">{{studentInfo.idCard}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">民族:</div>
              <div class="studentInfo_item_right">{{studentInfo.nation}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">专业:</div>
              <div class="studentInfo_item_right">{{studentInfo.majorName}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">层次:</div>
              <div class="studentInfo_item_right">{{studentInfo.degree}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">第一年缴费情况:</div>
              <div class="studentInfo_item_right">{{studentInfo.firstYearPaymentStatus}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">第二年缴费情况:</div>
              <div class="studentInfo_item_right">{{studentInfo.secondYearPaymentStatus}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">班主任:</div>
              <div class="studentInfo_item_right">{{studentInfo.teacherName}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">电话:</div>
              <div class="studentInfo_item_right">{{studentInfo.mobile}} </div>
            </div>
            <div class="studentInfo_item">
              <div class="studentInfo_item_left">汇学邦账号:</div>
              <div class="studentInfo_item_right">{{studentInfo.isBindIdCard}} </div>
            </div>
          </div>
          <div>
            <h2>学习情况</h2>
            <Table border height="480" stripe :columns="studyTitle" :data="courseList"></Table>
          </div>
        </div>
    </Modal>
   </div>
</template>

<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  
  export default {
    props: ['studentItem'],
    data() {
      return {
        student_datail: true,
        courseList: [],
        studentInfo: {},
        studyTitle: [
                    {
            title: '课程',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '视频进度总和',
            key: 'videoTotalProgress',
            align: 'center',
            render: (h, params) => {
              if (params.row.videoTotalProgress === 0) {
                return h('span', '-')
              } else {
                // return h('span', (Math.floor(parseFloat(params.row.videoTotalProgress * 100) * 100) / 100) + '%')
                return h('span', Number(params.row.videoTotalProgress * 100).toFixed(1) + '%')
              }
            }
          },
          {
            title: '已掌握',
            key: 'exercisesMasterNum',
            align: 'center',
            render: (h, params) => {
              if (params.row.exercisesMasterNum === 0) {
                return h('span', '-')
              } else {
                return h('span', params.row.exercisesMasterNum)
              }
            }
          },
          {
            title: '未掌握',
            key: 'exercisesNotMasterNum',
            align: 'center',
            render: (h, params) => {
              if (params.row.exercisesNotMasterNum === 0) {
                return h('span', '-')
              } else {
                return h('span', params.row.exercisesNotMasterNum)
              }
            }
          },
          {
            title: '待强化',
            key: 'exercisesStrengthenNum',
            align: 'center',
            render: (h, params) => {
              if (params.row.exercisesStrengthenNum === 0) {
                return h('span', '-')
              } else {
                return h('span', params.row.exercisesStrengthenNum)
              }
            }
          },
          {
            title: '已消灭',
            key: 'exercisesKillNum',
            align: 'center',
            render: (h, params) => {
              if (params.row.exercisesKillNum === 0) {
                return h('span', '-')
              } else {
                return h('span', params.row.exercisesKillNum)
              }
            }
          },
          {
            title: '主观题',
            key: 'exercisesUnknowNum',
            align: 'center',
            render: (h, params) => {
              if (params.row.exercisesUnknowNum === 0) {
                return h('span', '-')
              } else {
                return h('span', params.row.exercisesUnknowNum)
              }
            }
          }
        ],
        courseList: []
      }
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,
    
    }),
    mounted(){
      this.getDetail();

    },
    methods: {

      getDetail(){
        let parmas = {
          idCard: this.studentItem.idCard,
          signTargetId: this.studentItem.signTargetId,
          type: this.studentItem.signTypeValue,
          uid: this.studentItem.uid,
        };
        this.$ajaxPost(urls.FINDSTUDENTINFOBYIDCARDANDSIGNTARGETID, parmas).then(res => {
          if(res){
            this.studentInfo = res.body.studentInfo;
            this.courseList = res.body.courseList;
          }          
        })  
      },
      close(){
        this.student_datail = false;
        this.$emit('detailClose');
      }

    },
    components: {

    }
  }

</script>



