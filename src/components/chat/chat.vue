<!--
 * @Author:      changh
 * @DateTime:    2018-05-28
 * @Description: 聊天弹窗
 -->

<template>
   <div>
     
      <Modal scrollable v-model="modal2" class-name="chat" width='1055'>
        <!-- <p slot="header" style="color:#f60;text-align:center">
          
        </p> -->
        <div class="chat_content">
          
          <div>
            <span class="chat_close ivu-icon ivu-icon-close-round" @click="close"></span>
            <Tabs :value="currentChatNav" @on-click='changeChat'>
              <TabPane label="最近联系人" name="1">
                <RecentContact v-if="currentChatNav == '1'"></RecentContact>
              </TabPane>
              <TabPane label="学生列表" name="2">
                <StudentList v-if="currentChatNav == '2'" @studentChat='studentChat'></StudentList>
              </TabPane>
              <TabPane label="通知" name="3">
                <notification v-if="currentChatNav == '3'"></notification>
              </TabPane>
              <TabPane label="群发列表" name="4">
                <groupMessageList v-if="currentChatNav == '4'"></groupMessageList>
              </TabPane>
          </Tabs>
          </div>
        </div>
    </Modal>
   </div>
</template>

<script>
  import { mapState } from 'vuex';
  import RecentContact from '@Components/chat/RecentContact';
  import StudentList from '@Components/chat/StudentList';
  import notification from '@Components/chat/notification';
  import groupMessageList from '@Components/chat/groupMessageList';
  
  export default {
    data() {
      return {
        modal2: true,
        modal_loading: false,
        currentChatNav: '1',
        theme1: 'light',

        currentId: 2,

        tags: [
          {
            meta: {title: '首页'},
            path: '/home', 
            name: 'home'
          }
        ]
      }
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,
      // 打开的页面
      routeTags: state => state.common.routeTags,

      

    }),
    mounted(){
      
      let bread = $('.bread').width();
      if($('.ivu-tag').length * 110 > bread){
        this.tagLeft = -($('.ivu-tag').length * 110 - bread)
      }


    },
    methods: {

      changeChat(event){
        
        this.currentChatNav = event;
      },
      close(){
        this.$store.state.chat.selToID = '';
        this.$emit('close')
      },
      studentChat(){
        this.currentChatNav = '1';
      }

    },
    components: {
      RecentContact,
      StudentList,
      notification,
      groupMessageList
    }
  }

</script>



