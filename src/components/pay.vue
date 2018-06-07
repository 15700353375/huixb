
<!--
 * @Author:      changh
 * @DateTime:    2018-06-02
 * @Description: 屏幕锁定
 -->
<template>
<div v-if="isPay">
  <Modal
    class-name="vertical-center-modal payVue"
    title="支付订单"
    v-model="isPay"
    @on-cancel='close'>
    <div class="clearfix" v-if="payData">
      <div class="clearfix pay_item">
        <div class="pay_item_left">订单号：</div>
        <div class="pay_item_right">{{payData.sn}}</div>
      </div>
      <div class="clearfix pay_item">
        <div class="pay_item_left">购买项目：</div>
        <div class="pay_item_right">{{payData.title}}</div>
      </div>
      <div class="clearfix pay_item">
        <div class="pay_item_left">金额：</div>
        <div class="pay_item_right">{{payData.money}}</div>
      </div>
      <div class="clearfix pay_item">
        <div class="pay_item_left">支付方式：</div>
        <div class="pay_item_right">
          <img src="static/img/zhifubao.png" @click="payMoney('ALIPAY')">
          <img src="static/img/weixinzhifu.png" @click="payMoney('WXPAY')">
        </div>
      </div>      
    </div>
</Modal>

<!-- 微信支付 -->
<Modal v-model="wxpayModel" width="230px" :mask-closable="false">
  <p slot="header" style="color:#f60;text-align:center">
      <Icon type="information-circled"></Icon>
      <span>微信支付</span>
  </p>
  <div style="text-align: center">
      <img :src="'http://qr.liantu.com/api.php?bg=f3f3f3&el=l&w=200&m=5&text=' + wxcode" alt="">
  </div>
  <div slot="footer">
  </div>
</Modal>

</div>
</template>


<script>
  import {urls} from '@Util/axiosConfig';
  import { mapState } from 'vuex';
  
  export default {
    props : ['payData'],
    data () {
      return {
        // _payData: this.payData,
        isPay: true,
        wxcode: '',
        wxpayModel: false,
      }
    },
    computed: mapState({
      // 名字
      userInfo: state => state.login.userInfo,
    }),
    mounted(){
      console.log(this.userInfo)
      
    },
    methods: {
      payMoney (platform) {
        let params = {
            uid: this.userInfo.uid
          }

        this.$ajaxPostForm(urls.BASE_URL+ '/order-api/pay/pagePay/' + platform + '/' + this.payData.sn ,params).then(res => {
          if (platform === 'WXPAY') {
            this.wxcode = res.body
            this.wxpayModel = true
            this.$emit('checkStatus')
          } else {
            if ($('#payForm')) {
              $('#payForm').remove()
            }
            let a = res.body.substring(0, 6)
            let b = res.body.substring(6)
            let c = a + 'target="_blank" id="payForm"' + b
            $('#bodys').append(c);
            this.close();
            this.$emit('checkStatus')    
          }
        })  
      },
      close(){
        this.isPay = false;
        this.$emit('payClose')
      },
      weChat(){

      }
    }
  }
</script>


