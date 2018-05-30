<!--
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: topbar以及内容区域
 -->

<template>
  <div class="mainRight">
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
            <Dropdown>
              <a href="javascript:void(0)">
                  {{userInfo.name}}
                  <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                  <DropdownItem>个人中心</DropdownItem>
                  <DropdownItem>退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="header-button">
            <img class="userImg" :src="userInfo.avatar" alt="">
          </div>
        </div>
      </div>
      <!-- <div class="bread">
        <div class="bread_main">
          <div class="bread_con" :style="{left: tagLeft + 'px'}">
            <Tag type="dot" closable 
                :color="$route.name ==item.name ? 'blue' : ''" 
                v-for="(item, index) in routeTags" 
                :key="index"
                @on-close='closeTag(item)'>
              {{item.meta.title}}
            </Tag>
          </div>
        </div>
        <Dropdown class="tag_oper">
            <Button type="primary" size="small">
                标签选项
                <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem>关闭所有</DropdownItem>
                <DropdownItem>关闭其它</DropdownItem>
            </DropdownMenu>
        </Dropdown>
      </div> -->
      <breadTags></breadTags>
    </div>

    <div class="content">
      <!-- <div>11111111111111{{routeCurrent}}</div> -->
      <router-view></router-view>
    </div>

    <!-- 个人信息 -->
    <chat v-if="dialogs.chat">
    </chat>

  </div>
</template>

<script>
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
        messageCount: 0,
        tagLeft: 0,

        littleNav: false,
        dialogs: {
          chat: true,
        }
      }
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,

      // 面包屑
      routeCurrent: state => state.common.routeBread,


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
      // debugger
      // this.$store.commit('common/setRouteTags',this.tags)
      
      
      screenFull.on('change', () => {
        this.isFullScreen = screenFull.isFullscreen
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
        getRecentContactList()
        if (this.$store.state.chat.chatModel) {
          this.$store.state.chat.chatModel = false
        }
        this.$store.state.chat.chatModel = true
      },



    },
    components: {
      breadTags,
      chat
    }
  }

</script>



