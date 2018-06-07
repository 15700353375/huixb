
<!--
 * @Author:      changh
 * @DateTime:    2018-06-07
 * @Description: 转站点
 -->

<template>
<Modal
    class-name="vertical-center-modal"
    title="转站点"
    v-model="isChangeSite"
    @on-ok='changeSite'>
    <Select v-model="currentSite" style="width:200px">
      <Option v-for="item in siteList" :value="item.siteId" :key="item.siteId">{{ item.siteName }}</Option>
    </Select>
</Modal>
</template>


<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  export default {
    props : ['siteList', 'studentInfo'],
    data () {
      return {
        isChangeSite: true,
        currentSite: '',
      }
    },
    computed: {

    },
    mounted(){
      debugger
    },
    methods: {
      changeSite(){
        let currentSite = this.currentSite;
        
        if(!currentSite){
          this.$message.warning('请选择老师')
          return;
        }
        let ind = _.findIndex(this.classTeacherList, function(item) { return item.uid == currentSite });
        if(ind == -1) return;
        let parmas = {
          idCard: this.studentInfo.idCard,
          signTargetId: this.studentInfo.signTargetId,
          teacherId: this.classTeacherList[ind].uid,        
        }
        this.$ajaxPostForm(urls.UPDATETEACHERID,parmas).then(res => {
          if(res.body == 'true'){
            this.$message.success('转班成功')
          }          
        })
      },
    }
  }
</script>


