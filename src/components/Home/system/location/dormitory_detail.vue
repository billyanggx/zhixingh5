<template>
  <div class="el-container">
    <p>修改宿舍</p>
    <div class="pwd">
      <span> 楼栋：</span>
      <el-input size="small" :disabled="true" v-model="name"></el-input>
    </div>
    <div class="pwd">
      <span> 宿舍：</span>
      <el-input size="small" :disabled="true" v-model="dormitory_name"></el-input>
    </div>
    <div class="pwd">
      <span> 宿舍类型：</span>
      <el-select v-model="type" placeholder="请选择">
        <el-option v-for="item in gennerList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="btn">
      <div class="save" @click="add">保存</div>
      <div class="cancel" @click="back">取消</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      type: '',
      gennerList: [{ value: '男生寝室', label: '男生寝室' }, { value: '女生寝室', label: '女生寝室' }]
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.name = this.$store.state.updateInfo.buildingName
      this.dormitory_name = this.$store.state.updateInfo.name
      this.type = this.$store.state.updateInfo.remark
    },
    back () {
      this.$router.back()
    },
    add () {
      if (this.name === '') {
        return this.$message.error('楼栋名不能为空')
      }
      if (this.dormitory_name === '') {
        return this.$message.error('宿舍名不能为空')
      }
      let params = {
        locationID: this.$store.state.updateInfo.ID,
        remark: this.type === this.$store.state.updateInfo.remark ? '' : this.type
      }
      this.$post(this.$store.state.api.updateLocation, params).then((res) => {
        if (res.success === true) {
          this.$message.success(res.msg)
          this.back()
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
  width: 17.4rem;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 3.4rem;
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
.el-input,
.el-radio-group,
.el-select {
  width: 8rem;
  height: 0.76rem;
  line-height: 0.76rem;
  text-align: left;
  display: flex;
  align-items: center;
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
