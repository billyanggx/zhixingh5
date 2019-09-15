import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    api: {
      'login': '/user/login', // 登录
      'updatePassword': '/user/updatePassword', // 修改密码
      // 人员模块
      'createPeople': '/people/addPeopleList', // 批量新增人员信息
      'queryPeopleList': '/people/queryPeople', // 获取人员列表
      'getPeopleInfo': '/people/getPeople', // 获取人员信息
      'updatePeople': '/people/updatePeople', // 修改人员信息
      'updatePeopleStatus': '/people/updatePeopleStatus', // 修改人员状态信息
      // 组织架构模块
      'addPeopleOrganization': '/organization/addPeopleOrganization', // 添加人员组织架构关系
      'getChildOrganization': '/organization/getChildOrganization', // 获取子组织架构
      'getAllChildOrganization': '/organization/getAllChildOrganization', // 获取全部子组织架构
      'deletePeopleOrganization': '/organization/deletePeopleOrganization', // 删除人员组织架构关系
      'organizationList': '/organization/organizationList', // 组织架构列表
      'addAcademyAndMajor': '/organization/addAcademyAndMajor', // 添加学院和专业
      'getByType': '/organization/getByType', // 获取所有学院或班级
      'checkExisted': '/organization/checkExisted', // 判断专业和班级是否已经存在
      'addClass': '/organization/addClass', // 添加班级
      'updateOrganization': '/organization/updateOrganization', // 更新学院和专业
      'organizationInfo': '/organization/organizationInfo', // 学院专业详情
      'classList': '/organization/classList', // 班级列表
      // 位置关系模块
      'addPeopleLocation': '/location/addPeopleLocation', // 添加人员位置关系
      'getChildLocation': '/location/getChildLocation', // 获取子位置
      'getPeoplesByLocation': '/location/getPeoplesByLocation', // 获取指定位置所有人员
      'getLocationPeopleInOutCount': '/location/getLocationPeopleInOutCount', // 获取位置出入总数
      'getAllChildLocation': '/location/getAllChildLocation', // 获取全部子位置
      'deletePeopleLocation': '/location/deletePeopleLocation', // 删除人员位置关系
      'addbBuilding': '/location/addbBuilding', // 添加楼栋
      'buildingList': '/location/buildingList', // 楼栋列表
      'addDormitory': '/location/addDormitory', // 添加宿舍
      'dormitoryList': '/location/dormitoryList', // 宿舍列表
      'updateLocation': '/location/updateLocation', // 更新园区或者楼栋或者宿舍
      'locationGetByType': '/location/getByType', // 获取所有楼栋或者宿舍
      // 出入关系模块
      'getStrangerFaceLogList': '/facelog/getStrangerFaceLogList', // 获取陌生人出入记录
      'getPeopleFaceLogList': '/facelog/getPeopleFaceLogList', // 获取人员出入列表
      'queryPeopleLog': '/facelog/queryPeopleLog', // 当前人数
      // 标签模块
      'getTag': '/tag/getPeopleTag', // 获取人的标签
      'addTag': '/tag/addPeopleTag', // 添加人的标签
      'deleteTag': '/tag/deletePeopleTag', // 删除人的标签
      'addAllTag': '/tag/addTag', // 添加标签
      'tagList': '/tag/tagList', // 标签列表
      'updAllTag': '/tag/updateTag', // 修改标签
      'deleteAllTag': '/tag/deleteTag', // 删除标签
      // 系统设置模块
      'uploadBase64Image': '/system/uploadBase64Image', // 上传图像
      'getKey': '/system/getKey', // 获取键值对内容
      'addKey': '/system/addKey', // 添加键值对
      'deleteKey': '/system/deleteKey', // 删除键值对
      // 学校业务定制模块
      'dutyInfo': '/school/dutyInfo', // 宿舍总览-考勤概况
      'getStranger': '/Stranger/getStranger', // 获取陌生人信息
      'queryStranger': '/stranger/queryStranger', // 陌生人列表
      'queryAttendLog': '/attend/queryAttendLog', // 人员出入记录查询
      'downLoadFaceToSuperBrain': '/superBrainFace/downLoadFaceToSuperBrain', // 调超脑
      'deleteFace': '/superBrainFace/deleteFace' // 删除超脑信息
    },
    nowInfoType: 1, // 当前信息的类型
    exceptionType: 0, // 当前异常页面的类型
    strangerHome: false, // 是否从首页进入陌生人管理页面
    strangerHomeIndex: 1, // 陌生人管理页面的位置
    idCardTypeList: [{value: '学生证', id: 1}, {value: '身份证', id: 2}, {value: '教师证', id: 3}],
    searchInfo: {
      idCardNo: '',
      name: '',
      cellPhone: '',
      locationID: [],
      organizationID: [],
      createTime: {
        from: '',
        to: ''
      }
    },
    updateInfo: ''
  },
  mutations: {
    updataSearch (state, data) {
      state.searchInfo = data
    }
  }
})

export default store
