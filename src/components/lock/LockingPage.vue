<!--
 * @Author:      changh
 * @DateTime:    2018-06-02
 * @Description: 屏幕锁定
 -->

<template>
  <div id="lockingPage">
    <div class="unlock-con">
      <transition name="show-unlock">
        <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
          <div @click="handleClickAvatar" class="unlock-avatar-con" :style="{marginLeft: avatarLeft}">
            <img class="unlock-avatar-img" :src="avatarPath">
            <div class="unlock-avatar-cover">
              <span><Icon type="unlocked" :size="30"></Icon></span>
              <p>解锁</p>
            </div>
          </div>
          <div class="unlock-avatar-under-back" :style="{marginLeft: avatarLeft}"></div>
          <div class="unlock-input-con">
            <div class="unlock-input-overflow-con">
              <div class="unlock-overflow-body" :style="{right: inputLeft}">
                <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码"/>
                <button ref="unlockBtn" @mousedown="unlockMouseDown" @mouseup="unlockMouseUp" @click="handleUnlock" class="unlock-btn">
                  <Icon color="white" type="key"></Icon>
                </button>
              </div>
            </div>
          </div>
          <div class="unlock-locking-tip-con">已锁定</div>
        </div>
      </transition>
    </div>
  </div>
</template>


<script>
  import Cookies from 'js-cookie'

  export default {
    name: 'lockingPage',
    components: {
      
    },
    data () {
      return {
        avatarLeft: '0px',
        inputLeft: '400px',
        password: '',
        check: null,
        showUnlock: true,
        avatarPath: '',
      }
    },
    computed: {

    },
    mounted(){
      this.avatarPath = JSON.parse(localStorage.getItem('hxb_userInfo')).avatar;
      
    },
    methods: {
      validator () {
        if(this.password == '666666'){
          return true  // 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
        }
        
      },
      handleClickAvatar () {
        this.avatarLeft = '-180px'
        this.inputLeft = '0px'
        this.$refs.inputEle.focus()
      },
      handleUnlock () {
        if (this.validator()) {          
          this.password = ''
          this.$router.push({name: 'home'});
        } else {
          this.$message.error('密码错误,请重新输入。如果忘了密码，清除浏览器缓存重新登录即可，这里没有做后端验证')
        }
      },
      unlockMouseDown () {
        this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn'
      },
      unlockMouseUp () {
        this.$refs.unlockBtn.className = 'unlock-btn'
      }
    }
  }
</script>


