var phone=/^[1][3,4,5,7,8][0-9]{9}$/; 
var Idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 

export default {
  // 验证手机号
  validator_mobile(rule, value, callback){
    // 模拟异步验证效果
    setTimeout(() => {
        if (phone.test(value)) {
          callback();
        } else {
          callback(new Error('请输入11位手机号'));
        }
    }, 100);
  },
  // 验证身份证
  validator_idCard(rule, value, callback){
    // 模拟异步验证效果
    setTimeout(() => {
        if (Idcard.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的身份证号'));
        }
    }, 100);
  },
}