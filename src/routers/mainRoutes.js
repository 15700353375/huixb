/**
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 主业务路由
 */

// 页面主框架
const main = r => require.ensure( [], () => r(require('@Src/view/main/main')), 'main');

// 销售报表
const home = r => require.ensure( [], () => r(require('@Src/view/main/home/home')), 'home');
const saleRecord = r => require.ensure( [], () => r(require('@Src/view/main/home/saleRecord')), 'saleRecord');

// 招生管理
const recruit = r => require.ensure( [], () => r(require('@Src/view/main/recruit/recruit')), 'recruit');
const applyInfo = r => require.ensure( [], () => r(require('@Src/view/main/recruit/apply-info')), 'applyInfo');
const recruitBatch = r => require.ensure( [], () => r(require('@Src/view/main/recruit/recruit-batch')), 'recruitBatch');
const signApply = r => require.ensure( [], () => r(require('@Src/view/main/recruit/signApply')), 'signApply');
// 学生综合管理
const student = r => require.ensure( [], () => r(require('@Src/view/main/student/student')), 'student');
const studentInfo = r => require.ensure( [], () => r(require('@Src/view/main/student/student-info')), 'studentInfo');
const teachingMaterials = r => require.ensure( [], () => r(require('@Src/view/main/student/teaching-materials')), 'teachingMaterials');

export default [
  {
    path: '/',
    component: main,
    children: [
      {
        path: 'home',
        component: home,
        meta: {icon: 'jt-teaching-materials', title: '首页', access: []},
        name: 'home'
      },
      {        
        path: 'recruit',
        meta: {icon: 'jt-teaching-materials', title: '招生管理', access: []},
        component: recruit,
        children: [          
          {
            path: 'recruit-batch',
            meta: {icon: 'jt-teaching-materials', parents: '招生管理', parentPath: 'recruit-management',  title: '招生批次', access: []},            
            name:'recruit-batch',
            component: recruitBatch
          },
          {
            path: 'apply-info',
            meta: {icon: 'jt-teaching-materials', parents: '招生管理', parentPath: 'recruit-management', title: '报名信息', access: []},
            name:'sign-up-info',
            component: applyInfo,
          },
          {
            path: 'apply-info/sign-apply',
            meta: {icon: 'jt-teaching-materials', parents: '招生管理', parentPath: 'recruit-management', title: '新增学生', access: []},
            name:'sign-apply',
            component: signApply,
          },

        ]
      },
      {        
        path: 'study',
        meta: {icon: 'jt-teaching-materials', title: '学生综合管理', access: []},
        component: student,
        children: [          
          {
            path: 'student-info',
            meta: {icon: 'jt-teaching-materials', parents: '学生综合管理', parentPath: 'study',  title: '学生信息', access: []},            
            name:'student-info',
            component: studentInfo
          },
          {
            path: 'teaching-materials',
            meta: {icon: 'jt-teaching-materials', parents: '学生综合管理', parentPath: 'study',  title: '教辅资料', access: []},            
            name:'teaching-materials',
            component: teachingMaterials
          },
          

        ]
      }
     
    ]
  }
  
]
