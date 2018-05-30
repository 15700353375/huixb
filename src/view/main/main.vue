<!--
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 进入平台主页面
 -->

<template>
  <div id="vueRouter">
  <!--   <alert type="success" >
      <p>You successfully read this important alert message.</p>
    </alert>
    <bs-input :value.sync="keywords" label="Username" help="Only allows lowercase letters and numbers." error="Insert username" placeholder="Username can't start with a number." pattern="^[a-z][a-z0-9]+$" :mask="mask" :minlength="minLen" required icon></bs-input> -->

    <!-- 左侧导航 -->
    <NavMenuVue></NavMenuVue>

    <!-- 顶部导航 -->
    <TopbarVue></TopbarVue>
  </div>
</template>

<script>
  import NavMenuVue from '@Components/NavMenuVue';
  import { mapState } from 'vuex';
  import TopbarVue from '@Components/TopbarVue';
  export default {
    data(){
      return {
        keywords: '',
        minLen: 5,

      }
    },
    mounted(){
      console.log(this.$store.state.common.studentList)
      // debugger
    },
    methods: {
      mask: function (value) {
        // change to lowercase, remove up to the first letter, and then remove all other unsuported characters
        return value.toLowerCase().replace(/^[^a-z]+/,'').replace(/[^a-z0-9]/g,'');
      }
    },
    components:{
      NavMenuVue,
      TopbarVue
    }
  }
</script>
