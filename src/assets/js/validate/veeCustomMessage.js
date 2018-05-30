/*--
 * @Author:      cyzeng
 * @DateTime:    2017-07-27 11:12:18
 * @Description: vee验证框架 自定义类
 --*/


// 自定义Vee验证组件消息
export let veeCustomMessage = {
  zh_CN: {
    custom: {
      user: {
        required: '该项为必填',
        phone: '请输入正确手机号码'
      },
      password: {
        required: '该项为必填'
      },
      validateCode: {
         required: '该项为必填',
         // confirmed: '验证码错误'
         lengthFour: '验证码必须为4位',
         lengthSix: '手机验证码必须为6位',
         digits: (field, params) => `验证码必须为${params[0]}位`,
         numeric: '该项必须为数字'
      },
      authorizeYear: {
        required: '该项为必填',
        max_value: '授权数量不足'
      },
      saleMoney: {
        required: '该项为必填',
        money: '请输入正确金额'
      },
      userName: {
        required: '该项为必填'
      },
      phone: {
        required: '该项为必填',
        phone: '请输入正确手机号码'
      },
       applyNumber: {
        required: '该项为必填',
        numeric: '请填入正确数量'
      },
      authorizeNumber:{
        required: '该项为必填',
        max_value: '授权数量不足'
      },
      agoPassWord:{
        required: '该项为必填',
      },
      newPassWord:{
        required: '该项为必填',
      },
      comfirmPassWord:{
        required: '该项为必填',
        confirmed: '新旧密码不一致'
      }
    }
  }
}




// 自定义Vee验证组件规则
export let veeCustomRules = [
  {
    name: 'phone',
    description: '手机验证',
    validator: {
      messages: {
        cn: (field, args) => {
          return '请输入正确手机号码';
        }
      },
      validate(value, args) {
        return /^(13\d|14[57]|15[^4,\D]|17[03678]|18\d)\d{8}$/.test(value);
      }
    }
  },
  {
    name: 'lengthFour',
    description: '验证码必须为4位',
    validator: {
      messages: {
        cn: (field, args) => {
          return '验证码必须为4位';
        }
      },
      validate(value, args) {
        return value.length == 4 ? true : false;
      }
    }
  },
  {
    name: 'lengthSix',
    description: '验证码必须为6位',
    validator: {
      messages: {
        cn: (field, args) => {
          return '验证码必须为6位';
        }
      },
      validate(value, args) {
        return value.length == 6 ? true : false;
      }
    }
  },
  {
    name: 'money',
    description: '验证金钱',
    validator: {
      messages: {
        cn: (field, args) => {
          return '验请输入正确金额';
        }
      },
      validate(value, args) {
        return /^([1-9][0-9]{0,11}|0)(\.[0-9]{1,2})?$/.test(value);
      }
    }
  }
];



