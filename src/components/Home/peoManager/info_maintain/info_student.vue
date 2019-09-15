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
          <el-form-item label="学院" prop="organizationID" class="activeReq">
            <organization @sendOrganizationValue="sendOrganizationValue"></organization>
          </el-form-item>
          <!-- <el-form-item label="学院" prop="college">
            <el-select v-model="form.college" placeholder="请选择" @change="collegeChange">
              <el-option
                v-for="item in collegeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-select v-model="form.major" placeholder="请选择" :disabled="disabled1" @change="majorChange">
              <el-option
                v-for="item in collegeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="classNum">
            <el-select v-model="form.classNum" placeholder="请选择" :disabled="disabled2">
              <el-option
                v-for="item in collegeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋" prop="building">
            <el-select v-model="form.building" placeholder="请选择">
              <el-option
                v-for="item in buildingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="宿舍" prop="dormitory">
            <el-select v-model="form.dormitory" placeholder="请选择">
              <el-option
                v-for="item in buildingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="楼栋" prop="locationID" class="activeReq">
            <location @sendLocationValue="sendLocationListValue"></location>
          </el-form-item>
          <el-form-item label="手机号" prop="cellPhone">
            <el-input v-model="form.cellPhone" :maxlength=11></el-input>
          </el-form-item>
          <el-form-item label="入学时间" prop="expiryDateFrom">
            <el-date-picker
              v-model="form.expiryDateFrom"
              type="date"
              value-format = 'yyyy-MM-dd HH-mm-ss'
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="毕业时间" prop="expiryDateTo">
            <el-date-picker
              v-model="form.expiryDateTo"
              type="date"
              value-format = 'yyyy-MM-dd HH-mm-ss'
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="form.status" label="正常">正常</el-radio>
            <el-radio v-model="form.status" label="禁用">禁用</el-radio>
          </el-form-item>
        </el-form>
      </div>
</template>

<script>
import organization from '@/components/common/organization_search'
import location from '@/components/common/location_search'
export default {
  components: {
    organization, location
  },
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
        type: '学生',
        livePhoto1: '',
        livePhoto2: '',
        status: '正常',
        expiryDateFrom: '2018-09-1 00:00:00',
        expiryDateTo: '2021-07-1 00:00:00'
      },
      rules: {
        name: { required: true, message: '姓名不能为空', trigger: 'blur' },
        idCardType: { required: true, message: '学号不能为空', trigger: 'blur' },
        idCardNo: { required: true, message: '学号不能为空', trigger: 'blur' },
        gender: { required: false, message: '性别', trigger: 'blur' },
        cellPhone: [
          { required: true, message: '', trigger: 'blur' },
          {min: 11, message: '请输入正确的电话号码', trigger: 'blur'}
        ],
        expiryDateFrom: { required: true, message: '入学时间不能为空', trigger: 'blur' },
        expiryDateTo: { required: true, message: '毕业时间不能为空', trigger: 'blur' }
        // organizationID: { required: true, message: '学院不能为空', trigger: 'blur' },
        // locationID: { required: true, message: '位置不能为空', trigger: 'blur' }
      },
      gennerList: [{value: '男', label: '男'}, {value: '女', label: '女'}],
      collegeList: [{value: 1, label: '计算机学院'}, {value: 2, label: '外语学院'}],
      buildingList: [{value: 1, label: '男生宿舍楼'}, {value: 2, label: '女生宿舍楼'}],
      locationSelected: '',
      organizationSelected: [],
      cc: []
    }
  },

  computed: {},

  mounted () {
    // let aa = [{id: 1, key: '2', children: [{id: 3, key: '4', children: [{id: 5, key: '6', children: []}, {id: 5, key: '8', children: []}]}]}]
    // let bb = [1, 3, 5, 6]
    // this.aaa(aa, bb)
    // console.log(this.cc)
  },
  watch: {
    type (val) {
      if (val === 'reset') {
        this.$refs.form.resetFields()
        this.form.name = this.form.gedner = this.form.idCardType = this.form.idCardNo = this.form.expiryDateFrom = this.form.cellPhone = this.form.expiryDateTo = ''
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
    },
    locationSelected: {
      handler (newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          // this.form.locationID = newVal[newVal.length - 1]
          console.log(this.form.locationID)
          // this.$refs.form.validateField('locationID')
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    // aaa (arr, bb) {
    //   arr.map(item => {
    //     bb.map(item1 => {
    //       if (item.id === item1) {
    //         this.cc.push(item.key)
    //       }
    //     })
    //     if (item.children.length > 0) {
    //       this.aaa(item.children, bb)
    //     }
    //   })
    // },
    // 选择学院
    sendOrganizationValue (val) {
      this.organizationSelected = val
    },
    // 选择楼栋
    sendLocationListValue (val) {
      this.locationSelected = val
    },
    // 保存新增
    async saveAdd () {
      console.log(this.locationSelected, this.organizationSelected)
      if (!this.src && !this.srcSec) {
        return this.$message.error('请拍摄照片')
      }
      if (!this.locationSelected) {
        return this.$message.error('请选择楼栋')
      }
      if (!this.organizationSelected || this.organizationSelected.length === 0) {
        return this.$message.error('请选择学院')
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$post(this.$store.state.api['createPeople'], [this.form]).then((data) => {
            if (data.success) {
              let params = {
                peopleID: data.data[0].peopleID,
                organizationID: this.organizationSelected,
                locationID: this.locationSelected
              }
              this.$post(this.$store.state.api['addPeopleOrganization'], params).then((data) => {
                if (data.success) {

                }
              })
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
                      this.form.name = this.form.gender = this.form.idCardNo = this.form.expiryDateFrom = this.form.cellPhone = this.form.expiryDateTo = ''
                      this.$emit('updataType', {type: ''})
                    } else {
                      this.$router.push('/peoManager/students')
                    }
                  } else {
                    this.$message.error(data.msg)
                    this.$router.push('/peoManager/students')
                  }
                })
              } else {
                this.$post(this.$store.state.api['downLoadFaceToSuperBrain'], config).then((data) => {
                  console.log('下发超脑成功')
                  if (data.success) {
                    this.$message.success('新增成功')
                    if (this.type === 'next') {
                      this.form.name = this.form.gender = this.form.idCardNo = this.form.expiryDateFrom = this.form.cellPhone = this.form.expiryDateTo = ''
                      this.$emit('updataType', {type: ''})
                    } else {
                      this.$router.push('/peoManager/students')
                    }
                  } else {
                    this.$message.error(data.msg)
                    this.$router.push('/peoManager/students')
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
