<template>
  <div class="page">
    <ul class="left">
      <li class="img">
        <img src="../../assets/image/logo-tsl.png" alt="" srcset="">
      </li>
      <!-- 左部 -->
      <li v-for="(item, index) in tabMenu" :key="index" :class="[index === indexTab ? 'tabActive' : '', 'tabColor']">
        <div class="sub-title" @click="switchTab(index, item)">
          <i class="tabActiveI"></i>
          {{item.name}}
        </div>
        <ul v-if="item.children !== undefined" v-show="item.isShow" class="sub-content">
          <li @click="switchTab2(position, info, index)" v-for="(info,position) in item.children" :key="position" :class="[position === indexTab2 ? 'tabActive2' : '', 'sub-content-li', 'sub-li-' + index]">
            {{info.name}}
          </li>
        </ul>
      </li>
      <p class="copyright">服务热线：027-88225712</p>
    </ul>
    <!-- 上部 -->
    <div class="right">
      <div class="top">
        <ul class="header">
          <li v-for="(item, index) in subMenu" :key="index" @click="switchSub(index, item.path)" :class="[index === indexMenu ? 'MenuActive' : '' , 'color' + index, 'subColor']">
            {{item.name}}
          </li>
        </ul>
        <div class="user-info">
          <div class="user" @click="showMenu">
            <div class="user-img">
              <img src="../../assets/image/icon-user-header.png" alt="" srcset="">
              <div class="text-info">{{day}}</div>
            </div>
            <div class="info">
              <div class="text-info">{{userName}}</div>
              <div class="text-info">{{userType}}</div>
              <div class="text-info">{{time}}</div>
            </div>
          </div>
          <div class="menu" v-if="showMenuFlag">
            <li @click="updatePwd">
              <i class="icon-update-pwd"></i>
              <span>修改密码</span>
            </li>
            <li @click="logOut">
              <i class="icon-logout"></i>
              <span>退出帐号</span>
            </li>
          </div>
        </div>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      userName: '',
      userType: '',
      showMenuFlag: false,
      day: '',
      time: '',
      indexMenu: 0,
      indexTab: 0, // 2级菜单选择了第几个
      indexTab2: 0, // 3级菜单选择了第几个
      currentColor: '',
      tabMenu: [],
      subMenu: [{
        name: '宿舍概况',
        path: '/dormitory/live',
        children: [
          {
            name: '宿舍总览',
            path: '/dormitory/live'
          },
          {
            name: '宿舍当前信息',
            path: '/dormitory/nowinfo'
          },
          {
            name: '考勤异常信息',
            path: '/dormitory/exception'
          },
          {
            name: '陌生人管理',
            path: '/dormitory/stranger'
          }
        ]
      }, {
        name: '人员管理',
        path: '/peoManager/info_maintain',
        children: [
          {
            name: '人员信息采集',
            path: '/peoManager/info_maintain'
          },
          // {
          //   name: '信息下发管理',
          //   path: '/peoManager/release'
          // },
          {
            name: '入住人员管理',
            path: '/peoManager/students'
          },
          {
            name: '宿管人员管理',
            path: '/peoManager/strangers'
          },
          {
            name: '教职工管理',
            path: '/peoManager/teachers'
          }
        ]
      }, {
        name: '系统设置',
        path: '/system/attendance',
        children: [
          {
            name: '考勤设置',
            path: '/system/attendance',
            isShow: false,
            children: [
              {
                path: '/system/attendance',
                name: '考勤时间设置'
              },
              {
                name: '陌生人标签',
                path: '/system/stranger_label'
              }
            ]
          },
          // {
          //   name: '权限设置',
          //   path: '/system/role',
          //   isShow: false,
          //   children: [
          //     {
          //       name: '角色管理',
          //       path: '/system/role'
          //     },
          //     {
          //       name: '系统用户',
          //       path: '/system/system'
          //     },
          //     {
          //       name: '资源管理',
          //       path: '/system/import'
          //     }
          //   ]
          // },
          {
            name: '基础管理',
            path: '/system/role',
            isShow: false,
            children: [
              {
                name: '学院专业管理',
                path: '/system/school'
              },
              {
                name: '班级管理',
                path: '/system/class'
              }
            ]
          },
          {
            name: '宿舍楼管理',
            path: '/system/building',
            isShow: false,
            children: [
              {
                name: '楼栋管理',
                path: '/system/building'
              },
              {
                name: '宿舍管理',
                path: '/system/dormitory'
              }
            ]
          }
        ]
      }
      ],
      timeInterval: ''
    }
  },
  created () {
    this.$EventBus.$on('switchMenu', this.switchTab)
  },
  mounted () {
    // 跳转到浏览器地址栏页面
    switch (window.location.hash.split('/')[1]) {
      case 'dormitory':
        this.switchSub(0, window.location.hash.slice(1))
        break
      case 'peoManager':
        this.switchSub(1, window.location.hash.slice(1))
        break
      case 'system':
        this.switchSub(2, window.location.hash.slice(1))
        break
      default:
        this.switchSub(0, '/dormitory/live')
        break
    }
    this.day = this.$common.getDay(0)
    this.getTime()
    this.timeInterval = setInterval(() => {
      this.getTime()
    }, 1000)
    this.userName = window.localStorage.getItem('userName')
    this.userType = window.localStorage.getItem('userType')
  },
  methods: {
    getTime () {
      var temp = new Date()
      let hour = temp.getHours() < 10 ? '0' + temp.getHours() : temp.getHours()
      let min = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
      let sec = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
      this.time = hour + ':' + min + ':' + sec
    },
    // 切换顶部菜单
    switchSub: function (index, subMenuText) {
      this.tabMenu = this.subMenu[index].children
      this.indexMenu = index
      let colorArr = ['#42CA95', '#F4EB42', '#FDBC51']
      this.currentColor = colorArr[index]
      var subArr = document.getElementsByClassName('subColor')
      for (var i = 0; i < subArr.length; i++) {
        subArr[i].style.color = '#fff'
      }
      // 二级菜单的位置
      var subMenuIndex = this.tabMenu.findIndex((ele) => {
        return ele.path === subMenuText
      })
      // 如果是人员详情、陌生人详情(考虑到还有点击切换，所以不用subMenuIndex做判断)
      var pathName = window.location.hash.slice(1)
      if (pathName.indexOf('/peoManager/peopleDetails') !== -1 || pathName.indexOf('/stranger_detail') !== -1) {
        return false
      }
      var subMenuIndex2 = subMenuIndex === undefined || subMenuIndex === -1 ? 0 : subMenuIndex
      this.tabMenu[subMenuIndex2].isShow = false
      this.switchTab(subMenuIndex2, this.tabMenu[subMenuIndex2]).then(() => {
        document.getElementsByClassName('MenuActive')[0].style.color = colorArr[index]
        document.getElementsByClassName('tabActive')[0].style.color = colorArr[index]
      })
      this.$forceUpdate()
    },
    // 路由跳转
    async routerLink (index, item) {
      await this.$router.push(item)
      this.indexTab = index
    },
    // 路由跳转(3级菜单)
    async routerLink2 (index, item) {
      console.log(index, item)
      await this.$router.push(item)
      this.indexTab2 = index
    },
    // 切换左部菜单
    async switchTab (index, item) {
      if (item.children !== undefined) {
        // 三级菜单
        item.isShow = !item.isShow
        if (item.isShow) {
          for (var i in this.tabMenu) {
            this.tabMenu[i].isShow = false
          }
          item.isShow = !item.isShow
          await this.changeStyle(index, item)
          this.switchTab2(0, item.children[0], index)
        }
      } else {
        await this.changeStyle(index, item)
      }
    },
    // 切换2级菜单后改变对应样式
    async changeStyle (index, item) {
      var subArr = document.getElementsByClassName('tabColor')
      for (var i = 0; i < subArr.length; i++) {
        subArr[i].style.color = '#CEEEFF'
        document.getElementsByClassName('tabActiveI')[i].style.backgroundColor = this.currentColor
      }
      await this.routerLink(index, item.path).then(() => {
        document.getElementsByClassName('tabActive')[0].style.color = this.currentColor
      })
    },
    // 切换左部3级菜单
    async switchTab2 (position, item, index) {
      var subArr = document.getElementsByClassName('sub-li-' + index)
      await this.routerLink2(position, item.path).then(() => {
        for (var i = 0; i < subArr.length; i++) {
          subArr[i].style.color = '#CEEEFF'
          subArr[i].style.backgroundColor = '#293747'
          subArr[position].style.backgroundColor = '#2CC0E8'
        }
      })
    },
    showMenu () {
      this.showMenuFlag = !this.showMenuFlag
      this.$forceUpdate()
    },
    updatePwd () {
      this.showMenuFlag = false
      this.$router.push('/update_pwd')
    },
    logOut () {
      clearInterval(this.timeInterval)
      localStorage.clear()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
html,
body {
  height: 100%;
}
.page {
  width: 100%;
  height: 100%;
  background-color: #21394d;
  display: flex;
  flex-direction: row;
}
.left {
  font-size: 0.52rem;
  width: 6.86rem;
  color: #ceeeff;
}
.left .img {
  display: flex;
  justify-content: center;
}
.left .img img {
  align-self: center;
  width: 3.72rem;
  height: 1.16rem;
}

.left > li:first-child {
  height: 2rem;
  border-bottom: solid 2px #1d2732;
}
.left li.tabColor {
  /* height: 1.7rem; */
}
.sub-title {
  border-bottom: solid 2px #1d2732;
  padding: 0 0 0 1.2rem;
  line-height: 1.7rem;
  text-align: left;
  cursor: pointer;
}
.sub-content {
}
.sub-content li {
  border-bottom: solid 2px #1d2732;
  padding: 0 0 0 2rem;
  line-height: 1.7rem;
  text-align: left;
  cursor: pointer;
}
.left li.tabActive {
  background-color: #000;
  position: relative;
}
.left li.tabActive .tabActiveI {
  background-color: #00ce91;
  position: absolute;
  left: 0.1rem;
  top: 0.1rem;
  height: 1.52rem;
  width: 5px;
}
.left li.sub-content-li {
  line-height: 1.7rem;
}
.copyright {
  color: #9b9b9b;
  position: absolute;
  bottom: 0.3rem;
  font-size: 0.28rem;
  font-weight: 400;
  width: 6.86rem;
  text-align: center;
}
.right {
  /* width: 31.54rem; */
  width: calc(100% - 6.86rem) !important;
}
.top {
  font-size: 0.56rem;
  width: 100%;
  height: 2rem;
  display: flex;
  flex-direction: row;
  color: #ceeeff;
  justify-content: space-between;
}
.user-info {
  height: 2rem;
  display: flex;
  flex-direction: column;
  padding: 0.44rem;
  color: #fdbc51;
  font-size: 0.24rem;
  cursor: pointer;
}
.user-info .menu {
  position: fixed;
  right: 0;
  top: 2rem;
  width: 4.5rem;
  height: 2rem;
  background-color: #3c3e49;
  color: #fff;
  z-index: 9999;
}

.user-info .menu li {
  height: 1rem;
  line-height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid #21394d;
}
.menu li span {
  font-size: 0.24rem;
}
.menu li:hover {
  background-color: #658bd6;
}
.menu li i {
  display: block;
  width: 0.3rem;
  height: 0.3rem;
  margin: 0.3rem 0.22rem;
}
i.icon-update-pwd {
  background: url("../../assets/image/icon-home-up-pwd.png") no-repeat;
  background-size: 100%;
}
i.icon-logout {
  background: url("../../assets/image/icon-home-logout.png") no-repeat;
  background-size: 100%;
}
.user {
  height: 1.3rem;
  display: flex;
  flex-direction: row;
}
.user .text-info {
  height: 0.24rem;
  line-height: 0.24rem;
}
.text-info:last-child {
  margin: 0.09rem 0 0 0;
  font-size: 0.2rem;
  width: 1.7rem;
}
.info {
  text-align: left;
  padding: 0 0 0 0.16rem;
  height: 1.3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.user-img {
  height: 1.3rem;
  width: 1.8rem;
}
.user-img img {
  width: 0.92rem;
  height: 0.92rem;
  border-radius: 50%;
}
.header {
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: row;
}
.header li {
  width: 4.66rem;
  height: 2rem;
  line-height: 2rem;
  color: #fff;
  border-left: solid 2px #1d2732;
}
.header li:last-child {
  border-right: solid 2px #1d2732;
}

.header li.color0 {
  border-bottom: 5px solid #00ce91;
}
.header li.color1 {
  border-bottom: 5px solid #f4eb42;
}
.header li.color2 {
  border-bottom: 5px solid #fdbc51;
}
.content {
  width: 100%;
  height: calc(100% - 2rem) !important;
  background-color: #f2f3f8;
  overflow: auto;
}
</style>
