
<!--
 * @Author:      changh
 * @DateTime:    2018-06-07
 * @Description: 转班
 -->

<template>
<div v-if="isChangeClass">
  <Modal
    class-name="vertical-center-modal"
    title="转班"
    width='350'
    v-model="isChangeClass"
    @on-cancel='close'>
    <Select v-model="currentClass" style="width:200px">
      <Option v-for="item in classTeacherList" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
    </Select>
    <div slot="footer">
        <Button size="large"  @click="close">取消</Button>
        <Button type="primary" size="large"  @click="changeClass">确定</Button>
    </div>
</Modal>
</div>
</template>


<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  export default {
    props : ['classTeacherList', 'studentInfo'],
    data () {
      return {
        isChangeClass: true,
        currentClass: '',
      }
    },
    computed: {

    },
    mounted(){
      
    },
    methods: {

      changeClass(){
        let currentClass = this.currentClass;
        
        if(!currentClass){
          this.$message.warning('请选择老师')
          return;
        }
        let ind = _.findIndex(this.classTeacherList, function(item) { return item.uid == currentClass });
        if(ind == -1) return;
        let parmas = {
          idCard: this.studentInfo.idCard,
          signTargetId: this.studentInfo.signTargetId,
          teacherId: this.classTeacherList[ind].uid,        
        }
        this.$ajaxPostForm(urls.UPDATETEACHERID,parmas).then(res => {
          if(res.body == true){
            this.$message.success('转班成功')
            this.$emit('classClose')    
          }     
           
        })
        // this.$emit('classClose')
      },
      close(){
        this.isChangeClass = false;
        this.$emit('classClose');
      }
    }
  }
</script>


