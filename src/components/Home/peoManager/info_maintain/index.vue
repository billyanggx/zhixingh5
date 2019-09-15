<template>
  <div class="people-information">
    <div class="people-butten">
      <!-- <span @click="containue">保存并继续</span> -->
      <span @click="saveAdd">保存</span>
      <span @click="reset">重置</span>
    </div>
    <!-- <button id="take" @click="getPhoto">拍照</button>
  <button id="stop" @click="stopPhoto">关闭</button> -->
    <div class="people-photo">
      <div class="photo-box"  @click="setPhoto('1')">
        <div class="img" v-if="src">
          <img :src="src" id="photo" alt="" style="width:100%;height:100%">
        </div>
        <div class="imgDefalt" v-else>
          <img src="../../../../assets/image/photo.png"  style="">
        </div>
        <p>请拍摄照片</p>
      </div>
      <div class="photo-box" @click="setPhoto('2')">
        <div class="img" v-if="srcSec">
          <img :src="srcSec" id="photo" alt="" style="width:100%;height:100%">
        </div>
        <div class="imgDefalt" v-else>
          <img src="../../../../assets/image/photo.png"  style="">
        </div>
        <p>拍摄时，请摘眼镜</p>
      </div>
    </div>
    <ul class="people-type" v-if="$route.query.sign">
      <li v-for="(item, index) in peopleTypeList" :key="index" :class="$route.query.index == index ? 'active' : ''">{{item}}</li>
    </ul>
    <ul class="people-type" v-else>
      <li v-for="(item, index) in peopleTypeList" :key="index" :class="sindex == index ? 'active' : ''" @click="changePType(item, index)">{{item}}</li>
    </ul>
    <!-- 根据不同的人的类型来加载不同的基本信息 -->
    <div class="people-typeInfo">
      <p class="typeInfo-header">基本信息</p>
      <!-- 学生 -->
      <infoStudent  v-if="sindex == 0" ref="student" :type="type" @updataType="updataType" :src="src1" :srcSec="srcSec1"></infoStudent>
      <!-- 宿管人员 -->
      <infoAdmin  v-if="sindex == 1" ref="admin" :type="type" @updataType="updataType" :src="src1" :srcSec="srcSec1"></infoAdmin>
      <!-- 教职工 -->
      <infoTeacher  v-if="sindex == 2" ref="teacher" :type="type" @updataType="updataType" :src="src1" :srcSec="srcSec1"></infoTeacher>
    </div>
      <photoDialog :dialogVisible="dialogVisible" v-if="dialogVisible" @sendSrc="getSrc" @sendSrcSec="getSrcSec"></photoDialog>
  </div>
</template>
<script>
import infoStudent from './info_student'
import infoAdmin from './info_admin'
import infoTeacher from './info_teacher'
import photoDialog from '../photoDialog'
export default {
  data () {
    return {
      value: '',
      type: '',
      peopleTypeList: ['学生', '宿管人员', '教职工'],
      sindex: 0,
      dialogVisible: false,
      src: '',
      src1: '',
      srcSec: '',
      srcSec1: '',
      sign: ''
    }
  },
  components: {
    infoStudent, infoAdmin, infoTeacher, photoDialog
  },
  mounted () {
    if (this.$route.query.sign) {
      this.sindex = this.$route.query.index
    }
  },
  methods: {
    getSrc (e) {
      this.$nextTick(function () {
        this.src1 = e
        this.src = window.localStorage.getItem('minioUrl') + e
      })
    },
    getSrcSec (e) {
      this.$nextTick(function () {
        this.srcSec1 = e
        this.srcSec = window.localStorage.getItem('minioUrl') + e
      })
    },
    // 调用摄像头
    setPhoto (str) {
      this.dialogVisible = true
      this.sign = str
      this.$nextTick(function () {
        this.$bus.emit('setPhoto', {dialogVisible: this.dialogVisible, sign: this.sign})
      })
    },
    // 选择人员类型
    changePType (item, index) {
      this.sindex = index
      this.src = this.srcSec = ''
    },
    // 继续添加
    containue () {
      this.type = 'next'
      // 出发子组件的保存事件
      if (this.sindex === 0) {
        this.$refs.student.saveAdd()
      } else if (this.sindex === 1) {
        this.$refs.admin.saveAdd()
      } else {
        this.$refs.teacher.saveAdd()
      }
    },
    // 重置信息
    reset () {
      this.type = 'reset'
    },
    // 保存修改后的type
    updataType (e) {
      this.type = e.type
    },
    // 保存信息
    saveAdd () {
      // 出发子组件的保存事件
      if (this.sindex === 0) {
        this.$refs.student.saveAdd()
      } else if (this.sindex === 1) {
        this.$refs.admin.saveAdd()
      } else {
        this.$refs.teacher.saveAdd()
      }
    }
  }

}
</script>
<style scoped>
.people-information{
   background: #F2F3F8;
}
.people-information .people-butten{
  background: #fff;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: right
}
.people-information .people-butten span{
  display: inline-block;
  text-align: center;
  width: 3rem;
  height: 0.8rem;
  line-height: 0.8rem;
  border: 1px solid #66A2E4;
  border-radius: 0.1rem;
  margin-right: 0.4rem;
  color: #66A2E4;
  cursor: pointer;
}
.people-information .people-butten span:last-child{
  color: #fff;
  background: #66A2E4;
}
.people-information .people-photo{
  margin-top: 0.4rem;
  background: #fff;
  text-align: center
}
.people-information .people-photo .photo-box{
  display: inline-block;
  padding: 0.4rem;
}
.people-information .people-photo .photo-box .img{
  display: inline-block;
  width: 4.4rem;
  height: 4.4rem;
  border: 2px dashed #B9B9B9;
}
.people-information .people-photo .photo-box .imgDefalt{
  display: flex;
  width: 4.4rem;
  height: 4.4rem;
  border: 2px dashed #B9B9B9;
  justify-content: center;
  align-items: center;
}
.people-information .people-photo .photo-box p{
  font-size: 0.36rem;
  height: 1rem;
  line-height: 1rem;
  padding-bottom: .2rem;
  position: relative;
}
.people-information .people-photo .photo-box p::before{
  content: '!';
  position: absolute;
  top:.35rem;
  left:0.2rem;
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  line-height: .3rem;
  font-size: .2rem;
  padding: .05rem;
  background: #FAAD14;
  color: #fff;
  border-radius:50%;
}
.people-information .people-type{
  display: flex;
  justify-content: center;
  align-items:center;
}
.people-information .people-type li{
  margin: .3rem;
  font-size: .6rem;
  width: 3.4rem;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #66A2E4;
  border:1px dashed #66A2E4;
  cursor: pointer;
}
.people-information .active{
  color:#fff !important;
  background: #66A2E4;
  border-radius:.1rem;
}
.people-typeInfo{
  background: #fff;
  padding: .4rem;
}
.people-typeInfo .typeInfo-header{
  font-size: 0.48rem;
  text-align: left;
  padding-left:.2rem;
  position: relative;
}
.people-typeInfo .typeInfo-header::before{
  content: "";
  width: 3px;
  height: 80%;
  position: absolute;
  top:0;
  left:0;
  background: #346CB0;
}

.people-typeInfo .el-form {
  display: flex;
  flex-wrap: wrap;
  padding-top: 1rem;
  /* justify-content: center; */
}
/deep/ .people-typeInfo .el-form .el-form-item{
  width: 33.3%;
  display: flex;
}
/deep/ .people-typeInfo .el-form .el-form-item .el-select{
  width: 100%;
}
/deep/ .people-typeInfo .el-form .el-form-item .el-form-item__label{
  width: 30%;
}
/deep/ .people-typeInfo .el-form .el-form-item .el-form-item__label{
  width: 30%;
}
/deep/ .people-typeInfo .el-form .el-form-item .el-form-item__content{
  display: flex;
  width: 70%;
}
/deep/ .people-container .el-form .el-form-item .el-radio{
  line-height: 40px !important;
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
</style>
