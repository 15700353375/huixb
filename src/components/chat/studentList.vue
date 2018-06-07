<template>
  <div class="chat_box">
    <div class="displayNone">{{picBox}} </div>
    <div class="chat_left">
      <div class="chat_left_tit">
        学生列表
      </div>
      <div class="chat_left_search" v-if="!isAllSend">
        <Select filterable clearable :autochange="true" style="width: 214px;text-align: left; float:left;" @on-change="showChange">
          <Option v-for="(item,index) in studentList" :value="item.uid" :key="index">{{ item.name || item.mobile }}</Option>
        </Select>
        <Button style="float:right;" @click='allSend' type="info" icon="ivu-icon ivu-icon-chatboxes">群发</Button>
      </div>
      <div class="chat_left_search" v-if="isAllSend">
        <span class="goback" @click='goback'>返回</span>
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">全选</Checkbox>
      </div>
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <ul class="chat_left_list scrollStyle studentList">
        <li v-for="(item,index) in studentList" :key="index">
          <div class="chat_item">
            <!-- 默认头像 -->
            <img :src="item.avatar || 'http://rep.hanlinhx.com/images/default/avatar.jpg?x-oss-process=image/resize,m_mfit,h_100,w_100'" alt="">
            <div class="people_con">
              <div class="studentName text-ellipsis">
                {{item.name || item.mobile}}
              </div>
              <Checkbox v-if="isAllSend" :label="item.mobile"></Checkbox>
              <span v-if="!isAllSend" class="chat ivu-icon ivu-icon-chatboxes" @click.self='goChat(item)'></span>
            </div>
          </div>
        </li>
      </ul>
      </CheckboxGroup>
      
    </div>
    <div class="chat_right">
      <div>
        <div class="chat_right_tit">
          群发
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

export default {
    data() {
        return {

            inChat: true,

            isAllSend: false,
            // 群发
            indeterminate: false,
            checkAll: false,
            checkAllGroup: [],




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

      studentList: state => state.common.studentList,

      picBox(state){
        
        this.sendPic= state.chat.sendPic;
      },
    }),
    mounted() {

      console.log(this.studentList)

    },
    methods: {
      // 下拉
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

      // 此时没有做权限  注意权限
      send(){
        // 先验证
        if(!this.message){
          this.$message.warning('请输入发送的内容')
          return
        }
        this.sendServer();
        this.checkAllGroup.forEach(item => {
          this.$store.state.chat.selToID = item;          
          onSendMsg(this.message,this)
        })
        

      },
      // 发送到服务端进行存储
      sendServer(){
        let parmas = {
          link: '',
          title: this.message,
          msg: this.message,
          uids: this.checkAllGroup
        }
        this.$ajaxPost(urls.MSENDMESSAGE,parmas).then(res => {
          this.$message.success('发送后台成功')
        }).catch(error => {
          this.$message.error(error)
        })
      },

      // scoll(len){
      //   this.$nextTick(()=>{
          
      //     setTimeout(function(){
      //       $('.inChat_box').scrollTop($('.inChat_list').height() - $('.inChat_box').height());
      //     // debugger
      //     }, 100)
      //   })
        
      // },



      // 群发
      allSend(){
        this.isAllSend = true;
      },
      goback(){
        this.isAllSend = false;
      },

      // 群发消息--多选框状态
      handleCheckAll () {
          if (this.indeterminate) {
              this.checkAll = false;
          } else {
              this.checkAll = !this.checkAll;
          }
          this.indeterminate = false;

          if (this.checkAll) {
            this.studentList.forEach(item =>{
              this.checkAllGroup.push(item.mobile)         
            })
          } else {
              this.checkAllGroup = [];
          }
      },
      checkAllGroupChange (data) {
          if (data.length === this.studentList.length) {
              this.indeterminate = false;
              this.checkAll = true;
          } else if (data.length > 0) {
              this.indeterminate = true;
              this.checkAll = false;
          } else {
              this.indeterminate = false;
              this.checkAll = false;
          }
      },

      // 去聊天
      goChat(item){
        let recentSessMap = this.$store.state.chat.recentSessMap;
        
        let name = 'C2C_' + item.mobile;
        // 判断该学生是否在最近联系人里面
        let ind = _.findKey(recentSessMap, item => { return item.SessionId == name });
        if(!ind){
          recentSessMap[name] ={
            SessionId: item.mobile,
            SessionNick: item.name,
            nickName: item.name,
            UnreadMsgCount: 0,
            SessionImage: item.avatar,
            MsgTimeStamp: '',
            MsgShow: ''
          }
        }
        
        this.$store.state.chat.selToID = item.mobile;
        this.$store.commit('chat/setNewChat', true)
        this.$store.commit('chat/setRecentSessMap', recentSessMap)
        this.$emit('studentChat')
      },

      

    },
    components: {
      sendPic
    }
};
</script>
