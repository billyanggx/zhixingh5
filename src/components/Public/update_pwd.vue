<template>
  <div class="el-container" v-loading="loading">
    <p>修改密码</p>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="ruleForm.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'update_pwd',
  data () {
    var checkOldPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      console.log(value, this.ruleForm.oldPwd)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度至少为6位'))
      } else if (value === this.ruleForm.oldPwd) {
        return callback(new Error('不能和旧密码相同！'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        pass: '',
        checkPass: '',
        oldPwd: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldPwd: [
          { validator: checkOldPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        this.loading = true
        if (valid) {
          var params = {
            username: '' + window.localStorage.getItem('userName'),
            oldPassword: '' + this.ruleForm.oldPwd,
            password: '' + this.ruleForm.checkPass
          }
          this.$post(this.$store.state.api['updatePassword'], params).then((res) => {
            this.loading = false
            if (res.success === true) {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
</style>
