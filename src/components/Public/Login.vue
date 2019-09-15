<template>
  <div class="el-container" v-loading="loading">
    <div class="login-main">
      <div class="top"></div>
      <p>登录</p>
      <div class="user-name">
        <i></i>
        <input type="text"  placeholder="请输入管理员姓名" v-model="username" />
      </div>
      <div class="user-pwd">
        <i></i>
        <input type="password"  placeholder="请输入登录密码" v-model="password" />
      </div>
      <div class="login-btn" @click="Login" >登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      username: 'admin',
      password: ''
    }
  },
  mounted () {
    // 监听enter键
    var that = this
    document.onkeydown = function (e) {
      var keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 13) {
        that.Login()
      }
    }
  },
  methods: {
    Login () {
      this.loading = true
      let params = {
        username: this.username,
        password: this.password
      }
      this.$post(this.$store.state.api['login'], params).then((res) => {
        this.loading = false
        if (res.success === false) {
          return this.$message.error(res.msg)
        }
        window.localStorage.setItem('token-JWT', res.data.token)
        window.localStorage.setItem('userName', res.data.name)
        window.localStorage.setItem('userType', res.data.type)
        window.localStorage.setItem('userID', res.data.userID)
        window.localStorage.setItem('userLocationID', res.data.locationID)
        var params = {
          name: '图片存储服务地址',
          userID: ''
        }
        this.$post(this.$store.state.api['getKey'], params).then(data => {
          window.localStorage.setItem('minioUrl', data.data)
        })
        var paramsMq = {
          name: 'mqtt地址',
          userID: ''
        }
        this.$post(this.$store.state.api['getKey'], paramsMq).then(data => {
          window.localStorage.setItem('mqttUrl', data.data)
        })
        this.$router.push('/home')
      }).catch((res) => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.el-container{
  width: 100%;
  height: 100%;
  background: url('../../assets/image/img-login-bg.png') no-repeat;
  background-size: 100%;
  position: relative;
}
.login-main{
  width: 9.26rem;
  height: 8.92rem;
  position: absolute;
  left: 6.38rem;
  top: 7.06rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top{
  width: 1.3rem;
  height: .16rem;
  background-color: #8B9BDE;
}
.login-main p{
  font-size: .88rem;
  text-align: left;
  margin: .54rem 0 .7rem 0;
}
.user-name, .user-pwd{
  border-bottom: 1px solid #E1E1E1;
  position: relative;
  height: .92rem;
  margin: 0 0 1.2rem 0;
}
.user-name i, .user-pwd i{
  position: absolute;
  left: .34rem;
  top: 0;
  width: .56rem;
  height: .6rem;
  background: url('../../assets/image/icon-login-user.png') no-repeat;
  background-size: 100%;
}
.user-pwd i{
  background: url('../../assets/image/icon-login-pwd.png') no-repeat;
  background-size: 100%;
}

.user-name input, .user-pwd input{
  width: 4.2rem;
  height: .6rem;
  position: absolute;
  left: 1.28rem;
  font-size: .4rem;
  border: none;
}
.login-btn{
  width: 4.6rem;
  height: 1rem;
  background:rgba(101,139,214,1);
  opacity: 0.9;
  border-radius: 4px;
  color: #fff;
  line-height: 1rem;
  font-size: .48rem;
  cursor: pointer;
}
</style>
