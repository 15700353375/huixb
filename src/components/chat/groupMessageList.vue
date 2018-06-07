<template>
  <div class="chat_box chat_log">
    <div class="chat_log_left">
      <div class="chat_left_tit">
        群发记录列表
      </div>
      <ul class="chat_left_list scrollStyle">
        <li v-for="(item,index) in msgLog" :key="index">
          <div class="people_con">
            <div class="popple_top">
              <span class="people_name text-ellipsis">{{item.title}}</span>
              <span class="people_timer">{{item.createAt}}</span>
            </div>
            <div class="people_bottom">
              {{item.msg}}
            </div>
            <div class="lookList" v-if="item.msgType =='群发'"><a>查看群发学生列表</a></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="chat_right">
      <div>
        <div class="chat_right_tit">
          群发学生列表
        </div>
        <div class="inChat_box">
          <div class="inChat_list">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {urls} from '@Util/axiosConfig';
export default {
    data() {
        return {


            msgLog: [],

        };
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,
    }),
    mounted() {
      this.getList();
    },
    methods: {
      showChange(){

      },
      getList(){
        this.$ajaxPost(urls.GETMSGLOG).then(res => {
          this.msgLog = res.body;
        }).catch(error => {
          this.$message.error(error)
        })
      }

    },
    components: {

    }
};
</script>
