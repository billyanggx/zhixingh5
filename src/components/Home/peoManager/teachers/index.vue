<template>
  <div class="release-container">
    <div class="header">
        <div class="search-input">
          <div class="left">学工号:</div>
          <div class="right">
            <el-input v-model="form.idCardNo" placeholder=""></el-input>
          </div>
        </div>
        <div class="search-input">
          <div class="left">姓名:</div>
          <div class="right">
            <el-input v-model="form.name" placeholder=""></el-input>
          </div>
        </div>
        <div class="search-input">
          <div class="left">手机号:</div>
          <div class="right">
            <el-input v-model="form.cellPhone" placeholder=""></el-input>
          </div>
        </div>
        <div class="search-input">
          <div class="left">学院:</div>
          <div class="right">
            <organization  @sendOrganizationValue="sendOrganizationValue"></organization>
          </div>
        </div>
        <!-- <div class="search-input">
          <div class="left">学院:</div>
          <div class="right">
            <el-select v-model="form.level" placeholder="请选择"  @change="collegeChange">
              <el-option v-for="(item,index) in buildingsList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="search-input">
          <div class="left">专业:</div>
          <div class="right">
            <el-select v-model="form.level" placeholder="请选择" @change="majorChange" :disabled="disabled1">
              <el-option v-for="(item,index) in buildingsList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="search-input">
          <div class="left">班级:</div>
          <div class="right">
            <el-select v-model="form.level" placeholder="请选择" :disabled="disabled2">
              <el-option v-for="(item,index) in buildingsList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div> -->
        <div class="">
          <!-- <div class="left"></div> -->
          <div class="right" style="text-align:right;margin-left:1rem">
            <el-button type="primary" @click="searchTable">查询</el-button>
          </div>
        </div>
    </div>
    <ul class="release-type">
      <li @click="createPeople">增加</li>
      <!-- <li>修改</li> -->
      <li  @click="handle">禁用</li>
      <!-- <li>批量导入</li> -->
    </ul>
    <div class="content" v-loading="loading">
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
        <!-- <el-table-column
          prop="locationStr"
          show-overflow-tooltip
          label="宿舍">
        </el-table-column> -->
        <el-table-column
          prop="organizationTeacherStr"
          show-overflow-tooltip
          label="学院">
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
import organization from '@/components/common/organization_search'
export default {
  components: {
    organization
  },
  data () {
    return {
      loading: false,
      form: {
        type: '老师',
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
      peopleID: '',
      status: '',
      peopleTypeList: ['增加人员', '批量增加'],
      totalPage: 0,
      tableData: [],
      data: [],
      organizationList: []
    }
  },
  mounted () {
    this.getData(this.form)
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
    // 组件传值
    sendOrganizationValue (val) {
      this.organizationList = val
    },
    // 新增宿管人员
    createPeople () {
      this.$router.push({path: '/peoManager/info_maintain', query: {index: 2, sign: '跳转新建'}})
    },
    // 查询
    searchTable () {
      if (this.organizationList && this.organizationList.length > 0) {
        this.form.organizationID = this.organizationList
      } else {
        this.form.organizationID = []
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
    // 查看详情
    toDetail (item) {
      this.$router.push({path: '/peoManager/peopleDetails', query: {index: 2, peopleID: item.peopleID}})
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
  padding: .5rem 0 .1rem;
  display: flex;
  flex-wrap: wrap;
}
.header .search-input{
  width: 22%;
  display: flex;
  margin-bottom: 0.5rem;
}
.header .search-input .left{
  width: 30%;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: right;
  padding-right: 0.2rem;
}
.header .search-input .right{
  width: 70%;
}
/deep/ .search-input .el-input{
  width: 5.6rem;
  height: 0.8rem;
}
/deep/ .search-input .el-input .el-input__inner{
  height: 0.8rem;
  line-height: 0.8rem;
}
/deep/ .el-input__icon{
  line-height: 0.8rem;
}
.el-button{
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
.release-type li:nth-child(4){
  background: #A1B3FF;
}

.content {
  width: 100%;
  padding:0 .5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 3.8rem) !important;
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
