<template>
  <div class="chat_box">
    <Form class="notification" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="标题" prop="title">
            <Input v-model="formValidate.title" placeholder="请输入通知标题"></Input>
        </FormItem>        
        <FormItem label="内容" prop="msg">
            <Input v-model="formValidate.msg" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入通知内容"></Input>
        </FormItem>
        <FormItem label="链接" prop="link">
            <Input v-model="formValidate.link" placeholder="请输入链接"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">发送</Button>
        </FormItem>
    </Form>

  </div>
</template>

<script>
import { mapState } from "vuex";
import {urls} from '@Util/axiosConfig';
export default {
    data() {
        return {
          formValidate: {
              title: '',
              link: '',
              msg: '',
              type: 1,
          },
          ruleValidate: {
              title: [
                  { required: true, message: '标题不能为空', trigger: 'blur' }
              ],
              link: [
                  { type: 'string', pattern:/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/, message: '格式不正确', trigger: 'blur' }
              ],
              msg: [
                  { required: true, message: '内容不能为空', trigger: 'blur' },
              ]
          }

        };
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,
    }),
    mounted() {
      
    },
    methods: {
      handleSubmit (name) {
          this.$refs[name].validate((valid) => {
              if (valid) {

                this.$ajaxPost(urls.MSENDMESSAGE, this.formValidate).then(res => {
                  this.$message.success('消息发送成功');
                }).catch(error => {
                  this.$message.error(error);
                })
                  
              } else {
                  return;
              }
          })
      },

    },
    components: {

    }
};
</script>
