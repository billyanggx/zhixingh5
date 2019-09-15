<template>
  <div class="release-container">
    <div class="header">
      <el-form :model="form" ref="form">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="学号:" prop="schoolNum">
          <el-input v-model="form.schoolNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="楼栋:" prop="building">
          <el-select v-model="form.level" placeholder="请选择">
            <el-option v-for="(item,index) in buildingsList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-input v-model="form.name" placeholder=""></el-input>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <ul class="release-type">
      <li v-for="(item, index) in peopleTypeList" :key="index" :class="sindex == index ? 'active' : ''" @click="changePType(item, index)">{{item}}</li>
    </ul>
    <div class="content" style="margin:0 .5rem">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="pro1"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="pro2"
          label="学号">
        </el-table-column>
        <el-table-column
          prop="pro3"
          label="宿舍">
        </el-table-column>
        <el-table-column
          prop="pro4"
          label="楼栋">
        </el-table-column>
        <el-table-column
          prop="pro5"
          width="200"
          label="一号X7状态">
        </el-table-column>
        <el-table-column
          prop="pro6"
          width="200"
          label="二号X7状态">
        </el-table-column>
        <el-table-column
          prop="pro7"
          label="三号X7状态">
        </el-table-column>
        <el-table-column
          prop="pro7"
          label="四号X7状态">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="prev, pager, next, sizes, jumper"
        :total="400">
      </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {},
      value: '',
      peopleTypeList: ['入住人员', '宿管人员', '教职工'],
      sindex: 0,
      buildingsList: [
        {
          value: '选项1',
          label: '一号楼'
        }, {
          value: '选项2',
          label: '二号楼'
        }
      ],
      currentPage: 4,
      tableData: [{
        pro1: '3130703120',
        pro2: '王小虎',
        pro3: '102',
        pro4: '一号楼',
        pro5: '计算机与信息学院',
        pro6: '信息管理与信息系统',
        pro7: '信管131'
      }, {
        pro1: '3130703120',
        pro2: '王小虎',
        pro3: '102',
        pro4: '一号楼',
        pro5: '计算机与信息学院',
        pro6: '信息管理与信息系统',
        pro7: '信管131'
      }]
    }
  },
  methods: {
    // 选择人员类型
    changePType (item, index) {
      this.sindex = index
    },
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
    }
  }
}
</script>
<style scoped>
.release-container{
  background: #F2F3F8;
}
.release-container .header{
  background: #fff;
  padding: .5rem;
}
.release-container .header .el-form{
  display: flex;
}
.release-container .header .el-form .el-form-item .el-input, .release-container .header .el-form .el-form-item .el-select{
  margin-right: .8rem;
}
/deep/ .header .el-form-item__content{
  display: flex !important;
}
/deep/ .el-form .el-input{
  width: 5.6rem;
  height: 0.8rem;
}
/deep/ .el-form .el-input .el-input__inner{
  height: 0.8rem;
  line-height: 0.8rem;
}
/deep/ .el-input__icon{
  line-height: 0.8rem;
}
/deep/ .el-button{
  height:0.8rem;
  line-height: 0.8rem;
  padding: 0 0.4rem;
  margin-right: .8rem;
  margin-top:4px;
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
  color: #000;
  background: #fff;
  cursor: pointer;
  /* border:1px dashed #66A2E4; */
}

.release-container .active{
  color:#fff !important;
  background: #FDBC51;
  border-radius:.1rem;
}
.el-pagination{
  margin: .5rem;
  text-align: right;
}
</style>
