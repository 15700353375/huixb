<!--
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: tags标签页
 -->

<template>
  <div class="bread">
    <div class="bread_main">
      <div class="bread_con" :style="{left: tagLeft + 'px'}">
        <Tag type="dot" :closable='item.name != "home"'
            :color="$route.name ==item.name ? 'blue' : ''" 
            v-for="(item, index) in routeTags" 
            :key="index"
            @on-close='closeTag(item)'
            @click.native='goTags(item)'>
          {{item.meta.title}}
        </Tag>
      </div>
    </div>
    <Dropdown class="tag_oper" @on-click='operTags'>
        <Button type="primary" size="small">
            标签选项
            <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem name='all'>关闭所有</DropdownItem>
            <DropdownItem name='other'>关闭其它</DropdownItem>
        </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        tagLeft: 0,

        littleNav: false,

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

      closeTag(data){     
           
        let ind = _.findIndex(this.routeTags, function(item) { return item.name == data.name; });
        if(ind != -1){
          
          this.routeTags.splice(ind,1);
          this.$store.commit('common/setRouteTags', this.routeTags);
          
          if(data.name == this.$route.name){
            this.$router.push({name: this.routeTags[this.routeTags.length - 1].name})
          }
        }
      },
      // 跳转到点击页面
      goTags(item){
        this.$router.push({name: item.name})
      },
      // 关闭所有标签页
      operTags(event){
        let newTags = []
        if(event == 'all'){
          let ind = _.findIndex(this.routeTags, function(item) { return item.name == 'home' });
          newTags = this.routeTags.slice(ind,1);
          this.$router.push({name:'home'});
        }
        if(event == 'other'){
          let currentName = this.$route.name
          let ind1 = _.findIndex(this.routeTags, function(item) { return item.name == 'home' });
          let ind2 = _.findIndex(this.routeTags, function(item) { return item.name == currentName; });
          newTags = this.routeTags.slice(ind1,1);
          newTags.push(this.routeTags[ind2])
          this.$router.push({name: currentName});
        }
        // console.log(newTags)
        app.$store.commit('common/setRouteTags', newTags);
      },

    },
    components: {

    }
  }

</script>



