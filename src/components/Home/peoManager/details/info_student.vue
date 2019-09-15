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
          <el-form-item label="学院" prop="college" class="activeReq">
            <organization @sendOrganizationValue="sendOrganizationValue" :disabled="disabled"  :defaultShow="defaultShowOrganization"></organization>
          </el-form-item>
          <!-- <el-form-item label="学院" prop="college">
            <el-select v-model="form.college" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in collegeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-select v-model="form.major" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in collegeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="classNum">
            <el-select v-model="form.classNum" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in collegeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="楼栋" prop="building" class="activeReq">
            <location  @sendLocationValue="sendLocationListValue" :disabled="disabled" :defaultShow="defaultShowLocation"></location>
          </el-form-item>
          <!-- <el-form-item label="楼栋" prop="building">
            <el-select v-model="form.building" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in buildingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="宿舍" prop="dormitory">
            <el-select v-model="form.dormitory" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in buildingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="手机号" prop="cellPhone">
            <el-input v-model="form.cellPhone" :disabled="disabled" :maxlength=11></el-input>
          </el-form-item>
          <el-form-item label="入学时间" prop="expiryDateFrom">
            <el-date-picker
              v-model="form.expiryDateFrom"
              type="date"
              value-format = 'yyyy-MM-dd HH-mm-ss'
              placeholder="选择日期" :disabled="disabled">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="毕业时间" prop="expiryDateTo">
            <el-date-picker
              value-format = 'yyyy-MM-dd HH-mm-ss'
              v-model="form.expiryDateTo"
              type="date"
              placeholder="选择日期" :disabled="disabled">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="form.status" label="正常" :disabled="disabled">正常</el-radio>
            <el-radio v-model="form.status" label="禁用" :disabled="disabled">禁用</el-radio>
          </el-form-item>
        </el-form>
      </div>
</template>

<script>
import organization from '@/components/common/organization_search'
import location from '@/components/common/location_search'
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
      disabled: true,
      rules: {
        name: { required: true, message: '请输入部门编号', trigger: 'blur' },
        idCardNo: { required: true, message: '请输入部门名称', trigger: 'blur' },
        idCardType: { required: true, message: '请输入部门名称', trigger: 'blur' },
        gender: { required: true, message: '请输入部门等级', trigger: 'blur' },
        cellPhone: [
          { required: true, message: '', trigger: 'blur' },
          {min: 11, message: '请输入正确的电话号码', trigger: 'blur'}
        ],
        expiryDateFrom: { required: true, message: '请输入部门描述', trigger: 'blur' },
        expiryDateTo: { required: true, message: '请输入部门描述', trigger: 'blur' },
        teacher: { required: false, message: '请输入部门描述', trigger: 'blur' }
      },
      gennerList: [{value: '男', label: '男'}, {value: '女', label: '女'}],
      collegeList: [{value: 1, label: '计算机学院'}, {value: 2, label: '外语学院'}],
      buildingList: [{value: 1, label: '男生宿舍楼'}, {value: 2, label: '女生宿舍楼'}],
      locationSelected: [],
      organizationSelected: [],
      defaultShowOrganization: [], // 回显的信息
      defaultShowLocation: [],
      timer: null
    }
  },

  components: {organization, location},

  computed: {},

  mounted () {
    this.$nextTick(function () {
      this.getPeopleInfo()
    })
  },
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
  beforeDestroyed () {
    this.timer = null
  },
  methods: {
    // 选择学院
    sendOrganizationValue (val) {
      this.organizationSelected = val
    },
    // 选择楼栋
    sendLocationListValue (val) {
      this.locationSelected = val
    },
    // 保存新增
    saveAdd () {
      if (!this.src && !this.srcSec) {
        return this.$message.error('请拍摄照片')
      }
      if (!this.locationSelected) {
        return this.$message.error('请选择楼栋')
      }
      if (!this.organizationSelected) {
        return this.$message.error('请选择学院')
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.updatePeople()
        }
      })
    },
    // 获取人员信息
    getPeopleInfo () {
      this.$post(this.$store.state.api['getPeopleInfo'], {peopleID: this.$route.query.peopleID}).then((data) => {
        if (data.success) {
          this.form = Object.assign({}, this.form, data.data)
          this.defaultShowLocation = this.form.locationIDs.split(',')
          if (this.form.organizationList && this.form.organizationList.length > 0) {
            this.defaultShowOrganization = this.form.organizationList[0]
          }
          this.$emit('detailsSrc', this.form.livePhoto1)
          this.$emit('detailsSrcSec', this.form.livePhoto2)
        }
      })
    },
    // 修改人员信息
    updatePeople: async function () {
      this.form.expiryDateFrom = this.$common.myTimeToLocal(this.form.expiryDateFrom)
      this.form.expiryDateTo = this.$common.myTimeToLocal(this.form.expiryDateTo)

      let params = {peopleID: this.$route.query.peopleID, data: this.form}
      await this.$post(this.$store.state.api['updatePeople'], params).then((data) => {
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
        } else {
          this.$message.error('修改失败')
        }
      })
      await this.awaitFunc()
      // this.$router.push('/peoManager/students')
      this.timer = setTimeout(() => { this.$router.back() }, 1000)
    },
    async awaitFunc () {
      // 比对组织关系及位置关系是否修改  如果修改调用删除+add接口
      let delParams = {
        peopleID: this.$route.query.peopleID,
        locationID: this.form.locationID ? this.form.locationID : this.locationSelected,
        organizationID: this.organizationSelected
      }
      let addParams = {
        peopleID: this.$route.query.peopleID,
        locationID: this.locationSelected ? this.locationSelected : this.form.locationID,
        organizationID: this.organizationSelected
      }
      if (this.form.locationID !== this.locationSelected) {
        await this.$post(this.$store.state.api['deletePeopleLocation'], delParams).then(data => {
          if (data.success) {
            this.$post(this.$store.state.api['addPeopleLocation'], addParams).then(data => {
              console.log('更新位置信息成功')
            })
          }
        })
      }
      if (this.form.organizationID !== this.organizationSelected) {
        await this.$post(this.$store.state.api['deletePeopleOrganization'], delParams).then(data => {
          if (data.success) {
            this.$post(this.$store.state.api['addPeopleOrganization'], addParams).then(data => {
              console.log('更新组织关系信息成功')
            })
          }
        })
      }
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
