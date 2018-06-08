
<!--
 * @Author:      changh
 * @DateTime:    2018-06-07
 * @Description: 转站点
 -->

<template>
<div>
  <Modal
    class-name="vertical-center-modal changeMobile"
    title="转站点"
    width='350'
    v-model="isChangeMobile"
    @on-cancel='close'>
    <div class="mobiles">原手机号：<span style="margin-left: 10px">{{studentInfo.mobile}}</span></div>

    <Form ref="formDynamic" :model="formDynamic" :rules="ruleValidate"  :label-width="100" >
      <FormItem label="新手机号" prop="newMobile">
        <Input v-model="formDynamic.newMobile" placeholder="请输入手机号码"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button size="large"  @click="close">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit('formDynamic')">确定</Button>
    </div>
  </Modal>
</div>
</template>
<style lang='less' scoped>
  .mobiles{
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #333;
    padding-left: 39px;
  }

</style>



<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  import verification from '@Util/verification';
  export default {
    props : ['studentInfo'],
    data () {
      return {
        isChangeMobile: true,
        
        formDynamic: {
          newMobile: '',
        },
        ruleValidate: {                  
          newMobile: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: verification.validator_mobile, trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){

    },
    methods: {
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$ajaxPostForm(urls.CHANGEMOBILE,this.formDynamic).then(res => {
                  if(res.body == true){
                    this.$message.success('修改手机号成功')
                    this.close();
                  }          
                })  
            }
        })
        
      },
      close(){
        this.isChangeMobile = false;
        this.$emit('mobileClose');
      }
    }
  }
</script>


