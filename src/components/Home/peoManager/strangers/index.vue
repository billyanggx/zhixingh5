<template>
  <div class="release-container">
    <div class="header">
      <el-form :model="form" ref="form">
        <el-form-item label="学工号:" prop="idCardNo">
          <el-input v-model="form.idCardNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="cellPhone">
          <el-input v-model="form.cellPhone" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="楼栋:" prop="locationID">
          <el-select v-model="locationID" placeholder="请选择">
            <el-option v-for="(item,index) in buildingsList" :key="index" :label="item.name" :value="item.ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button type="primary"  @click="searchTable">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <ul class="release-type">
      <li @click="createPeople">增加</li>
      <!-- <li>修改</li> -->
      <li @click="handle">禁用</li>
    </ul>
    <div class="content" v-loading = "loading">
      <el-table
        height="100"
        v-if="tableData.length > 0"
        :data="tableData"
        @row-click="rowClick"
        highlight-current-row
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
          prop="cellPhone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="locationStr"
          label="楼栋">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="职称">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
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
export default {
  data () {
    return {
      loading: false,
      form: {
        type: '宿管人员',
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
      locationID: '',
      peopleID: '',
      status: '',
      peopleTypeList: ['增加人员', '批量增加'],
      buildingsList: [],
      totalPage: 0,
      tableData: [],
      data: []
    }
  },
  mounted () {
    this.getData(this.form)
    this.getLocation()
  },
  methods: {
    rowClick (row) {
      this.peopleID = row.peopleID
      this.status = row.status
    },
    // 禁用
    handle () {
      if (!this.peopleID) return this.$message.error('请选取你需要禁用的人员')
      if (this.status === '禁用') return this.$message.error('当前状态已经为禁用')
      let params = {peopleID: this.peopleID, status: '禁用'}
      // 删除超脑信息
      let delParams = {
        peopleID: this.peopleID,
        dbName: 'OpenDoor'
      }
      this.$post(this.$store.state.api['deleteFace'], delParams).then(data => {
        if (data.success) {
          this.$post(this.$store.state.api['updatePeopleStatus'], params).then(data => {
            if (data.success) {
              this.$message.success('禁用成功')
              this.getData()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增宿管人员
    createPeople () {
      this.$router.push({path: '/peoManager/info_maintain', query: {index: 1, sign: '跳转新建'}})
    },
    // 查询
    searchTable () {
      if (this.locationID) {
        this.form.locationID = this.locationID.split()
      } else {
        this.form.locationID = []
      }
      this.getData(this.form)
    },
    // 获取列表
    getData (params) {
      this.loading = true
      this.$post(this.$store.state.api['queryPeopleList'], params).then(data => {
        this.data = data.data
        this.totalPage = this.data.count
        this.tableData = this.data.data || []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取location列表
    getLocation () {
      let params = {
        locationID: '',
        type: '楼栋'.split()
      }
      this.$post(this.$store.state.api['getChildLocation'], params).then(data => {
        this.buildingsList = data.data || []
      })
    },
    // 查看详情
    toDetail (item) {
      this.$router.push({path: '/peoManager/peopleDetails', query: {index: 1, peopleID: item.peopleID}})
    },
    // 前端分页功能
    changePage () {
      console.log(this.data)
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
  padding: .5rem .5rem .5rem;
}
.release-container .header .el-form{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between
}
/deep/ .el-form .el-input{
  width: 5.5rem;
  height: 0.8rem;
}
/deep/ .el-form .el-input .el-input__inner{
  height: 0.8rem;
  line-height: 0.8rem;
}
/deep/ .el-input__icon{
  line-height: 0.8rem;
}
/* .release-container .header .el-form .el-form-item .el-input, .release-container .header .el-form .el-form-item .el-select{
  margin-right: .8rem;
} */
/deep/ .header .el-form-item__content{
  display: flex !important;
}
/deep/ .el-button{
  height:0.8rem;
  line-height: 0.8rem;
  padding: 0 0.4rem;
  margin-right: .8rem;
}
.release-type{
  display: flex;
  justify-content: flex-end;
}
.release-type li{
  margin: .5rem;
  font-size: .44rem;
  width: 2rem;
  height: 0.8rem;
  line-height: 0.8rem;
  color: #fff;
  border-radius: .1rem;
  cursor: pointer;
  /* border:1px dashed #66A2E4; */
}
.release-type li:first-child{
  background: #FDBC51;
}
.release-type li:nth-child(2){
  background: #42CA95;
}
.release-type li:nth-child(3){
  background: #FF9090;
}

.content {
  width: 100%;
  padding:0 .5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 4.5rem) !important;
}
/* .release-container .active{
  color:#fff !important;
  background: #FDBC51;
  border-radius:.1rem;
} */
.detail{
   color:#A4D9FF;
   cursor: pointer;
}
.el-pagination{
  margin: .5rem;
  text-align: right;
}
</style>
