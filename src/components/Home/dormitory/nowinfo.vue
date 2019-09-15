<template>
  <div class="page">
    <div class="top">
      <div>
        <span>楼栋：</span>
        <location-one ref="location" @sendLocationValue=getLocationValue></location-one>
      </div>
    </div>
    <ul class="number-summary">
      <li :class="$store.state.nowInfoType == 1 ? 'is-active' : ''" @click="switchTag(1)">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading1">{{total.total}}</span>
            <span class="name">常住人数</span>
          </div>
        </div>
      </li>
      <li :class="$store.state.nowInfoType == 2 ? 'is-active' : ''" @click="switchTag(2)">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading2">{{total.current}}</span>
            <span class="name">当前人数</span>
          </div>
        </div>
      </li>
      <li :class="$store.state.nowInfoType == 3 ? 'is-active' : ''" @click="switchTag(3)">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading3">{{total.noBack}}</span>
            <span class="name">昨日未归</span>
          </div>
        </div>
      </li>
      <li :class="$store.state.nowInfoType == 4 ? 'is-active' : ''" @click="switchTag(4)">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading3">{{total.late}}</span>
            <span class="name">昨日迟到</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="content" v-loading="loadingData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table v-if="tableData.length > 0" height="100" key="people" :data="tableData" style="width: 100%">
        <el-table-column width="200" prop="idCardNo" show-overflow-tooltip label="学号">
        </el-table-column>
        <el-table-column width="200" prop="name" show-overflow-tooltip label="姓名">
        </el-table-column>
        <el-table-column prop="locationStr" show-overflow-tooltip label="宿舍">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="organizationStr" label="班级">
        </el-table-column>
        <el-table-column width="200" label="详情">
          <template slot-scope="scope">
            <span class="detail" @click="toDetail(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <searchNull v-else></searchNull>
      <el-pagination v-if="tableData.length > 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 50, 100]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      locationValue: '',
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      total: {
        total: 0,
        current: 0,
        noBack: 0,
        late: 0
      },
      tableData: [],
      data: [],
      loading1: false,
      loading2: false,
      loading3: false,
      loadingData: false
    }
  },
  mounted () {
    this.$refs.location.changeBuilding()
  },
  methods: {
    // 常住人数是不受时间限制的，当前人数限制今天，昨天人数限制昨天
    // 常住人数
    getType1 () {
      this.loading1 = true
      var today = this.$common.getDay(0)
      var params = {
        locationID: this.locationValue,
        time: {
          from: '2000-01-01 00:00:00',
          to: today + ' 23:59:59'
        }
      }
      this.$post(this.$store.state.api['dutyInfo'], params).then((res) => {
        this.total.total = res.data.peopleTotalInfo
        this.loading1 = false
      }).catch(() => {
        this.loading1 = false
      })
    },
    // 当前人数
    getType2 () {
      this.loading2 = true
      var today = this.$common.getDay(0)
      var param = {
        locationID: this.locationValue
      }
      param.time = {
        from: today + ' 00:00:00',
        to: today + ' 23:59:59'
      }
      this.$post(this.$store.state.api['dutyInfo'], param).then((res) => {
        this.total.current = res.data.peopleInInfo
        this.loading2 = false
      }).catch(() => {
        this.loading2 = false
      })
    },
    // 昨天人数
    getType3 () {
      this.loading3 = true
      var param = {
        locationID: this.locationValue
      }
      var yesterday = this.$common.getDay(86400000)
      param.time = {
        from: yesterday + ' 00:00:00',
        to: yesterday + ' 23:59:59'
      }
      this.$post(this.$store.state.api['dutyInfo'], param).then((item) => {
        this.total.noBack = item.data.countNotBackPeopleInfo
        this.total.late = item.data.countLatePeopleInfo
        this.loading3 = false
      }).catch(() => {
        this.loading3 = false
      })
    },
    getData () {
      this.loadingData = true
      var type = this.$store.state.nowInfoType === 3 ? '未归' : '迟到'
      var locationArr = []
      var today = this.$common.getDay(0)
      locationArr.push(this.locationValue)
      switch (this.$store.state.nowInfoType) {
        // 常住人数
        case 1:
          var params1 = {
            locationID: locationArr,
            type: '学生',
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            createTime: {
              from: '2000-01-01 00:00:00',
              to: today + ' 23:59:59'
            }
          }
          this.$post(this.$store.state.api.queryPeopleList, params1).then((res) => {
            this.tableData = res.data.data
            this.totalPage = res.data.count
            // this.changePage()
            this.loadingData = false
          }).catch(() => {
            this.loadingData = false
          })
          break
        // 当前人数
        case 2:
          var params2 = {
            location: {
              id: this.locationValue,
              inoutType: 'in'
            },
            time: {
              from: today + ' 00:00:00',
              to: today + ' 23:59:59'
            }
          }
          this.$post(this.$store.state.api.queryPeopleLog, params2).then((res) => {
            this.data = res.data
            this.totalPage = this.data.length
            this.changePage()
            this.loadingData = false
          }).catch(() => {
            this.loadingData = false
          })
          break
        // 当前人数
        case 3:
        case 4:
          var yesterday = this.$common.getDay(86400000)
          var params3 = {
            peopleType: '学生',
            locationID: this.locationValue,
            notReturnDays: '>1',
            attendType: type,
            time: {
              from: yesterday,
              to: yesterday
            }
          }
          this.$post(this.$store.state.api.queryAttendLog, params3).then((res) => {
            this.data = res.data
            this.totalPage = this.data.length
            this.changePage()
            this.loadingData = false
          }).catch(() => {
            this.loadingData = false
          })
          break
        default:
          this.loadingData = false
          break
      }
    },
    // 前端分页功能
    changePage () {
      this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    },
    searchFun () {
      this.$refs.location.changeBuilding()
    },
    getLocationValue (value) {
      this.locationValue = value
      this.getType1()
      this.getType2()
      this.getType3()
      this.getData()
    },
    toDetail (item) {
      var index = item.type === '学生' ? 0 : 1
      this.$router.push({ path: '/peoManager/peopleDetails', query: { index: index, peopleID: item.peopleID } })
    },
    // 切换每页多少条
    handleSizeChange (val) {
      this.pageSize = val
      // this.changePage()
      this.getData()
    },
    // 切换当前页
    handleCurrentChange (val) {
      this.currentPage = val
      // this.changePage()
      this.getData()
    },
    switchTag (index) {
      this.$store.state.nowInfoType = index
      this.getData()
      this.$forceUpdate()
    }
  }
}
</script>
<style scoped>
.page {
  height: 100%;
}
.top {
  height: 1.66rem;
  line-height: 1.66rem;
  border-bottom: 1px solid #eee;
  text-align: left;
  width: 100%;
  padding: 0 0.5rem;
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.top .el-select {
  width: 5.6rem;
  height: 0.76rem;
}
/deep/ .el-input--mini .el-input__inner {
  line-height: 0.76rem;
}
/deep/ .el-input--small .el-input__inner {
  height: 0.76rem;
  line-height: 0.76rem;
}
.top span {
  font-size: 0.44rem;
}
.search-box {
  width: 11rem;
}
.search-box .el-input {
  width: 8.6rem;
}
.search-box .el-button {
  background-color: #d6ce3b;
  width: 1.8rem;
  color: #fff;
  font-size: 0.4rem;
  font-weight: 400;
  border-radius: 0.1rem;
}
ul.number-summary {
  height: 3.56rem;
  line-height: 3.56rem;
  width: 100%;
  float: none;
  display: flex;
  flex-direction: row;
  padding: 0.44rem 0.48rem 0.52rem;
}
.number-summary li {
  cursor: pointer;
  width: 4.8rem;
  height: 2.6rem;
  line-height: 2.6rem;
  text-align: center;
  color: #fff;
  margin: 0 0.6rem 0 0;
  padding: 0.58rem 0.76rem;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
}

.number-summary li .con {
  width: 3.34rem;
  height: 1.46rem;
  position: relative;
}

.number-summary li i {
  width: 1.26rem;
  height: 1.26rem;
  background: url("../../../assets/image/icon-home-people.png") no-repeat;
  background-size: 100%;
  float: left;
  position: absolute;
  top: 0.08rem;
  left: 0;
}

.number-summary li.is-active i {
  background: url("../../../assets/image/icon-home-people-white.png") no-repeat;
  background-size: 100%;
}
.number-summary li.is-active {
  background-color: #9fdafa;
}
.number-summary li .right-text {
  position: absolute;
  right: 0;
  top: 0;
  width: 2rem;
  height: 1.44rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.number-summary li .right-text span.value {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.65);
  height: 0.8rem;
  line-height: 0.8rem;
}
.number-summary li.is-active .right-text span.value {
  color: #fff;
}
.number-summary li.is-active .right-text span.name {
  color: #fff;
}
.number-summary li .right-text span.name {
  font-size: 0.4rem;
  color: rgba(0, 0, 0, 0.35);
  height: 0.56rem;
  line-height: 0.56rem;
}
.content {
  padding: 0 0.44rem 0.4rem 0.44rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 5.28rem) !important;
}
.el-pagination {
  margin: 0.46rem 0 0 0;
  display: flex;
  justify-content: flex-end;
}
.detail {
  height: 0.5rem;
  font-size: 0.36rem;
  line-height: 0.5rem;
  color: rgba(164, 217, 255, 1);
  cursor: pointer;
}

.header {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid #eee;
}

.search-btn {
  margin: 0.44rem 0;
  background-color: #66a2e4;
  width: 2rem;
  height: 0.76rem;
  line-height: 0.76rem;
  text-align: center;
  color: #fff;
  float: right;
  font-size: 0.4rem;
  font-weight: 400;
  border-radius: 0.1rem;
  cursor: pointer;
}
/* element-ui的v-loading自带的颜色改为透明色 */
/deep/ .is-active .el-loading-mask {
  background-color: transparent;
}
</style>
