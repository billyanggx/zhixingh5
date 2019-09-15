<template>
  <div class="people-information">
    <div class="people-butten">
      <span @click="updata" v-if="type == 'details'">修改</span>
      <span @click="saveAdd" v-else>保存</span>
      <span @click="back">取消</span>
    </div>
    <div class="people-photo" v-if="type == 'updata'">
      <div class="photo-box"  @click="setPhoto('1')">
        <div class="img">
          <img :src="src.trim()" :onerror="errorIMG">
        </div>
        <p>请拍摄照片</p>
      </div>
      <div class="photo-box" @click="setPhoto('2')">
        <div class="img">
          <img :src="srcSec.trim()" :onerror="errorIMG">
        </div>
        <p>拍摄时，请摘眼镜</p>
      </div>
    </div>
    <div class="people-photo" v-else>
      <div class="photo-box">
        <div class="img">
          <img :src="src.trim()" :onerror="errorIMG">
        </div>
        <p>请拍摄照片</p>
      </div>
      <div class="photo-box">
        <div class="img">
          <img :src="srcSec.trim()" :onerror="errorIMG">
        </div>
        <p>拍摄时，请摘眼镜</p>
      </div>
    </div>
    <ul class="people-type">
      <li v-for="(item, index) in peopleTypeList" :key="index" :class="sindex == index ? 'active' : 'unAtive'">{{item}}</li>
    </ul>
    <!-- 根据不同的人的类型来加载不同的基本信息 -->
    <div class="people-typeInfo">
      <p class="typeInfo-header">基本信息</p>
      <!-- 学生 -->
      <infoStudent  v-if="sindex == 0" ref="student" :type="type" @detailsSrc="detailsSrc" @detailsSrcSec="detailsSrcSec"  :src="src1" :srcSec="srcSec1"></infoStudent>
      <!-- 宿管人员 -->
      <infoAdmin  v-if="sindex == 1" ref="admin" :type="type" @detailsSrc="detailsSrc" @detailsSrcSec="detailsSrcSec"  :src="src1" :srcSec="srcSec1"></infoAdmin>
      <!-- 教职工 -->
      <infoTeacher  v-if="sindex == 2" ref="teacher" :type="type" @detailsSrc="detailsSrc" @detailsSrcSec="detailsSrcSec"  :src="src1" :srcSec="srcSec1"></infoTeacher>
    </div>
    <div class="people-typeInfo" style="margin:0.5rem 0;" v-if="type !== 'updata'">
      <p class="typeInfo-header">出入信息</p>
      <el-table
        :data="buildingList"
        style="width: 100%">
        <el-table-column
          prop="year"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="出入时间">
        </el-table-column>
        <el-table-column
          prop="building"
          label="楼栋">
        </el-table-column>
        <el-table-column
          prop="deviceParams"
          label="出入类型">
        </el-table-column>
      </el-table>
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
      errorIMG: 'this.src="' + require('../../../../assets/image/photo.png') + '"',
      value: '',
      peopleTypeList: ['学生', '宿管人员', '教职工'],
      sindex: 0,
      peopleID: '',
      type: 'details',
      dialogVisible: false,
      src: '',
      src1: '',
      srcSec: '',
      srcSec1: '',
      sign: '',
      buildingList: []
    }
  },
  components: {
    infoStudent, infoAdmin, infoTeacher, photoDialog
  },
  mounted () {
    this.sindex = parseInt(this.$route.query.index)
    this.peopleID = this.$route.query.peopleID
    this.getTable()
  },
  methods: {
    back () {
      this.$router.back()
    },
    // 获取拍照组件传过来的数据
    getSrc (e) {
      this.$nextTick(function () {
        this.src = window.localStorage.getItem('minioUrl') + e
        this.src1 = e
      })
    },
    // 获取拍照组件传过来的数据
    getSrcSec (e) {
      this.$nextTick(function () {
        this.srcSec = window.localStorage.getItem('minioUrl') + e
        this.srcSec1 = e
      })
    },
    // 获取类型组件传来的数据
    detailsSrc (e) {
      this.$nextTick(function () {
        this.src = window.localStorage.getItem('minioUrl') + e
        this.src1 = e
      })
    },
    // 获取类型组件传来的数据
    detailsSrcSec (e) {
      this.$nextTick(function () {
        this.srcSec = window.localStorage.getItem('minioUrl') + e
        this.srcSec1 = e
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
    // 修改
    updata () {
      this.type = 'updata'
    },
    // 获取列表
    getTable () {
      let params = {
        peopleID: this.peopleID,
        limit: 20
      }
      this.$post(this.$store.state.api['getPeopleFaceLogList'], params).then(data => {
        this.buildingList = data.data || []
        if (this.buildingList.length > 0) {
          this.buildingList.map(item => {
            item.year = this.$common.myTimeToLocal(item.createTime).substr(0, 10)
            item.createTime = this.$common.myTimeToLocal(item.createTime)
            item.building = item.location.name
            item.deviceParams = item.device.params
          })
        }
      })
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
  width: 2rem;
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

.people-information .people-photo .photo-box .img img{
  width: 100%;
  height: 100%;
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
}
.people-information .active{
  color:#fff !important;
  background: #66A2E4;
  border-radius:.1rem;
}
.people-information .unAtive{
  color:#909090 !important;
  background: #E8E8E8;
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
