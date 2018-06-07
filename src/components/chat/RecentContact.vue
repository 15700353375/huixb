<template>
  <div class="chat_box">
    <div class="displayNone">{{chatList}} {{recentSess}} {{getSessionItem}} {{picBox}} {{changeSelToID}} {{changeChat}}</div>
    <div class="chat_left">
      <div class="chat_left_tit">
        最近联系人
      </div>
      <div class="chat_left_search">
        <Select filterable clearable :autochange="true" style="width: 100%;text-align: left;" @on-change="showChange">
          <Option v-for="(item,index) in SessionItem" :value="item.SessionId" :key="index">{{ item.nickName }}</Option>
        </Select>
      </div>
      <ul class="chat_left_list scrollStyle">
        <li v-for="(item,index) in SessionItem" v-bind:class="{ active: selToID == item.SessionId }" :key="index" @click='gochat(item)'>
          <div class="chat_item">
            <Badge :count="item.UnreadMsgCount">
              <img :src="item.SessionImage || 'http://rep.hanlinhx.com/images/default/avatar.jpg?x-oss-process=image/resize,m_mfit,h_100,w_100'" alt="">
            </Badge>
            <div class="people_con">
              <div class="popple_top">
                <span class="people_name">{{item.nickName}}</span>
                <span class="people_timer">{{comUtil.dealChatTime(item.MsgTimeStamp)}}</span>
              </div>
              <div class="people_bottom text-ellipsis" >
                {{item.MsgShow}}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="chat_right">
      <!-- 未选择联系人 -->
      <div v-if="!inChat" class="chat_right_tit">
        请选择联系人会话......
      </div>
      <!-- 选择了联系人 -->
      <div v-if="inChat">
        <div class="chat_right_tit">
          {{currentChatInfo.nickName}}
        </div>
        <div class="inChat_box scrollStyle">
          <div class="inChat_list">
            <div class="clearfix" v-for="(item,index) in msgList" :key="index">
              <div v-if="item.isSend == false" class="inChat_list_item clearfix">
                <div class="inChat_left"><img :src="currentChatInfo.SessionImage || 'http://rep.hanlinhx.com/images/default/avatar.jpg?x-oss-process=image/resize,m_mfit,h_100,w_100'" alt=""></div>
                <div class="inChat_right ">
                  <div class="inChat_text" v-html='item.message'></div>
                  <div class="inChat_time">{{item.time}}</div>
                </div>
              </div>
              <div v-if="item.isSend == true" class="inChat_list_item inChat_list_item2 clearfix">
                <div class="inChat_left"><img :src="userInfo.avatar" alt=""></div>
                <div class="inChat_right">
                  <div class="inChat_text" v-html='item.message'></div>
                  <div class="inChat_time">{{ item.time}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="input_box">
          <div class="input_menu" v-clickoutside>
            <a class="chat02_title_btn ctb01" title="选择表情" @click="showEmotion"></a>
            <a class="chat02_title_btn ctb01 ctb02" title="选择图片" @click="selectPic"> </a>
            <div id="wl_faces_box" class="wl_faces_box">
                <div class="wl_faces_content">
                    <div class="title">
                        <ul>
                            <li class="title_name">常用表情</li>
                            <li class="wl_faces_close"><span class="ivu-icon ivu-icon-close" @click='turnoffFaces'></span></li>
                        </ul>
                    </div>
                    <div id="wl_faces_main" class="wl_faces_main">
                        <ul id="emotionUL">
                        </ul>
                    </div>
                </div>
                <div class="wlf_icon"></div>
            </div>
          </div>
          <textarea name="" id="" cols="30" rows="10" v-model='message'></textarea>
          <div class="inChat_send">
            <Button type="primary" @click="send()">
              <!-- <Icon type="android-send" style="margin-right: 5px;"> -->
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
    <sendPic v-if="sendPic"></sendPic>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deal_history_msg } from "@Util/chat/get_history_msg";
import { onSendMsg } from "@Util/chat/send_common_msg";
import { turnoffFacesBox, showEmotionDialog } from "@Util/chat/login";
import { selectPicClick, uploadPic, fileOnChange } from "@Util/chat/sendPic";
import comUtil from '@Util/comUtil';
import common  from '@Util/chat/common'
import {urls} from '@Util/axiosConfig';
import sendPic from '@Components/chat/sendPic';
import { initRecentContactList } from '@Util/chat/recent_contact_list_manager'
export default {
    data() {
        return {
            comUtil: comUtil,

            inChat: false,

            currentId: 2,

            recentSessMap: {},
            SessionItem: [],
            msgList: [],
            // 当前聊天对象的基本信息
            currentChatInfo: {
              SessionImage: ''
            },
            message: '',
            selToID: '',

            // 表情窗口
            emotionFlag: false,

            sendPic: false,

        };
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,
      
      
      picBox(state){
        
        this.sendPic= state.chat.sendPic;
      },

      // 聊天对象切换
      changeSelToID(state){

        this.selToID = state.chat.selToID;
        //   this.changeOrder(selToID)
        
      },
      // 聊天对象切换
      changeChat(state){

        setTimeout(()=>{
          let ind = _.findIndex(this.SessionItem, item => { return item.SessionId == this.selToID });
          if(ind != -1){
            this.gochat(this.SessionItem[ind])
          }
        },100)
        
      },
      
      
      recentSess(state){       
         
        // 比对基本信息
        this.recentSessMap = state.chat.recentSessMap;        
      },

      getSessionItem(state){
        
        this.SessionItem = state.chat.SessionItem
      },
      
      // imchange
      chatList(state){
        
        this.msgList = state.chat.MsgList;
        
        this.scoll(this.msgList.length)
        // 最近会话

      },
    }),
    mounted() {
      // 单聊、不刷新最近联系人      
      if(!this.$store.state.chat.newChat){
        initRecentContactList(function(){})
      }
                
      // // 每次拉取联系人、匹配头像昵称
      // common.matchNick(this.recentSessMap)
      this.$nextTick(()=>{
          $('.inChat_box').scrollTop($('.inChat_list').height() - $('.inChat_box').height());
        })
    },
    methods: {
      showChange(){

      },
      // 打开聊天表情
      showEmotion () {
        showEmotionDialog(this)
      },
      // 关闭聊天表情
      turnoffFaces () {
        turnoffFacesBox()
      },
      // 弹出发图对话框
      selectPic () {        
        selectPicClick()
      },
      send(){
        onSendMsg(this.message,this)
      },

      scoll(len){
        this.$nextTick(()=>{
          
          setTimeout(function(){
            $('.inChat_box').scrollTop($('.inChat_list').height() - $('.inChat_box').height());
          // debugger
          }, 100)
        })
        
      },
      // 聊天
      gochat(item){
        
        // 清空聊天窗口--并没有什么用
        this.inChat = true;
        // debugger
        this.currentChatInfo = item;
        // 把id存进vuex用于获取最近消息
        this.$store.state.chat.selToID = item.SessionId;
        deal_history_msg(item.SessionId)
        
      },


      checkInfo(){
        // this.SessionItem = app.$store.state.chat.SessionItem;
        
        if(!this.currentChatInfo || !this.currentChatInfo.SessionImage) return;
        let ind = _.findIndex(this.SessionItem, item => { return item.SessionId == this.currentChatInfo.SessionId; });
        
        if(ind != -1){
          
          this.currentChatInfo.SessionImage = this.recentSessMap[ind].SessionImage;
        }
      },

      // 调整当前聊天对象为列表里面第一个
      changeOrder(id){
        if(!id) return;
        let ind = _.findIndex(this.SessionItem, item => { return item.SessionId == id; });
        if(ind){
          let newChat = this.SessionItem.splice(ind,1);
          this.SessionItem.unshift(newChat)
        }
      }



        
      },

    components: {
      sendPic
    }
};
</script>
