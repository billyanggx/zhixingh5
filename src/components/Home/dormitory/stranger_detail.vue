<template>
  <div class="el-container">
    <p>详情</p>
    <div class="user-info">
      <img class="user-img" :src="info.img" alt="">
      <div class="user-text">
        <div class="pwd">
          <span>楼栋：</span>
          <el-input v-model="info.buildingValue" :disabled="true" size="mini"></el-input>
        </div>
        <div class="pwd">
          <span>时间：</span>
          <el-date-picker v-model="info.time" value-format='yyyy-MM-dd HH-mm-ss' type="datetime" :disabled="true" placeholder="选择日期时间" :default-time="['0:00:00', '23:59:59']">
          </el-date-picker>
        </div>
        <div class="pwd">
          <span>标签：</span>
          <el-select filterable v-model="tagValue" multiple collapse-tags placeholder="请选择" value-key="name">
            <el-option v-for="item in options" :key="item.ID" :label="item.name" :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="btn">
      <div class="save cursor-pointer" @click="save">保存</div>
      <div class="cancel cursor-pointer" @click="back">取消</div>
    </div>
    <div class="info">
      <i></i>
      <span>出入信息</span>
    </div>
    <el-table :data="tableData" @row-click="toDetail" height="200" style="width: 100%">
      <el-table-column width="70" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.headUrl" alt="" class="header">
        </template>
      </el-table-column>
      <el-table-column label="日期" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime.substring(0, 10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{$common.myTimeToLocal(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="location.name" width="70" label="楼栋">
      </el-table-column>
      <el-table-column prop="device.params" label="出入类型">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'update_pwd',
  data () {
    return {
      info: {
        buildingValue: '',
        time: '',
        img: ''
      },
      options: [],
      tagValue: [], // 该用户的标签详情
      copyTagValue: [], // 获取详情之后复制一份，用于后面作对比是否有修改之类的
      tableData: []
    }
  },
  mounted () {
    this.getTagAllList()
    this.strangerID = this.$route.query.strangerID
    this.getInfo()
  },
  methods: {
    getTagAllList () {
      this.$post(this.$store.state.api.tagList, {}).then((res) => {
        this.options = res.data
      })
    },
    save () {
      console.log(this.tagValue.length, this.copyTagValue.length)
      if (this.copyTagValue.length > 0) {
        var params = {
          table: 'stranger',
          recordID: this.strangerID,
          tagID: []
        }
        this.copyTagValue.map((item) => {
          params.tagID.push(item.ID)
        })
        if (params.tagID.length > 0) {
          this.$post(this.$store.state.api.deleteTag, params).then((res) => {
            if (res.success) {
              this.addTag()
            }
          })
        } else {
          this.addTag()
        }
      } else if (this.tagValue.length !== 0) {
        this.addTag()
      } else {
        this.back()
      }
    },
    addTag () {
      if (this.tagValue.length > 0) {
        var params = {
          table: 'stranger',
          recordID: this.ID,
          tagID: [],
          type: '陌生人标签'
        }
        this.tagValue.map((item) => {
          params.tagID.push(item.ID)
        })
        this.$post(this.$store.state.api.addTag, params).then((res) => {
          if (res.success) {
            this.$message.success('保存成功')
            this.back()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.back()
      }
    },
    toDetail (row) {
      this.info.buildingValue = row.location.name
      this.info.time = row.createTime
      this.info.img = row.headUrl
    },
    back () {
      this.$router.back()
    },
    // 获取标签列表
    getTagList () {
      var params = {
        table: 'stranger',
        recordID: this.strangerID
      }
      this.$post(this.$store.state.api.getTag, params).then((res) => {
        res.data.map((item) => {
          this.tagValue.push(item)
        })
        this.copyTagValue = JSON.parse(JSON.stringify(this.tagValue))
      })
    },
    // 获取陌生人详情和出入信息
    getInfo () {
      var params = {
        ID: this.strangerID
      }
      this.$post(this.$store.state.api['getStranger'], params).then((res) => {
        this.getTagList()
        this.time = res.data.updateTime
        var param = {
          strangerID: this.strangerID,
          limit: 20
        }
        this.$post(this.$store.state.api.getStrangerFaceLogList, param).then((item) => {
          item.data.map(res => {
            res.headUrl = window.localStorage.getItem('minioUrl') + res.headUrl
          })
          this.tableData = item.data
          this.info.buildingValue = this.tableData[0].location.name
          this.info.time = this.tableData[0].createTime
          this.info.img = this.tableData[0].headUrl
        })
      })
    }
  }
}
</script>

<style scoped>
.el-container {
  width: 17.4rem;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}
.el-container > p {
  color: #4a4a4a;
  font-size: 0.48rem;
  font-weight: 400;
  margin: 0 0 0.6rem 0;
}
.user-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 1.94rem;
  margin: 0 0 1.2rem 0;
}
.user-img {
  width: 3.26rem;
  height: 3.84rem;
  border: 1px solid #eee;
}

.user-text {
  height: 3.28rem;
  margin: 0.28rem 0 0.28rem 0.88rem;
}
.pwd {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 0 0.5rem 0;
  height: 0.76rem;
  line-height: 0.76rem;
}
.pwd > span {
  height: 0.76rem;
  line-height: 0.76rem;
  position: relative;
}

.pwd > span::before {
  content: "*";
  color: #d0021b;
  font-size: 0.44rem;
  position: absolute;
  top: 0.05rem;
  left: -0.3rem;
}
/deep/ .el-select,
.el-input {
  width: 8rem !important;
  height: 0.76rem;
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
}
.cancel {
  width: 2rem;
  height: 0.76rem;
  line-height: 0.76rem;
  background: rgba(102, 162, 228, 1);
  border-radius: 5px;
  color: #fff;
  font-size: 0.4rem;
}
.info {
  margin: 1rem 0 0.36rem 0.44rem;
  height: 0.66rem;
}
.info i {
  display: block;
  width: 0.06rem;
  height: 0.42rem;
  background-color: #346cb0;
  float: left;
}
.info span {
  float: left;
  font-size: 0.48rem;
  margin: 0 0 0 0.2rem;
}

.header {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid #eee;
}
</style>
