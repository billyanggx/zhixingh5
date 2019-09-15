<template>
  <div class="page" @click="updSucessValue">
    <!-- <div class="top">
      <div class="line">
        <span>参数名称：</span>
        <el-input placeholder="请输入" size="small" v-model="name"></el-input>
      </div>
      <div class="line">
        <span>参数描述：</span>
        <el-input placeholder="请输入" size="small" v-model="describe"></el-input>
      </div>
      <div class="line">
        <span>修改人：</span>
        <el-input placeholder="请输入" size="small" v-model="people"></el-input>
      </div>
      <div class="search-btn add" @click="add()">增加</div>
      <div class="search-btn" @click="searchFun">搜索</div>
    </div> -->
    <div class="content">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="参数名称">
        </el-table-column>
        <el-table-column
          prop="describe"
          show-overflow-tooltip
          label="参数描述">
        </el-table-column>
        <el-table-column
          label="参数值">
          <template slot-scope="scope">
            <el-tooltip content="单击修改参数值" placement="top" :open-delay=300>
              <el-time-picker
                v-if="scope.row.isEdit"
                v-model="scope.row.value"
                :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59',
                  format: 'HH:mm:ss'
                }"
                value-format = 'HH:mm:ss'
                @click.native="updValue"
                :placeholder="scope.row.value">
                </el-time-picker>
              <span @click="update(scope.row, scope.$index)" v-else>{{scope.row.value}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
        </el-table-column>
        <!-- <el-table-column
          prop="time"
          show-overflow-tooltip
          label="修改时间">
        </el-table-column>
        <el-table-column
          prop="user"
          show-overflow-tooltip
          label="修改人">
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tag-list2">
              <span class="tag up" @click="update(scope.row, scope.$index)">修改</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <searchNull v-else></searchNull>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      describe: '',
      people: '',
      value4: ['', ''],
      value: '',
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
      tableData: [{
        name: '迟到时间',
        describe: '迟到时间',
        value: '',
        state: '生效',
        time: '--',
        user: '--',
        isEdit: false
      }, {
        name: '未归时间',
        describe: '未归时间',
        value: '',
        state: '生效',
        time: '--',
        user: '--',
        isEdit: false
      }, {
        name: '考勤推送时间',
        describe: '考勤推送时间',
        value: '',
        state: '生效',
        time: '--',
        user: '--',
        isEdit: false
      }, {
        name: '考勤异常',
        describe: '考勤异常',
        value: '',
        state: '生效',
        time: '--',
        user: '--',
        isEdit: false
      }, {
        name: '考勤异常推送',
        describe: '考勤异常推送',
        value: '',
        state: '生效',
        time: '--',
        user: '--',
        isEdit: false
      }],
      isEditIndex: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      for (let i in this.tableData) {
        var params = {
          name: this.tableData[i].name,
          userID: ''
        }
        this.$post(this.$store.state.api['getKey'], params).then(data => {
          this.tableData[i].value = data.data
        })
      }
    },
    // 阻止冒泡事件
    updValue () {
      event.stopPropagation()
    },
    searchFun () {
      this.updValue()
    },
    add () {
      this.updValue()
      this.$router.push('/time_detail?type=add')
    },
    // 修改按钮，触发修改状态
    update (item, index) {
      this.updValue()
      if (this.isEditIndex === '') {
        item.isEdit = true
        this.isEditIndex = index
      } else {
        this.updSucessValue()
      }
    },
    // 全局事件，点击页面任意地方均可执行
    updSucessValue () {
      if (this.isEditIndex !== '') {
        // switch (this.tableData[this.isEditIndex].name) {
        //   case '迟到时间':
        //     if (this.tableData[this.isEditIndex].value > this.tableData[1].value) {
        //       return this.$message.error('迟到时间不能大于未归时间！')
        //     } else {
        //       this.setValue()
        //     }
        //     break
        //   case '未归时间':
        //     if (this.tableData[this.isEditIndex].value > this.tableData[2].value) {
        //       return this.$message.error('未归时间不能大于考勤推送时间！')
        //     } else {
        //       this.setValue()
        //     }
        //     if (this.tableData[this.isEditIndex].value < this.tableData[0].value) {
        //       return this.$message.error('未归时间不能小于迟到时间！')
        //     } else {
        //       this.setValue()
        //     }
        //     break
        //   case '考勤推送时间':
        //     if (this.tableData[this.isEditIndex].value < this.tableData[0].value || this.tableData[this.isEditIndex].value < this.tableData[1].value) {
        //       return this.$message.error('考勤推送时间不能小于迟到时间或未归时间！')
        //     } else {
        //       this.setValue()
        //     }
        //     break
        //   default:
        //     break
        // }
        this.setValue()
        this.tableData[this.isEditIndex].isEdit = false
        this.isEditIndex = ''
      }
    },
    setValue () {
      let params = {
        name: this.tableData[this.isEditIndex].name,
        value: this.tableData[this.isEditIndex].value
      }
      this.$post(this.$store.state.api['addKey'], params).then(data => {
        if (data.success) {
          this.$message.success(data.msg)
        } else {
          this.$message.error(data.msg)
        }
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
/deep/ .el-input--small .el-input__inner{
  height: .76rem;
  line-height: .76rem;
}
.top span{
  font-size: .44rem;
}
.top .line{
  margin: .54rem .5rem .54rem 0;
  width: 8rem;
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
  justify-content: space-between;
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
/deep/ .el-date-editor.el-input{
  width: 3.5rem;
}
</style>
