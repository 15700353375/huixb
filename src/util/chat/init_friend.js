/*
 * @Author:      changh
 * @DateTime:    2018-06-01
 * @Description: 启动im成功后初始化好友和初始化群组，但是不知道有什么用，啥都没初始化出来
 */




import { webim } from './js/webim'
import { initRecentContactList } from './recent_contact_list_manager'
import { onSelSess } from './switch_chat_obj'
import { mapState } from 'vuex';



export { initDemoApp }





//登录成功-初始化
function initDemoApp() {

  // //初始化我的群组系统消息表格
  // initGetMyGroupSystemMsgs([]);

  // //初始化我的资料系统消息表格
  // initGetMyProfileSystemMsgs([]);

  //初始化好友和群信息
  initInfoMap(initInfoMapCallbackOK);
}


function initInfoMap(cbOk) {
  //读取我的好友列表
  initInfoMapByMyFriends(
      //读取我的群组列表
      initInfoMapByMyGroups(
          cbOk
      )
  );
}

// 从这里开始有意义--真正的初始化最近联系人
function initInfoMapCallbackOK() {
  
  // 初始化聊天界面左侧最近会话列表
  initRecentContactList(initRecentContactListCallbackOK);
}

//初始化我的最近会话列表框回调函数
function initRecentContactListCallbackOK() {
  let selType = webim.SESSION_TYPE.C2C;
  let selToID = app.$store.state.chat.selToID; //当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
  // 切换好友或群组聊天对象
  // onSelSess(selType, selToID);

}


//将我的好友资料（昵称和头像）保存在infoMap  == 目前只有admin账号有一个人，只有头像  不知道在干嘛
var initInfoMapByMyFriends = function (cbOK) {
  let loginInfo = app.$store.state.chat.loginInfo
  var options = {
      'From_Account': loginInfo.identifier,
      'TimeStamp': 0,
      'StartIndex': 0,
      'GetCount': app.$store.state.chat.totalCount,
      'LastStandardSequence': 0,
      "TagList": [
          "Tag_Profile_IM_Nick",
          "Tag_Profile_IM_Image"
      ]
  };

  // 没有看到什么实际意义不知道在干嘛
  webim.getAllFriend(    
      options,
      function (resp) {        
        
          if (resp.FriendNum > 0) {

              var friends = resp.InfoItem;
              if (!friends || friends.length == 0) {
                
                console.log(friends);
                  if (cbOK)
                      cbOK();
                  return;
              }
              var count = friends.length;
              
              for (var i = 0; i < count; i++) {
                  // var friend=friends[i];
                  // var friend_account = friend.Info_Account;
                  // var friend_name=friend_image='';
                  let friend = friends[i]
                  let friend_account = friend.Info_Account
                  let friend_name = ''
                  let friend_image = '' 
                  for (var j in friend.SnsProfileItem) {
                      switch (friend.SnsProfileItem[j].Tag) {
                          case 'Tag_Profile_IM_Nick':
                              friend_name = friend.SnsProfileItem[j].Value;
                              break;
                          case 'Tag_Profile_IM_Image':
                              friend_image = friend.SnsProfileItem[j].Value;
                              break;
                      }
                  }
                  var key=webim.SESSION_TYPE.C2C+"_"+friend_account;
                  // 将c2c上的基本信息存进vux
                  app.$store.state.chat.infoMap[key] = {
                    'name': friend_name,
                    'image': friend_image
                  }
              }
              deugger
              if (cbOK)
                  cbOK();
          }
      },
      function (err) {
        app.$message.error(err);
        console.log(err);
      }
  );
};


var initInfoMapByMyGroups = function (cbOK) {
  console.log('开始获取我的群组资料（群名称和头像）')
  let loginInfo = app.$store.state.chat.loginInfo
  var options = {
    'Member_Account': loginInfo.identifier,
    'Limit': 200, // 每次接口请求的条数
    'Offset': 0,
    'GroupBaseInfoFilter': [
      'Name',
      'FaceUrl'
    ]
  }
  webim.getJoinedGroupListHigh(
    options,
    function (resp) {
      console.log('获取成功，将我的群组资料（群名称和头像）保存在infoMap')
      
      if (resp.GroupIdList && resp.GroupIdList.length) {
        for (var i = 0; i < resp.GroupIdList.length; i++) {
          var group_name = resp.GroupIdList[i].Name
          var group_image = resp.GroupIdList[i].FaceUrl
          var key = webim.SESSION_TYPE.GROUP + '_' + resp.GroupIdList[i].GroupId
          
          app.$store.state.chat.infoMap[key] = {
            'name': group_name,
            'image': group_image
          }
        }
        
      }
      
      if (cbOK) {
        cbOK()
      }
    },
    function (err) {
      app.$message.error(err.ErrorInfo);
        console.log(err.ErrorInfo);
    }
  )
}