<template>
  <div class="people-container">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="证件类型" prop="idCardType">
            <el-select v-model="form.idCardType" placeholder="请选择">
              <el-option
                v-for="item in $store.state.idCardTypeList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="idCardNo">
            <el-input v-model="form.idCardNo"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择">
              <el-option
                v-for="item in gennerList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋" prop="locationID" class="activeReq">
            <el-select v-model="locationID" placeholder="请选择">
              <el-option
                v-for="item in buildingList"
                :key="item.ID"
                :label="item.name"
                :value="item.ID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称" prop="nickName">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="cellPhone">
            <el-input v-model="form.cellPhone" :maxlength=11></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="form.status" label="正常">正常</el-radio>
            <el-radio v-model="form.status" label="禁用">禁用</el-radio>
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
        type: '宿管人员',
        livePhoto1: '',
        livePhoto2: ''

      },
      locationID: '',
      rules: {
        name: { required: true, message: '请输入姓名', trigger: 'blur' },
        idCardNo: { required: true, message: '请输入学工号', trigger: 'blur' },
        idCardType: { required: true, message: '请输入学工号', trigger: 'blur' },
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
      collegeList: [{value: 1, label: '计算机学院'}, {value: 2, label: '外语学院'}],
      buildingList: []
    }
  },

  components: {},

  computed: {},

  mounted () {
    this.getLocation()
  },
  watch: {
    type (val) {
      if (val === 'reset') {
        this.$refs.form.resetFields()
        this.form.name = this.form.idCardNo = this.form.gender = this.form.nickName = this.locationID = this.form.cellPhone = this.form.status = ''
        this.$emit('updataType', {type: ''})
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

  methods: {
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
          this.$post(this.$store.state.api['createPeople'], [this.form]).then((data) => {
            if (data.success) {
              let params = {
                peopleID: data.data[0].peopleID,
                locationID: this.locationID
              }
              this.$post(this.$store.state.api['addPeopleLocation'], params).then((data) => {
                if (data.success) {

                }
              })
              // 下发超脑
              let config = {
                peopleID: params.peopleID,
                name: this.form.name,
                identityID: this.form.idCardNo,
                pictureType: this.src ? this.src.split('.')[1] : this.srcSec.split('.')[1],
                picture: this.src || this.srcSec,
                dbName: 'OpenDoor',
                operationType: 'add'
              }
              // 删除超脑信息
              let delParams = {
                peopleID: params.peopleID,
                dbName: 'OpenDoor'
              }
              if (this.form.status !== '正常') {
                this.$post(this.$store.state.api['deleteFace'], delParams).then(data => {
                  if (data.success) {
                    this.$message.success('新增成功')
                    if (this.type === 'next') {
                      this.form.name = this.form.idCardNo = this.form.gender = this.form.nickName = this.locationID = this.form.cellPhone = this.form.status = ''
                      this.$emit('updataType', {type: ''})
                    } else {
                      this.$router.push('/peoManager/strangers')
                    }
                  } else {
                    this.$message.error(data.msg)
                    this.$router.push('/peoManager/strangers')
                  }
                })
              } else {
                this.$post(this.$store.state.api['downLoadFaceToSuperBrain'], config).then((data) => {
                  console.log('下发超脑成功')
                  if (data.success) {
                    this.$message.success('新增成功')
                    if (this.type === 'next') {
                      this.form.name = this.form.idCardNo = this.form.gender = this.form.nickName = this.locationID = this.form.cellPhone = this.form.status = ''
                      this.$emit('updataType', {type: ''})
                    } else {
                      this.$router.push('/peoManager/strangers')
                    }
                  } else {
                    this.$message.error(data.msg)
                    this.$router.push('/peoManager/strangers')
                  }
                })
              }
            } else {
              this.$message.error(data.msg)
            }
          })
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
