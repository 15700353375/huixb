<!--
 * @Author:      changh
 * @DateTime:    2018-05-28
 * @Description: 聊天弹窗
 -->

<template>
    <Modal v-model="modal2" class-name="chat" width='900'>
        <p slot="header" style="color:#f60;text-align:center">
        </p>
        <div class="chat_content">
          <Tabs value="1">
              <TabPane label="最近联系人" name="1">
                <div class="chat_box">
                  <div class="chat_left">
                    <div class="chat_left_tit">
                      最近联系人
                    </div>
                    <div class="chat_left_search">
                      <Select filterable clearable :autochange="true" style="width: 100%;text-align: left;" @on-change="showChange">
                        <Option v-for="item in SessionItem" :value="item.SessionId" :key="item.SessionId">{{ item.SessionNick }}</Option>
                      </Select>
                    </div>
                    <ul class="chat_left_list">
                      <li v-for="item in SessionItem" :key="item.SessionId">
                        <img src="static/img/logo-min.jpg" alt="">
                        <div class="people_con">
                          <div class="popple_top">
                            <span class="people_name text-ellipsis">{{item.SessionNick}}</span>
                            <span class="people_timer">{{item.timer}}</span>
                          </div>
                          <div class="people_bottom">
                            {{item.chat}}
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
                        changh
                      </div>
                      <div class="inChat_box">
                        <div class="inChat_list">
                          <div  v-for="(item,$index) in chatList" :key='$index'>
                            <div v-if="item.id != currentId" class="inChat_list_item">
                              <div class="inChat_left"><img :src="item.imgs" alt=""></div>
                                <div class="inChat_right">
                                  <div class="inChat_text">{{item.text}}</div>
                                  <div class="inChat_time">{{item.timer}}</div>
                                </div>
                            </div>
                            <div v-if="item.id == currentId" class="inChat_list_item inChat_list_item2">
                              <div class="inChat_left"><img :src="item.imgs" alt=""></div>
                                <div class="inChat_right">
                                  <div class="inChat_text">{{item.text}}</div>
                                  <div class="inChat_time">{{item.timer}}</div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="input_box">
                        <div class="input_menu"></div>
                        <textarea name="" id="" cols="30" rows="10"></textarea>
                        <div class="inChat_send"><Button type="primary">发送</Button></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane label="学生列表" name="2">标签二的内容</TabPane>
              <TabPane label="通知" name="3">标签三的内容</TabPane>
              <TabPane label="群发列表" name="4">标签四的内容</TabPane>
          </Tabs>
        </div>
        <!-- <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>
        </div> -->
    </Modal>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        modal2: true,
        modal_loading: false,
        value1: 1,
        theme1: 'light',

        inChat: true,

        SessionItem: [
          {
            SessionId: 1,
            SessionNick: '双方公司决定阿萨德将发送到附近',
            timer: '19:13:22',
            chat: '是的风格还不死的风格'
          },
          {
            SessionId: 1,
            SessionNick: '双方公司决定阿萨德将发送到附近',
            timer: '19:13:22',
            chat: '是的风格还不死的风格'
          }
        ],

        chatList: [
          {
            imgs: 'static/img/logo-min.jpg',
            name: 'changh',
            id: 1,
            text: 'dhfashd',
            timer: '2018-05-28 19:13:22',
          },
          {
            imgs: 'static/img/logo-min.jpg',
            name: 'changh',
            id: 1,
            text: '水电费阿斯蒂芬',
            timer: '2018-05-28 19:13:22',
          },
          {
            imgs: 'static/img/logo.png',
            name: 'changh',
            id: 2,
            text: '深加工阿娇是的佛i阿娇岁的农妇as放大镜白色的发生打发时间内大幅ias的',
            timer: '2018-05-28 19:13:22',
          }
        ],
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
        this.value1 = Number(event)
      },
      showChange(){

      }

    },
    components: {

    }
  }

</script>



