<template>
  <div class="people-container">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="证件类型" prop="idCardType">
            <el-select v-model="form.idCardType" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in $store.state.idCardTypeList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="idCardNo">
            <el-input v-model="form.idCardNo" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in gennerList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋" prop="locationID" class="activeReq">
            <el-select v-model="locationID" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in buildingList"
                :key="item.ID"
                :label="item.name"
                :value="item.ID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称" prop="nickName">
            <el-input v-model="form.nickName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="cellPhone">
            <el-input v-model="form.cellPhone" :disabled="disabled" :maxlength=11></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio v-model="form.status" label="正常" :disabled="disabled">正常</el-radio>
            <el-radio v-model="form.status" label="禁用" :disabled="disabled">禁用</el-radio>
          </el-form-item>
        </el-form>
      </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    },
    srcSec: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        name: '',
        status: '正常',
        livePhoto1: '',
        livePhoto2: ''
      },
      // 录屏
      disabled: true,
      locationID: '',
      rules: {
        name: { required: true, message: '请输入姓名', trigger: 'blur' },
        idCardNo: { required: true, message: '请输入学工号', trigger: 'blur' },
        idCardType: { required: true, message: '请输入部门名称', trigger: 'blur' },
        gedner: { required: false, message: '请输入部门等级', trigger: 'blur' },
        nickName: { required: false, message: '', trigger: 'blur' },
        cellPhone: [
          { required: true, message: '', trigger: 'blur' },
          {min: 11, message: '请输入正确的电话号码', trigger: 'blur'},
          {pattern: /^(1[34578]\d{9})|(0)$/, message: '请输入正确的电话号码'}
        ],
        status: { required: true, message: '', trigger: 'blur' }
      },
      gennerList: [{value: '男', label: '男'}, {value: '女', label: '女'}],
      buildingList: []
    }
  },

  components: {},

  computed: {},

  watch: {
    type (val) {
      if (val === 'updata') {
        this.disabled = false
      }
    },
    src (val) {
      if (val) {
        this.form.livePhoto1 = this.src
      }
    },
    srcSec (val) {
      if (val) {
        this.form.livePhoto2 = this.srcSec
      }
    }
  },
  mounted () {
    this.getLocation()
    this.getPeopleInfo()
  },
  methods: {
    // 保存新增
    saveAdd () {
      if (!this.src && !this.srcSec) {
        return this.$message.error('请拍摄照片')
      }
      if (!this.locationID) {
        return this.$message.error('请选择楼栋')
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.updatePeople()
        }
      })
    },
    // 获取location列表
    getLocation () {
      let params = {
        locationID: '',
        type: '楼栋'.split()
      }
      this.$post(this.$store.state.api['getChildLocation'], params).then(data => {
        this.buildingList = data.data || []
      })
    },
    // 获取人员信息
    getPeopleInfo () {
      this.$post(this.$store.state.api['getPeopleInfo'], {peopleID: this.$route.query.peopleID}).then((data) => {
        if (data.success) {
          this.form = Object.assign({}, this.form, data.data)
          console.log(this.form)
          this.locationID = this.form.locationID
          this.$emit('detailsSrc', this.form.livePhoto1)
          this.$emit('detailsSrcSec', this.form.livePhoto2)
        }
      })
    },
    // 修改人员信息
    updatePeople () {
      let params = {peopleID: this.$route.query.peopleID, data: this.form}
      this.$post(this.$store.state.api['updatePeople'], params).then((data) => {
        if (data.success) {
          // 下发超脑
          let config = {
            peopleID: this.$route.query.peopleID,
            name: this.form.name,
            identityID: this.form.idCardNo,
            pictureType: this.form.livePhoto1 ? this.form.livePhoto1.split('.')[1] : this.form.livePhoto2.split('.')[1],
            picture: this.form.livePhoto1 || this.form.livePhoto2,
            dbName: 'OpenDoor',
            operationType: 'update'
          }
          // 删除超脑信息
          let delParams = {
            peopleID: this.$route.query.peopleID,
            dbName: 'OpenDoor'
          }
          if (this.form.status !== '正常') {
            this.$post(this.$store.state.api['deleteFace'], delParams).then(data => {
              if (data.success) {

              } else {
                return this.$message.error(data.msg)
              }
            })
          } else {
            this.$post(this.$store.state.api['downLoadFaceToSuperBrain'], config).then((data) => {
              if (data.success) {

              } else {
                return this.$message.error(data.msg)
              }
            })
          }
          this.$message.success('修改成功')
          this.form = Object.assign({}, this.form, data.data)
          // this.$router.push('/peoManager/strangers')
          this.$router.back()
        } else {
          this.$message.error('修改失败')
        }
      })
    }
  }
}
</script>
<style scoped>
.people-container .el-form {
  display: flex;
  flex-wrap: wrap;
  padding-top: 1rem;
  /* justify-content: center; */
}
/deep/ .people-container .el-form .el-form-item{
  width: 33.3%;
  display: flex;
}
/deep/ .people-container .el-form .el-form-item .el-select{
  width: 100%;
}
/deep/ .people-container .el-form .el-form-item .el-form-item__label{
  width: 30%;
}
/deep/ .people-container .el-form .el-form-item .el-form-item__label{
  width: 30%;
}
/deep/ .people-container .el-form .el-form-item .el-form-item__content{
  display: flex;
  width: 70%;
}
</style>
