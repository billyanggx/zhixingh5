<template>
  <div class="page">
    <div class="top">
      <div class="line">
        <span>姓名：</span>
        <el-input placeholder="请输入" size="small" v-model="name"></el-input>
      </div>
      <div class="line">
        <span>学工号：</span>
        <el-input placeholder="请输入" size="small" v-model="peopleNumber"></el-input>
      </div>
      <div class="line">
        <span>手机号：</span>
        <el-input placeholder="请输入" size="small" v-model="phoneNumber"></el-input>
      </div>
      <div class="search-btn add" @click="toDetail('add')">增加</div>
      <div class="search-btn" @click="searchFun">搜索</div>
    </div>
    <div class="content">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="pro1"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="pro2"
          label="学工号">
        </el-table-column>
        <el-table-column
          prop="pro3"
          label="手机号">
        </el-table-column>
        <el-table-column
          label="状态">
          <template>
            <span>生效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tag-list2">
              <span class="tag pwd" @click="pwd(scope.$index)">密码重置</span>
              <span class="tag up" @click="toDetail('upd')">修改</span>
              <span class="tag no" @click="noUse(scope.$index)">禁用</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <searchNull v-else></searchNull>
      <el-pagination
        v-if="tableData.length > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 5, 7]"
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
      name: '',
      peopleNumber: '',
      phoneNumber: '',
      value4: ['', ''],
      value: '',
      currentRow: null,
      buildingsList: [
        {
          value: '选项1',
          label: '一号楼'
        }, {
          value: '选项2',
          label: '二号楼'
        }
      ],
      total: {
        number1: 43,
        number2: 532,
        number3: 2991,
        number4: 1882
      },
      pageSize: 2,
      totalPage: 0,
      currentPage: 1,
      tableData: [],
      data: [{
        pro1: '张三',
        pro2: '29324237428939',
        pro3: '15111667788'
      }]
    }
  },
  mounted () {
    this.changePage()
    this.totalPage = this.data.length
  },
  methods: {
    // 前端分页功能
    changePage () {
      this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    },
    searchFun () {
      console.log(this.name, this.peopleNumber, this.phoneNumber)
    },
    toDetail (type) {
      this.$router.push('/system/system_user_add?type=' + type)
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
    noUse (index) {
      this.$confirm('确认要禁用该选项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '禁用成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁用'
        })
      })
    },
    pwd (index) {
      this.$message.success(index + '密码重置成功！')
    }
  }
}
</script>
<style scoped>
.page{
  height: 100%;
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
/deep/ .el-input--small .el-input__inner{
  height: .76rem;
  line-height: .76rem;
}
.top span{
  font-size: .44rem;
}
.top .line{
  margin: .54rem .8rem .54rem 0;
  width: 7.8rem;
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
  margin: .54rem .2rem .54rem 0;
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

.search-btn.add{
  background-color: #FDBC51;
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
.content{
  width: 100%;
  padding: .4rem .44rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 2rem) !important;
}

.tag-list{
  width: 100%;
  height: .96rem;
  margin: 0 0 .32rem 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.tag-list2{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.tag{
  width: 2rem;
  height: .76rem;
  line-height: .76rem;
  text-align: center;
  border: 1px solid #E8E8E8;
  color: #fff;
  font-size: .4rem;
  cursor: pointer;
  border-radius: .1rem;
  margin: 0 .1rem;
}
.tag.pwd{
  background-color: #8BC2FF;
}
.tag.add{
  background-color: #FDBC51;
}
.tag.up{
  background-color: #42CA95;
}
.tag.no{
  background-color: #FF9090;
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
</style>
