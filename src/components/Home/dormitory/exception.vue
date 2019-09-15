<template>
  <div class="page">
    <div class="top">
      <div class="line">
        <span>学号：</span>
        <el-input placeholder="请输入" size="mini" :clearable="true" v-model="idCardNo"></el-input>
      </div>
      <div class="line">
        <span>姓名：</span>
        <el-input placeholder="请输入" size="mini" :clearable="true" v-model="name"></el-input>
      </div>
      <!-- <div class="line">
        <span>楼栋：</span>
        <location-search ref="location" @sendLocationValue="getLocationValue"></location-search>
      </div> -->
      <div class="line">
        <span>班级：</span>
        <organization-search ref="organization" @sendOrganizationValue="getOrganizationValue"></organization-search>
      </div>
      <div class="line line-date">
        <span>日期：</span>
        <el-date-picker
          size="mini"
          value-format="yyyy-MM-dd"
          v-model="dateValue"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="search-btn" @click="searchFun">搜索</div>
    </div>
    <ul class="tag-list">
      <li class="tag"
        :class="tagListActive === index ? 'active' : ''"
        v-for="(item, index) in tagList"
        :key="index"
        @click="switchTab(index)">{{item}}</li>
    </ul>
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
          width="200"
          prop="idCardNo"
          show-overflow-tooltip
          label="学号">
        </el-table-column>
        <el-table-column
          width="200"
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="locationStr"
          show-overflow-tooltip
          label="宿舍">
        </el-table-column>
        <!-- <el-table-column
          prop="locationParentName"
          label="楼栋">
        </el-table-column> -->
        <el-table-column
          prop="organizationStr"
          show-overflow-tooltip
          label="班级">
        </el-table-column>
        <el-table-column
          width="200"
          label="详情">
          <template slot-scope="scope">
            <span class="detail" @click="toDetail(scope.row)">查看</span>
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
      dateValue: '',
      name: '',
      idCardNo: '',
      locationValue: '',
      organizationValue: '',
      tagListActive: 0,
      tagList: ['迟到', '连续一日未归', '连续两日未归', '连续三日未归', '三日以上未归'],
      total: {
        number1: 43,
        number2: 532,
        number3: 2991,
        number4: 1882
      },
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      tableData: [],
      userLocationID: '',
      data: [],
      loadingData: false
    }
  },
  mounted () {
    for (var i = 1; i < 6; i++) {
      setTimeout((j) => {
        console.log(j)
      }, 1000 * i, i)
    }
    // 获取出勤记录
    this.userLocationID = window.localStorage.getItem('userLocationID')
    this.searchFun()
    this.switchTab(parseInt(this.$store.state.exceptionType))
    this.totalPage = this.data.length
  },
  methods: {
    // 前端分页功能
    changePage () {
      this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    },
    searchFun () {
      // this.$refs.location.handleChange()
      // this.$refs.organization.handleChange()
      var attendType = ''
      var notReturnDays = '0'
      if (this.tagListActive === 0) {
        attendType = this.tagList[this.tagListActive]
        notReturnDays = '0'
      } else {
        attendType = '未归'
        notReturnDays = '>' + this.tagListActive
      }
      let params = {
        peopleType: '学生',
        locationID: this.locationValue,
        organizationID: this.organizationValue,
        name: this.name,
        idCardNo: this.idCardNo,
        notReturnDays: notReturnDays,
        attendType: attendType,
        time: {
          from: this.dateValue[0],
          to: this.dateValue[1]
        }
      }
      this.getAttendLog(params)
    },
    toDetail (item) {
      this.$router.push({path: '/peoManager/peopleDetails', query: {index: 0, peopleID: item.peopleID}})
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
    switchTab (index) {
      this.$set(this, 'tagListActive', index)
      if (index > 1) {
        this.dateValue = ''
      } else {
        var yesterday = this.$common.getDay(86400000)
        this.dateValue = [yesterday, yesterday]
      }
      this.searchFun()
    },
    getOrganizationValue (val) {
      if (val.length !== 0) {
        this.organizationValue = val.slice(-1)[0]
      } else {
        this.organizationValue = ''
      }
    },
    getLocationValue (val) {
      this.locationValue = val
    },
    // 获取出勤记录
    async getAttendLog (data) {
      this.loadingData = true
      let params = data
      await this.$post(this.$store.state.api['queryAttendLog'], params).then(data => {
        this.data = data.data || []
        this.totalPage = this.data.length
        this.changePage()
        this.loadingData = false
      }).catch(() => {
        this.loadingData = false
      })
    }
  }
}
</script>
<style scoped>
.page{
  height: 100%;
}
.top{
  height: 1.8rem;
  border-bottom: 1px solid #eee;
  text-align: left;
  width: 100%;
  padding: .5rem .6rem .1rem 0;
  background: #fff;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.top .line{
  width: 23%;
  height: .76rem;
  line-height: .76rem;
  display: flex;
  flex-direction: row;
  padding: 0 0 .4rem .4rem;
}

.top .el-select{
  width: 5rem;
  height: .76rem;
}
/deep/ .el-input--mini .el-input__inner{
  line-height: .76rem;
}
/deep/ .el-range-editor--small.el-input__inner{
  width: 13.5rem;
  height: .76rem;
  line-height: .76rem;
}
.top .line .el-input, .line .el-select{
  width: 5rem;
  height: .76rem;
}
/deep/ .el-date-editor{
  width: 5rem;
  height: .76rem;
  line-height: .76rem;
}
.top span{
  font-size: .35rem;
}
.search-btn{
  background-color: #66A2E4;
  width: 2rem;
  height: .76rem;
  line-height: .76rem;
  text-align: center;
  color: #fff;
  font-size: .4rem;
  font-weight: 400;
  border-radius: .1rem;
  cursor: pointer;
}
.tag-list{
  width: 100%;
  height: .96rem;
  margin: .32rem 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.tag{
  width: 3.36rem;
  height: .96rem;
  line-height: .96rem;
  text-align: center;
  background-color: #fff;
  border: 1px solid #E8E8E8;
  color: rgba(0,0,0,0.35);
  font-size: .44rem;
  margin: 0 0 0 .4rem;
  cursor: pointer;
}
.tag.active{
  background-color: #FDBC51;
  color: #fff;
}
.content{
  padding: 0 .44rem .4rem .44rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 3.4rem) !important;
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
</style>
