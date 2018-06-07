<template>
<div>
  <div class="displayNone">{{picBox}}</div>
  <Modal v-model="sendPic"  @on-visible-change="isPic">
    
      <p slot="header" style="color:#f60;text-align:center">
          <Icon type="information-circled"></Icon>
          <span>请选择发送的图片</span>
      </p>
      <div style="text-align:center">
        <input type="file" id="upd_pic" @change="fileOnChange" />
        <div class="col-sm-10" style="max-width: 520px;">
          <div id="previewPicDiv"></div>
        </div>
      </div>
      <div slot="footer">
          <Button type="info" size="large" @click="uploadPic">发送</Button>
      </div>
  </Modal>
</div>
</template>

<script>
import { mapState } from "vuex";
import { selectPicClick, uploadPic, fileOnChange } from "@Util/chat/sendPic";
export default {
    data() {
      return {
        sendPic: true,
      }
    },
    computed: mapState({
      picBox(state){        
        this.sendPic= state.chat.sendPic;
      },
    }),
    mounted(){
      

    },
    methods: {
      isPic (val) {        
        this.$store.state.chat.sendPic = val
      },
      fileOnChange(file){
        fileOnChange(file.target)       
        
      },
      uploadPic(){
        uploadPic()
      }
    },
    components: {

    }
}
</script>
