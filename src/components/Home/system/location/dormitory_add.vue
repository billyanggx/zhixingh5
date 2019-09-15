<template>
  <div class="el-container">
    <p>{{$route.query.type === 'add' ? '添加' : '修改'}}宿舍</p>
    <div class="pwd">
      <span>楼栋：</span>
      <el-select v-loading="buidingLoading" value-key="ID" v-model="bValue" filterable placeholder="请选择" size="mini" @change="changeBuilding">
        <el-option v-for="item in bList" :key="item.ID" :label="item.name" :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="line" v-for="(item, index) in buildingList" :key="index">
      <div class="line-left">
        <span>楼层：</span>
        <el-input size="small" v-model.number="item.floorNo"></el-input>
      </div>
      <div class="line-center">
        <span>宿舍号：</span>
        <el-input size="small" v-model.number="item.houseStartNo"></el-input>
        <b></b>
        <el-input size="small" v-model.number="item.houseEndNo"></el-input>
      </div>
      <div class="line-right">
        <span>类型：</span>
        <el-select v-model="item.roomType" placeholder="请选择">
          <el-option v-for="item in gennerList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="add">
      <el-button class="btn" size="small" type="primary" @click="addBuilding">添加</el-button>
    </div>
    <div class="btn">
      <div class="save" @click="add">保存</div>
      <div class="cancel" @click="back">取消</div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'update_pwd',
  data () {
    return {
      bValue: '',
      buidingLoading: false,
      bList: [],
      buildingList: [],
      gennerList: []
    }
  },
  mounted () {
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
    changeBuilding () {
      console.log(this.bValue.remark)
      this.buildingList = []
      if (this.bValue.remark === '混合寝室') {
        this.gennerList = [{ value: '男生寝室', label: '男生寝室' }, { value: '女生寝室', label: '女生寝室' }]
      } else {
        this.gennerList = [{ value: this.bValue.remark, label: this.bValue.remark }]
      }
    },
    addBuilding () {
      let item = {
        floorNo: '',
        houseStartNo: '',
        houseEndNo: '',
        roomType: this.bValue.remark === '混合寝室' ? '' : this.bValue.remark
      }
      this.buildingList.push(item)
    },
    back () {
      this.$router.back()
    },
    add () {
      console.log(this.locationValue)
      if (this.locationValue === '') {
        return this.$message.error('必须选择一个楼栋')
      }
      if (this.buildingList.length === 0) {
        return this.$message.error('至少新建一个楼层')
      }
      for (var i in this.buildingList) {
        if (this.buildingList[i].houseEndNo === '' || this.buildingList[i].houseStartNo === '') {
          return this.$message.error('宿舍号不允许为空')
        }
        this.buildingList[i].roomNoArray = []
        var length = parseInt(this.buildingList[i].houseEndNo) - parseInt(this.buildingList[i].houseStartNo)
        console.log(length)
        if (length < 1) {
          return this.$message.error('请输入正确的宿舍号')
        }
        for (var index = 0; index < length + 1; index++) {
          this.buildingList[i].roomNoArray.push(parseInt(this.buildingList[i].houseStartNo) + index)
        }
      }
      console.log(this.buildingList)
      var params = {
        buildingID: this.bValue.ID,
        arrList: this.buildingList
      }
      this.$post(this.$store.state.api.addDormitory, params).then((res) => {
        if (res.success === true) {
          this.$message.success('新建成功' + res.data.data.successArr.length + '个，原已存在' + res.data.data.failArr.length + '个')
          setTimeout(() => {
            this.back()
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-container {
  width: 20.4rem;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
}
.el-container > p {
  color: #4a4a4a;
  font-size: 0.48rem;
  font-weight: 400;
  margin: 0 0 0.6rem 0;
}
.el-container .type {
  width: 3.3rem;
  height: 0.62rem;
  line-height: 0.62rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: flex-end;
  margin: 0 0 0.4rem 0;
}
.type li:first-child::after {
  content: "";
  border-right: 1px solid #cecece;
  margin: 0 0.2rem;
}
.type li {
  font-size: 0.4rem;
  color: #8c8c8c;
  cursor: pointer;
}
.type li.is-active {
  color: #66a2e4;
}
.pwd {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 0 0.5rem 0;
  height: 0.76rem;
  line-height: 0.76rem;
}
.pwd > span,
.line span {
  height: 0.76rem;
  line-height: 0.76rem;
  position: relative;
}

.pwd > span::before,
.line span::before {
  content: "*";
  color: #d0021b;
  font-size: 0.44rem;
  position: absolute;
  top: 0.05rem;
  left: -0.3rem;
}
.el-input,
.el-radio-group,
.el-select {
  width: 9.8rem;
  height: 0.76rem;
  line-height: 0.76rem;
  text-align: left;
  display: flex;
  align-items: center;
}
.line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 0 0.5rem 0;
  height: 0.76rem;
  line-height: 0.76rem;
}
.line-left {
  width: 20%;
  display: flex;
  flex-direction: row;
}
.line-center {
  width: 40%;
  display: flex;
  flex-direction: row;
}
.line-right {
  width: 35%;
  display: flex;
  flex-direction: row;
}
.line-center b {
  width: 0.38rem;
  height: 1px;
  background-color: #d9d9d9;
  margin: 0.38rem 0.16rem;
}
.line-left .el-input {
  width: 2rem;
  height: 0.76rem;
}
.line-center .el-input {
  width: 2rem;
  height: 0.76rem;
}
.line-right .el-select {
  width: 3rem;
}
.add {
  width: 80%;
  margin: 0 1rem 0.5rem;
}
.btn {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.save {
  width: 2rem;
  height: 0.76rem;
  line-height: 0.76rem;
  background: #fff;
  border: 2px solid rgba(102, 162, 228, 1);
  border-radius: 5px;
  color: #66a2e4;
  font-size: 0.4rem;
  margin: 0 0.4rem 0 0;
  cursor: pointer;
}
.cancel {
  width: 2rem;
  height: 0.76rem;
  line-height: 0.76rem;
  background: rgba(102, 162, 228, 1);
  border-radius: 5px;
  color: #fff;
  font-size: 0.4rem;
  cursor: pointer;
}
</style>
