<template>
  <div class="page">
    <p>陌生人概况</p>
    <ul class="number-summary">
      <li v-if="dateValue === null" @click="switchTag(1)" :class="currentTag === 1 ? 'is-active' : ''">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading">{{total.countAllStrangerInfo}}</span>
            <span class="name">当日累计</span>
          </div>
        </div>
      </li>
      <li v-else class="gray">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading">{{total.countAllStrangerInfo}}</span>
            <span class="name">当日累计</span>
          </div>
        </div>
      </li>
      <li v-if="dateValue === null" @click="switchTag(2)" :class="currentTag === 2 ? 'is-active' : ''">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading">{{total.strangerInInfo}}</span>
            <span class="name">当前陌生人</span>
          </div>
        </div>
      </li>
      <li v-else class="gray">
        <div class="con">
          <i></i>
          <div class="right-text">
            <span class="value" v-loading="loading">{{total.strangerInInfo}}</span>
            <span class="name">当前陌生人</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="top">
      <div class="line">
        <span>楼栋：</span>
        <location-one ref="location" @sendLocationValue = getLocationValue></location-one>
      </div>
      <div class="line line-date">
        <span>日期：</span>
        <el-date-picker
          v-if="currentTag !== ''"
          :disabled="true"
          size="small"
          v-model="dateValue"
          value-format = 'yyyy-MM-dd'
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-date-picker
          v-else
          size="small"
          v-model="dateValue"
          value-format = 'yyyy-MM-dd'
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="search-btn" @click="searchFun">搜索</div>
    </div>
    <div class="content"
      v-loading="loadingData"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        height="100"
        style="width: 100%">
        <el-table-column
          width="100"
          label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.photo" :onerror="errorIMG" alt="" class="header">
          </template>
        </el-table-column>
        <el-table-column
          prop="fullLocationName"
          show-overflow-tooltip
          label="楼栋">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="时间">
          <template slot-scope="scope">
            <span @click="toDetail">{{$common.myTimeToLocal(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="标签">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.tags" placement="top" :open-delay=300>
              <span @click="toDetail">{{scope.row.tags}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="详情">
          <template slot-scope="scope">
            <span class="detail" @click="toDetail(scope.row.strangerID)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <searchNull v-else></searchNull>
      <el-pagination
        v-if="tableData.length > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      errorIMG: 'this.src="' + require('../../../assets/image/icon-people-default.png') + '"',
      currentTag: 1,
      currentType: '',
      dateValue: null,
      total: {
        countAllStrangerInfo: 0,
        strangerInInfo: 0
      },
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      tableData: [],
      data: [],
      loading: false,
      loadingData: false,
      today: ''
    }
  },
  mounted () {
    if (this.$store.state.strangerHome === true) {
      this.$store.state.strangerHome = false
      if (this.$store.state.strangerHomeIndex === 1) {
        // 请求昨日陌生人
        var yesterday = this.$common.getDay(86400000)
        this.dateValue = [yesterday, yesterday]
        this.currentTag = ''
      } else {
        // 请求当前陌生人
        this.currentTag = 2
      }
    }
    this.today = this.$common.getDay(0)
    this.$refs.location.changeBuilding()
  },
  methods: {
    // 前端分页功能
    changePage () {
      this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    },
    searchFun () {
      this.$refs.location.changeBuilding()
    },
    getLocationValue (value) {
      this.locationValue = value
      this.getData()
      this.getStatus()
    },
    // 获取顶部数据
    getStatus () {
      this.loading = true
      var param = {
        locationID: this.locationValue,
        time: {
          from: '',
          to: ''
        }
      }
      if (this.dateValue === null || this.dateValue === '') {
        param.time.from = this.today + ' 0:0:0'
        param.time.to = this.today + ' 23:59:59'
      } else {
        param.time.from = this.dateValue[0]
        param.time.to = this.dateValue[1]
      }
      this.$post(this.$store.state.api['dutyInfo'], param).then((res) => {
        this.total.countAllStrangerInfo = res.data.countAllStrangerInfo
        this.total.strangerInInfo = res.data.strangerInInfo
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取陌生人列表
    getData () {
      this.loadingData = true
      this.currentType = this.currentTag === 2 ? 'in' : 'both'
      var param = {
        location: {
          id: this.locationValue,
          inoutType: this.currentType
        },
        time: {
          from: '',
          to: ''
        }
      }
      if (this.dateValue === null || this.dateValue === '') {
        param.time.from = this.today + ' 0:0:0'
        param.time.to = this.today + ' 23:59:59'
      } else {
        param.time.from = this.dateValue[0]
        param.time.to = this.dateValue[1]
      }
      this.$post(this.$store.state.api.queryStranger, param).then((item) => {
        item.data.map(res => {
          res.photo = window.localStorage.getItem('minioUrl') + res.photo
        })
        this.data = item.data
        this.totalPage = this.data.length
        this.changePage()
        this.loadingData = false
      }).catch(() => {
        this.loadingData = false
      })
    },
    toDetail (strangerID) {
      this.$router.push({path: '/stranger_detail', query: {strangerID: strangerID}})
    },
    // 切换每页多少条
    handleSizeChange (val) {
      this.pageSize = val
      this.changePage()
    },
    // 切换当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.changePage()
    },
    switchTag (index) {
      if (this.currentTag === index) {
        this.currentTag = ''
        this.getData()
      } else {
        this.currentTag = index
        this.getData()
      }
    }
  }
}
</script>
<style scoped>
.page{
  height: 100%;
}
.page>p{
  color: #909090;
  font-size: .44rem;
  text-align: left;
  padding: .6rem 0 0 .5rem;
}
.top{
  height: 1.66rem;
  line-height: 1.66rem;
  border-bottom: 1px solid #eee;
  text-align: left;
  width: 100%;
  padding: 0 .5rem;
  background: #fff;
}

.top .el-select{
  width: 5.6rem;
  height: .76rem;
}
/deep/ .el-input--mini .el-input__inner{
  line-height: .76rem;
}
/deep/ .el-range-editor--small.el-input__inner{
  height: .76rem;
  line-height: .76rem;
}
.top span{
  font-size: .44rem;
}
.top .line{
  margin: .54rem .8rem .54rem 0;
  width: 7rem;
  height: .76rem;
  line-height: .76rem;
  display: flex;
  flex-direction: row;
  float: left;
}
.top span{
  font-size: .44rem;
}
.search-btn{
  margin: .54rem 0;
  background-color: #66A2E4;
  width: 2rem;
  height: .76rem;
  line-height: .76rem;
  text-align: center;
  color: #fff;
  float: right;
  font-size: .4rem;
  font-weight: 400;
  border-radius: .1rem;
  cursor: pointer;
}

.top .line .el-input, .line .el-select{
  width: 5.6rem;
  height: .76rem;
}
.line.line-date{
  width: 12rem;
}
.line .el-date-picker{
  width: 10.4rem;
}
ul.number-summary{
  height: 3.56rem;
  line-height: 3.56rem;
  width: 100%;
  float: none;
  display: flex;
  flex-direction: row;
  padding: .44rem .48rem .52rem;
}
.number-summary li{
  width: 4.8rem;
  height: 2.6rem;
  line-height: 2.6rem;
  text-align: center;
  color: #fff;
  margin: 0 .6rem 0 0;
  padding: .58rem .76rem;
  background-color: #FFFFFF;
  color: #000;
  cursor: pointer;
}

.number-summary li .con{
  width: 3.34rem;
  height: 1.46rem;
  position: relative;
}

.number-summary li i{
  width: 1.26rem;
  height: 1.26rem;
  background: url('../../../assets/image/icon-home-people.png') no-repeat;
  background-size: 100%;
  float: left;
  position: absolute;
  top: .08rem;
  left: 0;
}
.number-summary li.is-active i{
  background: url('../../../assets/image/icon-home-people-white.png') no-repeat;
  background-size: 100%;
}
.number-summary li.is-active{
  background-color: #9FDAFA;
}
.number-summary li.gray{
  background-color: #eee;
  cursor: not-allowed;
}
.number-summary li .right-text{
  position: absolute;
  right: 0;
  top: 0;
  width: 2rem;
  height: 1.44rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.number-summary li .right-text span.value{
  font-size: .8rem;
  color: rgba(0,0,0,0.65);
  height: .8rem;
  line-height: .8rem;
}
.number-summary li .right-text span.name{
  font-size: .4rem;
  color: rgba(0,0,0,0.35);
  height: .56rem;
  line-height: .56rem;
}
.number-summary li.is-active .right-text span.value{
  color: #fff;
}
.number-summary li.is-active .right-text span.name{
  color: #fff;
}
.content{
  width: 100%;
  padding: .4rem .44rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 6.6rem) !important;
}
.el-pagination{
  margin: .46rem 0 0 0;
  display: flex;
  justify-content: flex-end;
}
.detail{
  height: .5rem;
  font-size: .36rem;
  line-height: .5rem;
  color: rgba(164,217,255,1);
  cursor: pointer;
}
.header{
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid #eee;
}
/* element-ui的v-loading自带的颜色改为透明色 */
/deep/ .is-active .el-loading-mask{
  background-color: transparent;
}
</style>
