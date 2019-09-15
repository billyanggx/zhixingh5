<template>
  <div class="page" v-loading="loading">
    <div class="top">
      <span>楼栋：</span>
      <el-select v-loading="buidingLoading" clearable value-key="ID" v-model="bValue" filterable placeholder="请选择" size="mini" @change="getData">
        <el-option v-for="item in bList" :key="item.ID" :label="item.name" :value="item">
        </el-option>
      </el-select>
      <div class="search-btn add" @click="toDetail('add', '')">增加</div>
      <div class="search-btn" @click="getData">搜索</div>
    </div>
    <div class="content">
      <el-table height="100" v-if="tableData.length > 0" :data="tableData" style="width: 100%">
        <el-table-column prop="buildingName" show-overflow-tooltip label="楼栋">
        </el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="类型">
        </el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="宿舍">
        </el-table-column>
        <el-table-column prop="peopleInDormitoryNumber" show-overflow-tooltip label="实住人数">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="更新时间">
          <template slot-scope="scope">
            <div>{{scope.row.updateTime | filterTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tag-list2">
              <!--<span class="tag pwd" @click="toDetail('detail', scope.row)">查看</span>-->
              <span class="tag up" @click="toDetail('detail', scope.row)">修改</span>
            </div>
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
      bValue: '',
      buidingLoading: false,
      bList: [],
      name: '',
      loading: false,
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      tableData: [],
      academyNameList: [],
      majorNameList: [],
      academyNo: '',
      academyName: '',
      majorNo: '',
      majorName: '',
      buildingValue: '',
      repeatList: [],
      all: ''
    }
  },
  mounted () {
    this.getData()
    this.getLocation()
  },
  methods: {
    getLocation () {
      this.buidingLoading = true
      var params = {
        type: '楼栋'
      }
      this.$post(this.$store.state.api.locationGetByType, params).then((res) => {
        this.buidingLoading = false
        if (res.success === true) {
          this.bList = res.data
        } else {
          console.log(res.success)
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        this.buidingLoading = false
        this.$message.error(err.msg)
      })
    },
    getData () {
      this.loading = true
      var params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        buildingID: this.bValue.ID
      }
      this.$post(this.$store.state.api.dormitoryList, params).then((res) => {
        if (res.success === true) {
          this.loading = false
          this.totalPage = res.data.countNum
          this.tableData = res.data.dormitoryList
        } else {
          this.loading = false
          console.log(res.success)
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.msg)
      })
    },
    toDetail (type, item) {
      if (type === 'add') {
        this.$router.push('/system/dormitory_add?type=' + type)
      } else {
        this.$store.state.updateInfo = item
        this.$router.push('/system/dormitory_detail')
      }
    },
    // 切换每页多少条
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    // 切换当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    }
  },
  filters: {
    stateFilter: function (val) {
      var arr = ['启用', '禁用']
      return arr[val]
    },
    filterTime: function (val) {
      return val === null || val === '' ? '--' : val.replace(/T/g, ' ').replace(/.000Z/g, '')
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
}
/deep/ .el-input--small .el-input__inner {
  height: 0.76rem;
  line-height: 0.76rem;
}
.top span {
  font-size: 0.44rem;
}
.top .line {
  margin: 0.54rem 0.8rem 0.54rem 0;
  width: 7.8rem;
  height: 0.76rem;
  line-height: 0.76rem;
  display: flex;
  flex-direction: row;
  float: left;
}
.top span {
  font-size: 0.44rem;
}
.search-btn {
  margin: 0.54rem 0.2rem 0.54rem 0;
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

.search-btn.add {
  background-color: #fdbc51;
}
.top .line .el-input,
.line .el-select {
  width: 5.6rem;
  height: 0.76rem;
}
.content {
  width: 100%;
  padding: 0.4rem 0.44rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 2rem) !important;
}

.tag-list {
  width: 100%;
  height: 0.96rem;
  margin: 0 0 0.32rem 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.tag-list2 {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.tag {
  width: 2rem;
  height: 0.76rem;
  line-height: 0.76rem;
  text-align: center;
  border: 1px solid #e8e8e8;
  color: #fff;
  font-size: 0.4rem;
  cursor: pointer;
  border-radius: 0.1rem;
  margin: 0 0.1rem;
}
.tag.pwd {
  background-color: #8bc2ff;
}
.tag.add {
  background-color: #fdbc51;
}
.tag.up {
  background-color: #42ca95;
}
.tag.no {
  background-color: #ff9090;
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
</style>
