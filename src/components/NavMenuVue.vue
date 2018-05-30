<!--
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 左侧导航
 -->

<template>
<div class="navMenu" v-bind:class="{ little: littleNav }">
  <div class="displayNone">{{navState}}</div>
  <div class="nav_logo">
    <img src="static/img/logo.png" alt="">
  </div>
  <Menu :theme="theme2" accordion @on-select="route" :active-name="current.name" :open-keys="current.open">
    <Submenu v-if="!littleNav" :name='item.path'  v-for="(item, index) in menuList" :key="index">
        <template slot="title">
            <Icon :type="item.icon"></Icon>
            {{item.name}}
        </template>
        <template v-if="item.children && item.children.length">
          <Menu-item :name='item.path + "/" + childItem.path' 
                    v-for="(childItem, childIndex) in item.children"
                    :key='childIndex'>
            <Icon :type="childItem.icon"></Icon>
            {{childItem.name}}
          </Menu-item>
        </template>
    </Submenu>
    <Submenu v-if="littleNav" class="littleNav" :name='item.id'  v-for="(item, index) in menuList" :key="index">
        <template slot="title">
            <Icon :type="item.icon"></Icon>
            <!-- {{item.name}} -->
        </template>
        <template v-if="item.children && item.children.length">
          <Menu-item :name='item.id + "-" + childItem.id' 
                  v-for="(childItem, childIndex) in item.children"
                  :key='childIndex'>
          <Icon :type="childItem.icon"></Icon>
          {{childItem.name}}
        </Menu-item>
        </template>
    </Submenu>
</Menu>
</div>
</template>

<script>

  //加载相关依赖
  import { mapState } from 'vuex';

  export default {
    // props: ['navData','name'],
    data() {
      return {
        littleNav: false,

        // 控制tabsUl:active
        activeLi: {
          staffSaleStatist: false,
          customerList: false,
          distributePower: false,
          staffList: false,
          systemList: false
        },

        // 在第一版本中因为没有时间做权限，所以初略控制，之后请删除
        roleId: '',
        theme2: 'dark',

        menuList: [],
        current: {
          open: [''],
          name: '',          
        }

      }
    },
    watch:{      //监听路由变化

      $route( to , from ){     
        
        this.current = {
          open: `['${to.meta.parentPath}']` || "[]",
          name: (to.meta.parentPath || "") + '/' + (to.name || "")
        }
      }

    },
    mounted(){
      
      this.$nextTick(function(){
        this.current = {
          open: `['${this.$route.meta.parentPath}']` || "[]",
          name: (this.$route.meta.parentPath || "") + '/' + (this.$route.name || "")
        }
      })
      console.log(this.$store.state.common.studentList);
      console.log(this.$store.state.common.menu);
      this.menuList = this.$store.state.common.menu;
    },
    methods: {
      route(name){        
        let route = name.split('/')[1]
        this.$router.push({name: route});
      },

    },
    computed: {
      ...mapState({
        // 区域option，从vuex中获取
        navState(state){
          this.littleNav = state.common.littleNav;
        }
      }),
    }
  }

</script>
