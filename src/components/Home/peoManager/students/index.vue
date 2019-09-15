<template>
  <div class="release-container">
    <div class="header">
      <el-form :model="form" ref="form">
        <el-form-item label="学号:" prop="idCardNo">
          <el-input v-model="form.idCardNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="楼栋:" prop="locationID">
          <location ref="location" @sendLocationValue="sendLocationListValue"></location>
        </el-form-item>
        <el-form-item label="学院:" prop="organizationID">
          <organization ref="organization" @sendOrganizationValue="sendOrganizationValue"></organization>
        </el-form-item>
        <el-form-item label="日期:" prop="">
          <el-date-picker
            value-format = 'yyyy:MM:dd HH:mm:ss'
            v-model="createTime"
            type="daterange"
            @change="changeTime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="searchTable">查询</el-button>
      </el-form>
    </div>
    <ul class="release-type">
      <li @click="createPeople">增加人员</li>
      <!-- <li>批量增加</li> -->
    </ul>
    <div class="content" v-loading="loading">
      <el-table
        height="100"
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          show-overflow-tooltip
          prop="idCardNo"
          label="学工号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="locationStr"
          show-overflow-tooltip
          label="宿舍">
        </el-table-column>
        <el-table-column
          prop="organizationStr"
          show-overflow-tooltip
          label="学院">
        </el-table-column>
        <el-table-column
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
          :current-page="form.pageNum"
          :page-sizes="[10, 50, 100]"
          :page-size="form.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="totalPage">
        </el-pagination>
    </div>
  </div>
</template>
<script>
import organization from '@/components/common/organization_search'
import location from '@/components/common/location_search'
export default {
  components: {
    organization, location
  },
  data () {
    return {
      loading: false,
      form: {
        type: '学生',
        pageNum: 1,
        pageSize: 10,
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
      createTime: [],
      peopleTypeList: ['增加人员', '批量增加'],
      totalPage: 0,
      tableData: [],
      data: [],
      locationList: '',
      organizationList: []
    }
  },
  mounted () {
    this.getData(this.form)
  },
  methods: {
    // 组件传递
    sendLocationListValue (val) {
      this.locationList = val
    },
    sendOrganizationValue (val) {
      this.organizationList = val
    },
    // 处理时间传参
    changeTime (val) {
      console.log(val)
    },
    // 查询
    searchTable () {
      if (this.locationList) {
        this.form.locationID = this.locationList.split()
      } else {
        this.form.locationID = []
      }
      if (this.organizationList && this.organizationList.length > 0) {
        this.form.organizationID = this.organizationList
      } else {
        this.form.organizationID = []
      }
      if (this.createTime.length > 0) {
        // this.form.createTime.from = this.$common.myTimeToLocal(this.createTime[0])
        // this.form.createTime.to = this.$common.myTimeToLocal(this.createTime[1])
        this.form.createTime.from = this.createTime[0]
        this.form.createTime.to = this.createTime[1]
        this.form.createTime.to = this.form.createTime.to.replace('00:00:00', '23:59:59')
        console.log(this.form.createTime.to)
      }
      this.getData(this.form)
    },
    // 获取列表
    getData (params) {
      this.loading = true
      this.$post(this.$store.state.api['queryPeopleList'], params).then(data => {
        // this.data = data.data.filter((item) => { return item.type === '学生' }) || []
        this.data = data.data
        this.totalPage = this.data.count
        this.tableData = this.data.data || []
        // this.changePage()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查看详情
    toDetail (item) {
      console.log(item)
      this.$router.push({path: '/peoManager/peopleDetails', query: {index: 0, peopleID: item.peopleID}})
    },
    // 新增学生
    createPeople () {
      this.$router.push({path: '/peoManager/info_maintain', query: {index: 0, sign: '跳转新建'}})
    },
    // 前端分页功能
    changePage () {
      this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    },
    // 切换每页多少条
    handleSizeChange (val) {
      this.form.pageSize = val
      this.searchTable()
    },
    // 切换当前页
    handleCurrentChange (val) {
      this.form.pageNum = val
      this.searchTable()
    }
  }
}
</script>
<style scoped>
.release-container{
  background: #F2F3F8;
  height: 100%;
}
.release-container .header{
  background: #fff;
  padding: .5rem .5rem .1rem;
}
.release-container .header .el-form{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between
}
/deep/ .el-form .el-input{
  width: 5rem;
  height: 0.8rem;
}
/deep/ .el-form .el-input .el-input__inner{
  height: 0.8rem;
  line-height: 0.8rem;
}
/deep/ .el-input__icon{
  line-height: 0.8rem;
}
.release-container .header .el-form .el-form-item .el-input, .release-container .header .el-form .el-form-item .el-select{
  margin-right: .8rem;
}
/deep/ .header .el-form-item__content{
  display: flex !important;
}
/deep/ .el-button{
  height:0.8rem;
  line-height: 0.8rem;
  padding: 0 0.4rem;
  margin-right: .8rem;
  margin-top:4px;
}
/deep/ .el-range-editor.el-input__inner{
  padding: 0 0.2rem;
  height: 0.8rem;
  line-height: 0.8rem;
}
.release-type{
  display: flex;
  justify-content: flex-end;
}
.release-type li{
  margin: .5rem;
  font-size: .44rem;
  width: 3.4rem;
  height: 1rem;
  line-height: 1rem;
  color: #fff;
  border-radius: .1rem;
  cursor: pointer;
  /* border:1px dashed #66A2E4; */
}
.release-type li:first-child{
  background: #FDBC51;
}
.release-type li:nth-child(2){
  background: #A1B3FF;
}

.content {
  width: 100%;
  padding:0 .5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 5.9rem) !important;
}

.release-container .active{
  color:#fff !important;
  background: #FDBC51;
  border-radius:.1rem;
}
.detail{
   color:#A4D9FF;
   cursor: pointer;
}
.el-pagination{
  margin: .5rem;
  text-align: right;
}
</style>
