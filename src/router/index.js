import Vue from 'vue'
import VueRouter from 'vue-router'
// const page = name => resolve => require(['@/components/' + name], resolve)
const page = name => resolve => require(['@/components/' + name], resolve)
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '',
      redirect: '',
      component: page('Public/Login')
    },
    {
      path: '/home',
      component: page('Public/Home'),
      children: [
        {
          path: '/dormitory',
          component: page('Home/dormitory'),
          children: [
            {
              path: 'live', // 宿舍实况
              name: '宿舍实况',
              component: page('Home/dormitory/live.vue')
            },
            {
              path: 'nowinfo', // 宿舍当前信息
              name: '宿舍当前信息',
              component: page('Home/dormitory/nowinfo.vue'),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'exception', // 考勤异常信息
              name: '考勤异常信息',
              component: page('Home/dormitory/exception.vue'),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'stranger', // 陌生人管理
              name: '陌生人管理',
              component: page('Home/dormitory/stranger.vue'),
              meta: {
                keepAlive: true
              }
            }
          ]
        },
        {
          path: '/peoManager',
          component: page('Home/peoManager'),
          children: [
            {
              path: 'info_maintain', // 人员信息采集
              name: '人员信息采集',
              component: page('Home/peoManager/info_maintain')
            },
            {
              path: 'release', // 信息下发管理
              name: '信息下发管理',
              component: page('Home/peoManager/release')
            },
            {
              path: 'students', // 入住人员管理
              name: '入住人员管理',
              component: page('Home/peoManager/students'),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'strangers', // 宿管人员管理
              name: '宿管人员管理',
              component: page('Home/peoManager/strangers'),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'teachers', // 教职工管理
              name: '教职工管理',
              component: page('Home/peoManager/teachers'),
              meta: {
                keepAlive: true
              }
            }
          ]
        },
        {
          path: '/system',
          component: page('Home/system'),
          children: [
            {
              path: 'attendance',
              name: '考勤时间设置', // 考勤时间设置
              component: page('Home/system/attendance/attendance.vue')
            },
            {
              name: '角色管理',
              path: 'role',
              component: page('Home/system/role/role.vue')
            },
            {
              path: 'role_add',
              name: '添加角色',
              component: page('Home/system/role/role_add')
            },
            {
              name: '系统用户',
              path: 'system',
              component: page('Home/system/role/system.vue')
            },
            {
              path: 'system_user_add',
              name: '添加用户',
              component: page('Home/system/role/system_user_add')
            },
            {
              path: 'import',
              name: '资源管理',
              component: page('Home/system/role/import.vue')
            },
            {
              path: 'import_add',
              name: '资源添加',
              component: page('Home/system/role/import_add.vue')
            },
            {
              path: 'stranger_label',
              name: '陌生人标签', // 陌生人标签
              component: page('Home/system/stranger_label.vue')
            },
            {
              path: 'school',
              name: '学院管理',
              component: page('Home/system/organization/school.vue')
            },
            {
              path: 'school_add',
              name: '学院添加',
              component: page('Home/system/organization/school_add.vue')
            },
            {
              path: 'school_detail',
              name: '学院详情',
              component: page('Home/system/organization/school_detail.vue')
            },
            {
              path: 'class',
              name: '专业班级管理',
              component: page('Home/system/organization/class.vue')
            },
            {
              path: 'class_add',
              name: '专业班级添加',
              component: page('Home/system/organization/class_add.vue')
            },
            {
              path: 'class_detail',
              name: '班级详情',
              component: page('Home/system/organization/class_detail.vue')
            },
            {
              path: 'building',
              name: '楼栋管理',
              component: page('Home/system/location/building.vue')
            },
            {
              path: 'building_add',
              name: '楼栋添加',
              component: page('Home/system/location/building_add.vue')
            },
            {
              path: 'dormitory',
              name: '宿舍管理',
              component: page('Home/system/location/dormitory.vue')
            },
            {
              path: 'dormitory_add',
              name: '宿舍添加',
              component: page('Home/system/location/dormitory_add.vue')
            },
            {
              path: 'dormitory_detail',
              name: '宿舍详情',
              component: page('Home/system/location/dormitory_detail.vue')
            }
          ]
        },
        {
          path: '/update_pwd',
          name: 'update_pwd', // 修改密码
          component: page('Public/update_pwd.vue')
        },
        {
          path: '/stranger_detail',
          name: 'stranger_detail', // 陌生人详情
          component: page('Home/dormitory/stranger_detail')
        },
        {
          path: '/time_detail',
          name: 'time_detail', // 考勤时间设置-添加
          component: page('Home/system/time_detail')
        },
        {
          path: '/peoManager/peopleDetails', // 人物详情
          name: 'peopleDetails',
          component: page('Home/peoManager/details')
        }
      ]
    },
    {
      path: '/login',
      redirect: '/login',
      components: page('Public/Login')
    },
    { path: '/tv', name: 'tv', component: page('Public/tv.vue') },
    { path: '/error', name: 'Error', component: page('Public/Error.vue') },
    { path: '*', hidden: true, redirect: { path: '/error' } }
  ]
})
export default router
