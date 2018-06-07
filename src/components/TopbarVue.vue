<!--
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: topbar以及内容区域
 -->

<template>
  <div class="mainRight">
    <div class="displayNone">{{imState}}</div>
    <div class="topBar">
      <div class="menue">
        <div class="navChange">
          <i v-if="!littleNav" class="ivu-icon ivu-icon-navicon" @click="changeNav(true)"></i>
          <i v-if="littleNav" class="ivu-icon ivu-icon-navicon" style="transform: rotate(90deg);" @click="changeNav(false)"></i>
        </div>
        <div class="bread_top">
          <Breadcrumb>
            <BreadcrumbItem to="/home">首页</BreadcrumbItem>
            <BreadcrumbItem v-if="routeCurrent.parent">{{routeCurrent.parent}}</BreadcrumbItem>
            <BreadcrumbItem v-if="routeCurrent.title">{{routeCurrent.title}}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="pull-right">
          <div @click="screenChange" v-if="showFullScreenBtn" class="header-button">
            <Tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
              <Icon :type="isFullScreen ? 'jt-arrow-shrink' : 'jt-arrow-expand'" :size="20"></Icon>
            </Tooltip>
          </div>
          <div @click="lockScreen" class="header-button">
            <Tooltip content="锁屏" placement="bottom">
              <Icon type="jt-lock" :size="20"></Icon>
            </Tooltip>
          </div>
          <div @click="showMessage" class="header-button">
            <Tooltip :content="messageCount > 0 ? '有' + messageCount + '条未读消息' : '无未读消息'" placement="bottom" style="height: 22px;">
              <Badge :count="messageCount" dot>
                <Icon type="jt-bell" :size="20" style="margin-top:-10px;"></Icon>
              </Badge>
            </Tooltip>
          </div>
          <div class="header-button">
            <Dropdown @on-click='operUser'>
              <a href="javascript:void(0)">
                  {{userInfo.name}}
                  <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                  <DropdownItem name='personal'>个人中心</DropdownItem>
                  <DropdownItem name='exit'>退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="header-button">
            <img class="userImg" :src="userInfo.avatar" alt="">
          </div>
        </div>
      </div>
      <breadTags></breadTags>
    </div>

    <div class="content">
      <router-view></router-view>
    </div>

    <!-- 个人信息 -->
    <chat v-if="dialogs.chat" @close='closeChat'></chat>

  </div>
</template>

<script>
import {urls} from '@Util/axiosConfig';
  import screenFull from 'screenfull'
  //加载相关依赖
  import breadTags from '@Components/breadTags';
  import chat from '@Components/chat/chat';
  import { mapState } from 'vuex';

  export default {
    props: ['navData'],
    data() {
      return {
        isFullScreen: screenFull.isFullscreen,
        showUnlock: false,
        // messageCount: 0,
        tagLeft: 0,

        littleNav: false,
        messageCount: 0,
        dialogs: {
          chat: false,
        }
      }
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,

      // messageCount: state => state.chat.messageCount,

      // 面包屑
      routeCurrent: state => state.common.routeBread,

      // imchange
      imState(state){
        // 最近会话
        if(state.chat.messageCount != null){
          this.messageCount = state.chat.messageCount;
          
        }
        
          
      },

      showFullScreenBtn () {
        return window.navigator.userAgent.indexOf('MSIE') < 0 && screenFull.enabled
      }
    }),
    mounted(){
      let bread = $('.bread').width();
      if($('.ivu-tag').length * 110 > bread){
        this.tagLeft = -($('.ivu-tag').length * 110 - bread)
      }
      console.log(this.$store.state.common)
      // 页面刷新--将最近联系人设置为空，否则未读消息数有问题，因为vuex有时候刷新了之后数据并没有丢失
      // debugger
      // this.$store.commit('common/setRouteTags',this.tags)
      
      
      screenFull.on('change', () => {
        this.isFullScreen = screenFull.isFullscreen
      })

      this.$nextTick(()=>{
        let hei = document.body.clientHeight - 100;
        $('.content').height(hei)
        
      })


    },
    methods: {
      screenChange () {
        if (!screenFull.enabled) {
          this.$Message.warning({content: 'you browser can not work'})
          return false
        }
        screenFull.toggle()
      },
      lockScreen () {
        this.showUnlock = true
        Cookies.set('last_page_name', this.$route.name)
        setTimeout(() => { this.$router.push({name: 'locking'}) }, 800)
        Cookies.set('locking', '1')
      },
      handleUnlock () {
        this.showUnlock = false
        this.$router.push({name: Cookies.get('last_page_name')})
      },
      showMessage () {
        // debugger
        this.dialogs.chat = !this.dialogs.chat;
        // getRecentContactList()
        // if (this.$store.state.chat.chatModel) {
        //   this.$store.state.chat.chatModel = false
        // }
        // this.$store.state.chat.chatModel = true
      },
      closeChat(){
        // debugger
        this.dialogs.chat = !this.dialogs.chat;
      },

      // 操作个人信息
      operUser(name){
        // 退出
        if(name == 'exit'){
          this.goOut();
        }
        // 个人中心
        if(name == 'personal'){

        }
      },
      goOut(){
        let exit = this.$ajaxGet(urls.EXIT)
        
        exit.then(res => {
            Cookies.remove('hxbToken');
            this.$router.push({name: 'login'});
          }).catch(error => {
            this.$message.error(error)
          })
      }
    },
    components: {
      breadTags,
      chat
    }
  }

</script>



