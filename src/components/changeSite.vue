
<!--
 * @Author:      changh
 * @DateTime:    2018-06-07
 * @Description: 转站点
 -->

<template>
<div v-if="isChangeSite">
  <Modal
    class-name="vertical-center-modal"
    title="转站点"
    width='350'
    v-model="isChangeSite"
    @on-cancel='close'>
    <Select v-model="currentSite" style="width:200px">
      <Option v-for="item in siteList" :value="item.siteId" :key="item.siteId">{{ item.siteName }}</Option>
    </Select>
    <div slot="footer">
        <Button size="large"  @click="close">取消</Button>
        <Button type="primary" size="large"  @click="changeSite">确定</Button>
    </div>
  </Modal>
</div>
</template>


<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  export default {
    props : ['studentInfo'],
    data () {
      return {
        isChangeSite: true,
        currentSite: '',
        siteList: [],
      }
    },
    computed: {

    },
    mounted(){
      this.getSite();
    },
    methods: {
      getSite(){
        let parmas ={
          schoolId: Number(this.studentInfo.organizationId)
        } 
        
        this.$ajaxPostForm(urls.GETSITELIST,parmas).then(res => {
          if(res){
            this.siteList = res.body;    
          }               
        })
      },
      changeSite(){
        let currentSite = this.currentSite;
        if(!currentSite){
          this.$message.warning('请选择站点')
          return;
        }
        let parmas = {
          idCard: this.studentInfo.idCard,
          signTargetId: this.studentInfo.signTargetId,
          siteId: this.currentSite,        
        }
        this.$ajaxPost(urls.CHANGESTUDENTSITE,parmas).then(res => {
          if(res.body == true){
            this.$message.success('转站点成功')
            this.close();
          }          
        })
      },
      close(){
        this.isChangeSite = false;
        this.$emit('siteClose');
      }
    }
  }
</script>


