<template>
  <div class="page">
    <div class="top">
      <span>楼栋：</span>
      <location-one ref="location" @sendLocationValue = getLocationValue></location-one>
    </div>
    <div class="number-summary">
      <ul>
        <li>
          <div class="color1">
            <span class="name">宿舍楼总数</span>
            <span class="value" v-loading="loadingTop">{{dormitory.building}}</span>
          </div>
        </li>
        <li>
          <div class="color2">
            <span class="name">入住总人数</span>
            <span class="value" v-loading="loadingTop">{{dormitory.currentPeople}}</span>
          </div>
        </li>
        <li>
          <div class="color3">
            <span class="name">当前总人数</span>
            <span class="value" v-loading="loadingTop">{{dormitory.currentStrangerPeople}}</span>
          </div>
        </li>
        <li>
          <div class="color4">
            <span class="name">当前陌生人数</span>
            <span class="value" v-loading="loadingTop">{{dormitory.occupancyPeople}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="left-list">
        <p>人员感知</p>
        <ul>
          <li class="card"
          v-for="(item, index) in peopleList"
          :key="index"
          v-show="item.locationID === locationValue"
          @click="toDetail(item)">
            <div v-if="item.strangerID" class="stranger">
              <img :src="minioUrl + item.headUrl" alt="">
              <div class="user-info">
                <p>--</p>
                <ul>
                  <li>时间：{{item.nowTime}}</li>
                  <li class="long">宿舍：{{item.fullLocationName}}</li>
                  <li class="long">标签：<span class="red">{{item.tags}}</span></li>
                  <li>设备：{{item.nowTime}}</li>
                </ul>
              </div>
            </div>
            <div v-else :class="item.nowTime > lateTime ? 'late': ''">
              <img :src="minioUrl + item.headUrl" alt="">
              <div class="user-info">
                <p>{{item.peopleInfo.name}}</p>
                <ul>
                  <li>时间：{{item.nowTime}}</li>
                  <li class="long">宿舍：{{item.fullLocationName}}</li>
                  <li>班级：
                    <el-tooltip :content="item.peopleInfo.idCardNo" placement="top" :open-delay=300>
                      <span>{{item.peopleInfo.idCardNo}}</span>
                    </el-tooltip>
                  </li>
                  <li class="long">专业：
                    <el-tooltip :content="item.peopleInfo.fullOrganizationName" placement="top" :open-delay=300>
                      <span>{{item.peopleInfo.fullOrganizationName}}</span>
                    </el-tooltip>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right-info">
        <div class="hostel">
          <div class="title">
            <span>宿舍实况</span>
            <span @click="toDetailPage(1, 1)" class="cursor-pointer can-click">详情</span>
          </div>
          <ul class="hostel-info">
            <li class="info" @click="toDetailPage(1, 1)">
              <div class="number color1" v-loading="loadingRightTop">{{totalDor.total}}</div>
              <!-- <div class="trend">
                <span class="date">昨天</span>
                <i :class="totalDor.total - totalDor.yesterdayTotal > 0 ? 'up' : 'down'"></i>
                <span class="numbers" v-loading="loadingRightTop2">{{Math.abs(totalDor.total - totalDor.yesterdayTotal)}}</span>
              </div> -->
              <div class="text">宿舍常住人数</div>
            </li>
            <li class="info" @click="toDetailPage(1, 2)">
              <div class="number color2" v-loading="loadingRightTop">{{totalDor.current}}</div>
              <!-- <div class="trend">
                <span class="date">昨天</span>
                <i :class="totalDor.current - totalDor.yesterdayCurrent > 0 ? 'up' : 'down'"></i>
                <span class="numbers" v-loading="loadingRightTop2">{{Math.abs(totalDor.current - totalDor.yesterdayCurrent)}}</span>
              </div> -->
              <div class="text">当前常住人数</div>
            </li>
            <li class="info" @click="toDetailPage(3, 2)">
              <div class="number color3" v-loading="loadingRightTop">{{totalDor.stranger}}</div>
                <!-- <div class="trend">
                  <span class="date">昨天</span>
                  <i :class="totalDor.stranger - totalDor.yesterdayStranger > 0 ? 'up' : 'down'"></i>
                  <span class="numbers" v-loading="loadingRightTop2">{{Math.abs(totalDor.stranger - totalDor.yesterdayStranger)}}</span>
                </div> -->
              <div class="text">当前陌生人数</div>
            </li>
          </ul>
        </div>

        <div class="hostel">
          <div class="title">
            <span>考勤概况（<span class="mini-font">{{day}}</span>）</span>
            <span @click="toDetailPage(2, 0)" class="cursor-pointer can-click">详情</span>
          </div>
          <ul class="hostel-info">
            <li class="info" @click="toDetailPage(3, 1)">
              <div class="number color1" v-loading="loadingRightBottom">{{totalDuty.stranger}}</div>
              <!-- <div class="trend">
                <span class="date">前天</span>
                <i :class="totalDuty.stranger - totalDuty.yesterdayStranger > 0 ? 'up' : 'down'"></i>
                <span class="numbers" v-loading="loadingRightBottom2">{{Math.abs(totalDuty.stranger - totalDuty.yesterdayStranger)}}</span>
              </div> -->
              <div class="text">累计陌生人</div>
            </li>
            <li class="info" @click="toDetailPage(2, 0)">
              <div class="number color2" v-loading="loadingRightBottom">{{totalDuty.late}}</div>
              <!-- <div class="trend">
                <span class="date">前天</span>
                <i :class="totalDuty.late - totalDuty.yesterdayLate > 0 ? 'up' : 'down'"></i>
                <span class="numbers" v-loading="loadingRightBottom2">{{Math.abs(totalDuty.late - totalDuty.yesterdayLate)}}</span>
              </div> -->
              <div class="text">迟到人数</div>
            </li>
            <li class="info" @click="toDetailPage(2, 1)">
              <div class="number color3" v-loading="loadingRightBottom">{{totalDuty.noBack}}</div>
              <!-- <div class="trend">
                <span class="date">前天</span>
                <i :class="totalDuty.noBack - totalDuty.yesterdayNoBack > 0 ? 'up' : 'down'"></i>
                <span class="numbers" v-loading="loadingRightBottom2">{{Math.abs(totalDuty.noBack - totalDuty.yesterdayNoBack)}}</span>
              </div> -->
              <div class="text">未归人数</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      minioUrl: window.localStorage.getItem('minioUrl'),
      locationValue: '',
      peopleList: [], // mqtt感知到的人员列表
      dormitory: {
        building: 0,
        currentPeople: 0,
        currentStrangerPeople: 0,
        occupancyPeople: 0
      },
      // 宿舍
      totalDor: {
        total: 0,
        current: 0,
        stranger: 0,
        yesterdayTotal: 0,
        yesterdayCurrent: 0,
        yesterdayStranger: 0
      },
      // 考勤
      totalDuty: {
        stranger: 0,
        late: 0,
        noBack: 0,
        yesterdayStranger: 0,
        yesterdayLate: 0,
        yesterdayNoBack: 0
      },
      day: '',
      interval: '',
      lateTime: '',
      // 加载中
      loadingTop: false,
      loadingRightTop: false,
      loadingRightTop2: false,
      loadingRightBottom: false,
      loadingRightBottom2: false,
      // 请求时间
      today: '',
      yesterday: '',
      beforeYesterday: ''
    }
  },
  mounted () {
    this.getLateTime()
    this.today = this.$common.getDay(0)
    this.yesterday = this.$common.getDay(86400000) // 86400000 = 24*60*60*1000 就是一天的意思
    this.beforeYesterday = this.$common.getDay(172800000)
    // 考勤概况处显示的是昨天的时间
    this.day = this.yesterday
    this.$refs.location.changeBuilding()
    this.getTopInfo()
    // 每隔1分钟刷新一次首页数据
    this.interval = setInterval(() => {
      this.getTopInfo()
      this.$refs.location.changeBuilding()
    }, 60000)
    // 判断是否有缓存的mqtt数据
    var mqttPeopleList = JSON.parse(localStorage.getItem('mqttPeopleList' + this.locationValue))
    this.peopleList = mqttPeopleList === null ? [] : mqttPeopleList
    var tem = +new Date()
    this.$mqtt.launch('school-h5web' + tem, (topic, source) => {
      console.log('message: ', JSON.parse(source.toString()))
      var item = JSON.parse(source.toString())
      if (item.locationID === this.locationValue) {
        item.nowTime = this.$common.getTime()
        this.peopleList.unshift(item)
        // 默认只显示50条，自动删除累积的数据，自动缓存最新的5条数据
        this.peopleList = this.peopleList.length > 50 ? this.peopleList.slice(0, 50) : this.peopleList
        localStorage.setItem('mqttPeopleList' + this.locationValue, JSON.stringify(this.peopleList.slice(0, 5)))
      }
    })
  },
  beforeDestroy () {
    this.$mqtt.end()
    clearInterval(this.interval)
  },
  methods: {
    // 获取迟到时间
    async getLateTime () {
      var params = {
        name: '迟到时间',
        userID: ''
      }
      await this.$post(this.$store.state.api['getKey'], params).then(data => {
        this.lateTime = data.data
      })
    },
    getLocationValue (value) {
      this.locationValue = value
      this.getRightTopInfo()
      this.getRightBottomInfo()
    },
    // 获取顶总数据
    getTopInfo () {
      this.loadingTop = true
      var params = {
        type: '学生'.split(),
        locationID: '' // 这里就是要不传，代表全部
      }
      params.time = {
        from: '2000-01-01 00:00:00',
        to: this.today + ' 23:59:59'
      }
      this.$post(this.$store.state.api['getLocationPeopleInOutCount'], params).then((res) => {
        this.dormitory.building = res.data.locationCount
        this.dormitory.currentPeople = res.data.peopleTotal
        this.dormitory.currentStrangerPeople = res.data.peopleIn
        this.dormitory.occupancyPeople = res.data.strangerIn
        this.loadingTop = false
      }).catch(() => {
        this.$message.error('错误')
        this.loadingTop = false
      })
    },
    // 获取宿舍实况
    getRightTopInfo () {
      this.loadingRightTop = true
      this.loadingRightTop2 = true
      var params = {
        locationID: this.locationValue,
        time: {
          from: this.today + ' 00:00:00',
          to: this.today + ' 23:59:59'
        }
      }
      this.$post(this.$store.state.api['dutyInfo'], params).then((res) => {
        this.totalDor.total = res.data.peopleTotalInfo
        this.totalDor.current = res.data.peopleInInfo
        this.totalDor.stranger = res.data.strangerInInfo
        this.loadingRightTop = false
        // this.getRightTopInfo2()
      }).catch(() => {
        this.$message.error('错误')
        this.loadingRightTop = false
      })
    },
    // 获取宿舍实况 -- 昨天
    getRightTopInfo2 () {
      var param = {
        locationID: this.locationValue
      }
      var time = this.$common.getTime()
      param.time = {
        from: this.yesterday + ' 00:00:00',
        to: this.yesterday + ' ' + time
      }
      this.$post(this.$store.state.api['dutyInfo'], param).then((item) => {
        this.totalDor.yesterdayTotal = item.data.peopleTotalInfo
        this.totalDor.yesterdayCurrent = item.data.peopleInInfo
        this.totalDor.yesterdayStranger = item.data.strangerInInfo
        this.loadingRightTop2 = false
      }).catch(() => {
        this.$message.error('错误')
        this.loadingRightTop2 = false
      })
    },
    // 获取考勤概况
    getRightBottomInfo () {
      this.loadingRightBottom = true
      this.loadingRightBottom2 = true
      var params = {
        locationID: this.locationValue,
        time: {
          from: this.yesterday + ' 00:00:00',
          to: this.yesterday + ' 23:59:59'
        }
      }
      this.$post(this.$store.state.api['dutyInfo'], params).then((res) => {
        this.totalDuty.noBack = res.data.countNotBackPeopleInfo
        this.totalDuty.late = res.data.countLatePeopleInfo
        this.totalDuty.stranger = res.data.countAllStrangerInfo
        this.loadingRightBottom = false
        // this.getRightBottomInfo2()
      }).catch(() => {
        this.$message.error('错误')
        this.loadingRightBottom = false
      })
    },
    // 获取考勤概况 -- 前天
    getRightBottomInfo2 () {
      var param = {
        locationID: this.locationValue
      }
      param.time = {
        from: this.beforeYesterday + ' 00:00:00',
        to: this.beforeYesterday + ' 23:59:59'
      }
      this.$post(this.$store.state.api['dutyInfo'], param).then((item) => {
        this.totalDuty.yesterdayNoBack = item.data.countNotBackPeopleInfo
        this.totalDuty.yesterdayLate = item.data.countLatePeopleInfo
        this.totalDuty.yesterdayStranger = item.data.countAllStrangerInfo
        this.loadingRightBottom2 = false
      }).catch(() => {
        this.$message.error('错误')
        this.loadingRightBottom2 = false
      })
    },

    toDetail (item) {
      if (item.peopleID) {
        this.$router.push({path: '/peoManager/peopleDetails', query: {index: 0, peopleID: item.peopleID}})
      } else {
        this.$router.push({path: '/stranger_detail', query: {strangerID: item.strangerID}})
      }
    },
    toDetailPage (index, type) {
      switch (index) {
        case 1:
          // 宿舍当前信息
          this.$store.state.nowInfoType = type
          this.$EventBus.$emit('switchMenu', index, {
            name: '宿舍当前信息',
            path: '/dormitory/nowinfo'
          })
          break
        case 2:
          // 考勤异常信息
          this.$store.state.exceptionType = type
          this.$EventBus.$emit('switchMenu', index, {
            name: '考勤异常信息',
            path: '/dormitory/exception'
          })
          break
        case 3:
          // 陌生人管理
          this.$store.state.strangerHome = true
          this.$store.state.strangerHomeIndex = type
          this.$EventBus.$emit('switchMenu', index, {
            name: '陌生人管理',
            path: '/dormitory/stranger'
          })
          break
        default:
          break
      }
    }
  }
}
</script>
<style scoped>
.page{
  /* height: 100%; */
  padding: .2rem;
  background: #fff;
}
.top{
  height: 1.66rem;
  line-height: 1.66rem;
  border-bottom: .02rem solid #eee;
  text-align: left;
  width: 100%;
  padding: 0 .5rem;
}
.top span{
  font-size: .44rem;
}
.top .el-select{
  width: 5.6rem;
  height: .76rem;
}
/deep/ .el-input--mini .el-input__inner{
  line-height: .76rem;
}
.number-summary,.number-summary ul {
  height: 2.28rem;
  line-height: 2.28rem;
  border-bottom: .02rem solid #eee;
  width: 100%;
  float: none;
  display: flex;
  flex-direction: row;
}
.number-summary li{
  width: 25%;
  color: #fff;
  margin: .1rem .4rem;
  padding: .32rem;
}
.number-summary li div{
  padding: 0 .66rem 0 .6rem;
  width: 6.2rem;
  height: 1.4rem;
  display: flex;
  justify-content: space-between;
}

.number-summary li div.color1{
  background: linear-gradient(90deg,#5883D4,#A8B3E2);
}
.number-summary li div.color2{
  background: linear-gradient(90deg,#44A2FE,#7A82FF);
}
.number-summary li div.color3{
  background: linear-gradient(90deg,#5883D4,#A8B3E2);
}
.number-summary li div.color4{
  background: linear-gradient(90deg,#44A2FE,#7A82FF);
}

.number-summary li div span{
  display: flex;
  align-self: center;
}
.number-summary li div span.value{
  font-size: .8rem;
}
.content{
  padding: .4rem .44rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.left-list{
  width: 40%;
}
.left-list>p{
  font-size: .44rem;
  margin: 0 0 .4rem .14rem;
  text-align: left;
}
.left-list ul{
  height: 13.6rem;
  overflow: auto;
}

.card:last-child{
  margin: 0;
}
.card>div{
  border: solid .02rem #DCDFE6;
  /* width: 100%; */
  width: 11.5rem;
  height: 2.4rem;
  margin: .15rem .15rem .35rem .15rem;
  border-radius: .08rem;
  padding: .4rem .6rem .4rem .68rem;
  display: flex;
  flex-direction: row;
  position: relative;
  cursor: pointer;
}
.card>div::before, .card>div::after{
  position: absolute;
  right: 0;
  top: 0;
  width: 1.8rem;
  height: .6rem;
  line-height: .6rem;
  color: #fff;
  font-size: .34rem;
}
.card>div::after{
  right: 1.8rem;
}

.stranger{
  border-color: #FF6779!important;
  border-width:  .04rem!important;
  border:1px solid green;
  animation: flash .7s linear .7s infinite alternate!important;
}
.late{
  border-color: #9C67FF!important;
}
@keyframes flash {
  0% {
    box-shadow: none;
  }
  100% {
    box-shadow: 0 0 .25rem #f00;
  }
}
.stranger::before{
  content: '陌生人';
  background-color: #FF6779;
  border-color: #FF6779;
  transition:border linear .2s;
  box-shadow:0 0 .2rem rgba(111,1,32,3);
}
/* .stranger::after{
  content: '首次';
  background-color: #FF7967;
} */
.late::before{
  content: '晚归';
  background-color: #9C67FF;
}
.card img{
  width: 1.6rem;
  height: 1.6rem;
  object-fit: fill;
}
.card .user-info{
  margin: 0 0 0 .6rem;
  width: 8rem;
}
.card p{
  height: .6rem;
  line-height: .6rem;
  font-size: .36rem;
  color: #606266;
  text-align: left;
}
.card ul{
  height: 1rem;
  font-size: .32rem;
  color: #909399;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.card ul li{
  width: 33.3%;
  height: .5rem;
  line-height: .5rem;
  font-size: .32rem;
  text-align: left;
  overflow: hidden;
}
.card ul li.long{
  width: 66.6%;
}
.red{
  color: #D81E06;
}
.right-info{
  padding: .18rem 0 0 0;
  display: flex;
  flex-direction: column;
  width: 55%;
}
.hostel{
  display: flex;
  flex-direction: column;
  width: 100%;
  /* width: 17.44rem; */
}
.hostel + .hostel{
  margin: .6rem 0 0 0;
}
.hostel .title{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: .44rem;
}
.hostel-info{
  width: 100%;
  height: 6.16rem;
  margin: .16rem 0 0 0;
  padding: .8rem 0 1.2rem 0;
  background:rgba(255,255,255,1);
  border:.02rem solid rgba(228,231,237,1);
  box-shadow: 0 .04rem .24rem rgba(0,0,0,0.06);
  opacity: 1;
  border-radius: .08rem;
  display: flex;
  flex-direction: row;
}
.info{
  width: 33.3%;
  /* height: 4.16rem; */
  height: 3.66rem;
  line-height: 3.16rem;
  padding: .5rem 0;
  margin: .3rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}
.info:not(:last-child){
  border-right: .02rem solid #C8CDD4;
}
.info .number{
  height: 1.32rem;
  font-size: 1rem;
  font-weight:400;
  line-height: 1.32rem;
}

.number.color1{
  color: #0021FF;
}
.number.color2{
  color: #0021FF;
}
.number.color3{
  color: #A700FF;
}
.info .trend{
  height: .5rem;
  line-height: .5rem;
  color: #27394B;
  margin: .66rem 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.trend .date{
  width: .1.08rem;
}
.trend i{
  width: .3rem;
  height: .5rem;
  display: block;
  margin: 0 .34rem;
}
.up{
  background: url('../../../assets/image/icon-home-up.png') no-repeat;
  background-size: 100%;
}
.down{
  background: url('../../../assets/image/icon-home-down.png') no-repeat;
  background-size: 100%;
}
.numbers{
  font-size: .4rem;
  color: #D81E06;
}
.info .text{
  height: .8rem;
  line-height: .8rem;
  font-size: .6rem;
  color: #27394B;
}
.mini-font{
  font-size: .35rem;
}
/* element-ui的v-loading自带的颜色改为透明色 */
/deep/ .el-loading-mask{
  background-color: transparent;
}
</style>
