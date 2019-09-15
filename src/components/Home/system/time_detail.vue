<template>
  <div class="el-container">
    <p>{{$route.query.type === 'add' ? '添加' : '修改'}}考勤时间设置</p>
    <div class="pwd">
      <span> 参数名称：</span>
      <el-input
        size="small"
        placeholder="请输入参数名称"
        v-model="name" >
      </el-input>
    </div>
    <div class="pwd">
      <span>参数描述：</span>
      <el-input
        size="small"
        placeholder="请输入参数描述"
        v-model="describe" >
      </el-input>
    </div>
    <div class="pwd">
      <span>参数值：</span>
      <el-input
        size="small"
        placeholder="请输入参数值"
        v-model="value" >
      </el-input>
    </div>
    <div class="pwd">
      <span>状态：</span>
      <el-radio-group v-model="radio">
          <el-radio :label="true">激活</el-radio>
          <el-radio :label="false">禁用</el-radio>
      </el-radio-group>
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
      radio: true,
      name: '',
      describe: '',
      value: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    add () {
      let params = {
        name: this.name,
        value: this.value
      }
      this.$post(this.$store.state.api['addKey'], params).then(data => {
        if (data.success) {
          this.$message.success(data.msg)
          this.back()
        } else {
          this.$message.error(data.msg)
        }
      })
      console.log(params)
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
  padding: .5rem 3.4rem;
}
.el-container>p{
  color: #4A4A4A;
  font-size: .48rem;
  font-weight: 400;
  margin: 0 0 .6rem 0;
}
.pwd{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 0 .5rem 0;
  height: .76rem;
  line-height: .76rem;
}
.pwd>span{
  height: .76rem;
  line-height: .76rem;
  position: relative;
}

.pwd>span::before{
  content: '*';
  color: #D0021B;
  font-size: .44rem;
  position: absolute;
  top: .05rem;
  left: -0.3rem;
}
.el-input, .el-radio-group{
  width: 8rem;
  height: .76rem;
  line-height: .76rem;
  text-align: left;
  display: flex;
  align-items: center;
}
.btn{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.save{
  width: 2rem;
  height: .76rem;
  line-height: .76rem;
  background: #fff;
  border: 2px solid rgba(102,162,228,1);
  border-radius: 5px;
  color: #66A2E4;
  font-size: .4rem;
  margin: 0 .4rem 0 0 ;
  cursor: pointer;
}
.cancel{
  width: 2rem;
  height: .76rem;
  line-height: .76rem;
  background: rgba(102,162,228,1);
  border-radius: 5px;
  color: #fff;
  font-size: .4rem;
  cursor: pointer;
}

</style>
