<!--
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 登陆界面
 -->
<template>
  <div class="login">
      <div class="login_content">
        <div class="login_title">
          <i class="ivu-icon ivu-icon-log-in"></i>
          欢迎登录
        </div>
        <i-form ref="loginForm" :model="form" :rules="rules" inline>
          <Form-item prop="userName" class="login_form_item">
              <i-input type="text" v-model="form.userName" placeholder="请输入帐号">
                  <Icon type="ivu-icon ivu-icon-person" slot="prepend"></Icon>
              </i-input>
          </Form-item>
          <Form-item prop="password" class="login_form_item">
              <i-input type="password" v-model="form.password" placeholder="请输入密码">
                  <Icon type="ivu-icon ivu-icon-locked" slot="prepend"></Icon>
              </i-input>
          </Form-item>
          <Form-item class="login_form_item">
              <i-button type="primary" @click="handleSubmit()">登录</i-button>
          </Form-item>
        </i-form>
      </div>
  </div>
</template>
<script>
import {urls} from '@Util/axiosConfig';
import comUtil from '@Util/comUtil';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      form: {
        userName: "changh",
        password: "123456"
      },
      rules: {
        userName: [{ required: true, message: "帐号不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted(){
    let tags = [
    {
      meta: {title: '首页'},
      path: '/home', 
      name: 'home'
    }
  ]
    this.$store.commit('common/setRouteTags', tags)
  },
  computed: {
    ...mapState({
      // 区域option，从vuex中获取
      // countLocalState(state){
      //   this.region.options = state.common.regionOptions;
      // }
    }),
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return false
        }
        let parmas = {
          username: this.form.userName,
          password: this.form.password
        }
        
        let login = this.$ajaxPost(urls.LOGIN, parmas);        
        if(login){
          login.then((res) =>{
            if(res){
              // 存cookie
              Cookies.set('hxbToken', res.body.token);
              // 基本信息存vuex
              this.$store.commit('login/setUserInfo', res.body);
              this.getStudentList();
            }
          }).catch(error => {
            console.log(error)
          })
        }

      });
    },
    // 获取学生列表
    getStudentList () {
      
      this.$ajaxPost(urls.GET_STUDENT_LIST).then(res => {
        // 当前账户的学生列表存vuex
        this.$store.commit('common/setStudentList', res.body);
        // this.$store.state.studentList = response.data.body
        // localStorage.setItem('studentList', JSON.stringify(response.data.body))
        // this.getMenu()
        // this.getNickNameAndAvatarInIm(response.data.body)
        this.getMenu()       
        
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取左侧导航菜单
    getMenu() {
      this.$ajaxGet(urls.GET_MENU).then(res => {
        this.$store.commit('common/setMenu', res.body);
        this.$router.push({name:'home'});
      }).catch(error => {
        console.log(error)
      })
    },
  }
};
</script>

