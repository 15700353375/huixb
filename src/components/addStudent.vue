
<!--
 * @Author:      changh
 * @DateTime:    2018-06-08
 * @Description: 添加学生
 -->

<template>
<div v-if="isAddstudent">
  <div class="displayNone">{{signTypeChange}}</div>
  <Modal
    class-name="vertical-center-modal addStudent"
    title="新增学生"
    width='600'
    v-model="isAddstudent"
    @on-cancel='close'>

    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="民族" prop="nation">
            <Select v-model="formValidate.nation" placeholder="请选择民族">
                <Option v-for="item in nationList" :value="item.value" :key="item.value">{{ item.value }}</Option>
            </Select>
        </FormItem>
        <FormItem label="学历" prop="degree">
            <Select v-model="formValidate.degree" placeholder="请选择学历">
                <Option v-for="item in degreeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
            <Input v-model="formValidate.mobile" placeholder="请输入手机号码"></Input>
        </FormItem>
        <FormItem label="批次" prop="batchNo">
            <Select v-model="formValidate.batchNo" placeholder="请选择批次">
                <Option v-for="item in batchNoList" :value="item" :key="item">{{ item }}</Option>
            </Select>
        </FormItem>
        <FormItem label="身份证号" prop="idCard">
            <Input v-model="formValidate.idCard" placeholder="请输入身份证号"></Input>
        </FormItem>
        <FormItem label="报名类型" prop="signType">
            <Select v-model="formValidate.signType" placeholder="请选择报名类型">
                <Option v-for="item in signTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem :label="signTypeList[formValidate.signType - 1].label" prop="signTargetId">
            <Select v-model="formValidate.signTargetId" placeholder="请选择报名类型">
                <Option v-for="item in signTargetList" :value="item.no" :key="item.no">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="报读类型" prop="applyType">
            <Select v-model="formValidate.applyType" placeholder="请选择报读类型">
                <Option v-for="item in applyTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="学校" prop="schoolName">
            <Input v-model="formValidate.schoolName" placeholder="请输入学校"></Input>
        </FormItem>        
        <FormItem label="入学时间" class="timers" prop="entranceAt">
            <DatePicker type="date" placeholder="选择时间" v-model="formValidate.entranceAt"></DatePicker>
        </FormItem>
        <FormItem label="省份" prop="province">
            <Input v-model="formValidate.province" placeholder="请输入省份"></Input>
        </FormItem> 
        <FormItem label="学校地址" prop="address">
            <Input v-model="formValidate.address" placeholder="请输入学校地址"></Input>
        </FormItem> 
    </Form>
    
    <div slot="footer">
        <Button size="large"  @click="close">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit('formValidate')">确定</Button>
    </div>
  </Modal>
</div>
</template>


<script>
  import { urls } from '@Util/axiosConfig';
  import { nationList, degreeList, signTypeList, applyTypeList } from '@Util/const';
  import verification from '@Util/verification';
  import { mapState } from 'vuex';

  export default {
    data () {
      return {
        isAddstudent: true,
        nationList: nationList,
        degreeList: degreeList,
        batchNoList: [],
        signTypeList: signTypeList,
        signTargetList: [],
        applyTypeList: applyTypeList,
        formValidate: {
            name: '',
            nation: '',
            degree: '',
            mobile: '',
            batchNo: '',
            idCard: '',
            signType: 1,
            signTargetId: '',
            applyType: '',
            schoolName: '',
            entranceAt: '',
            province: '',
            address: '',
        },
        ruleValidate: {
          name: [
              { required: true, message: "姓名不能为空", trigger: "blur" },
              {
                type: "string",
                min: 2,
                max: 6,
                message: "姓名长度在2到6位",
                trigger: "blur"
              }
          ],
          nation: [
              { required: true, message: "请选择民族", trigger: "change" }
          ],
          degree: [
              { required: true, type: 'number', message: "请选择学历", trigger: "change" }
          ],                    
          mobile: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: verification.validator_mobile, trigger: 'blur' }
          ],
          batchNo: [
              { required: true, message: "请选择批次号", trigger: "change" }
          ],                    
          idCard: [
              { required: true, message: '请输入身份证号', trigger: 'blur' },
              { validator: verification.validator_idCard, trigger: 'blur' }
          ],
          signType: [
              { required: true, type: 'number', message: "请选择报名类型", trigger: "change" }
          ], 
          signTargetId: [
              { required: true, message: "请选择名称", trigger: "change" }
          ], 
          applyType: [
              { required: true, type: 'number', message: "请选择报读类型", trigger: "change" }
          ], 
          schoolName: [
              { required: true, message: '请输入学校', trigger: 'blur' },
          ],
          entranceAt: [
              { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
          ],
          province: [
              { required: true, message: '请输入省份', trigger: 'blur' },
          ],
          address: [
              { required: true, message: '请输入地址', trigger: 'blur' },
          ],
        }
      }
    },
    computed: {
      signTypeChange(){
        let sign = this.formValidate.signType
        this.getCourses(sign)
      }
    },
    mounted(){
      this.getBatch();
    },
    methods: {            
      // 获取批次号
      getBatch(){
        this.$ajaxPost(urls.GETBATCHLIST).then(res => {
          if(res){
            this.batchNoList = res.body;  
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
            this.signTargetList = res.body;     
          }   
        })
      },     
      // 点击确定-验证
      handleSubmit (name) {
         console.log(this.formValidate)
          this.$refs[name].validate((valid) => {
              if (valid) {
                 this.formValidate.entranceAt = Moment(this.formValidate.entranceAt).format('YYYY-MM-DD');
                 this.addStudent(this.formValidate)
              }
          })
      },
      // 添加学生，请求后台
      addStudent(parma){
        let parmas = [];
        parmas.push(parma)
        this.$ajaxPost(urls.ADDSTUDENTEXT,parmas).then(res => {
          if(res){
            this.$message.success('添加成功')
            this.close();
          }          
        })
      },

      close(){
        this.isAddstudent = false;
        this.$emit('addStudentClose');
      }
    }
  }
</script>


