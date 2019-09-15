<template>
  <div class="page" v-loading="loading">
    <div class="top">
      <div class="line">
        <span>学院名称：</span>
        <el-select v-model="academyName" value-key="ID" filterable clearable placeholder="请选择" size="mini" @change="changeAcademyName">
          <el-option v-for="item in academyNameList" :key="item.ID" :label="item.name" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="line">
        <span>专业名称：</span>
        <el-select v-model="majorName" filterable clearable placeholder="请选择" size="mini">
          <el-option v-for="item in majorNameList" :key="item.ID" :label="item.name" :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="search-btn add" @click="toDetail('add', '')">增加</div>
      <div class="search-btn" @click="getData">搜索</div>
    </div>
    <div class="content">
      <el-table height="100" v-if="tableData.length > 0" :data="tableData" style="width: 100%">
        <!-- <el-table-column prop="academyID" show-overflow-tooltip label="学院编号">
        </el-table-column> -->
        <el-table-column prop="academyName" show-overflow-tooltip label="学院名称">
        </el-table-column>
        <el-table-column prop="ID" label="专业编号">
        </el-table-column>
        <el-table-column prop="name" label="专业名称">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="更新时间">
          <template slot-scope="scope">
            <div>{{scope.row.updateTime | filterTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tag-list2">
              <!-- <span class="tag pwd" @click="toDetail('detail', scope.row)">查看</span> -->
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
      name: '',
      loading: false,
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      tableData: [],
      academyNameList: [],
      majorNameList: [],
      academyNo: '',
      academyName: {},
      majorNo: '',
      majorName: ''
    }
  },
  mounted () {
    this.getData()
    this.getAcademyName()
  },
  methods: {
    getAcademyName () {
      let params = {
        parentID: '',
        type: '学院'
      }
      this.$post(this.$store.state.api.getByType, params).then(data => {
        this.academyNameList = data.data
      })
    },
    changeAcademyName () {
      let params = {
        parentID: this.academyName.ID,
        type: '专业'
      }
      this.$post(this.$store.state.api.getByType, params).then(data => {
        this.majorNameList = data.data
      })
    },
    getData () {
      this.loading = true
      var params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        academyNo: this.academyNo,
        academyName: this.academyName.name,
        majorNo: this.majorNo,
        majorName: this.majorName
      }
      this.$post(this.$store.state.api.organizationList, params).then((res) => {
        this.loading = false
        if (res.success === true) {
          this.totalPage = res.data.countNum
          this.tableData = res.data.organizationList
        } else {
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
        this.$router.push('/system/school_add')
      } else {
        this.$store.state.updateInfo = item
        this.$router.push('/system/school_detail')
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
