<template>
  <div class="el-container">
    <p>{{$route.query.type === 'add' ? '添加' : '修改'}}角色</p>
    <div class="pwd">
      <span>角色名称：</span>
      <el-input size="small" placeholder="请输入角色名称"></el-input>
    </div>
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      show-checkbox
      @check-change="handleCheckChange">
    </el-tree>
    <div class="btn">
      <div class="save" @click="add">保存</div>
      <div class="cancel" @click="back">取消</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'update_pwd',
  data () {
    return {
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      currentType: 0,
      radio: true,
      userInfo: '',
      number: '',
      phone: '',
      userList: []
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick (data) {
      console.log(data)
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }])
      }
      if (node.level > 3) return resolve([])

      var hasChild
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }
      setTimeout(() => {
        var data
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }]
        } else {
          data = []
        }
        resolve(data)
      }, 500)
    },
    back () {
      this.$router.back()
    },
    getUserList () {
      let params = {
        idCardNo: '',
        name: '',
        cellPhone: '',
        locationID: [],
        organizationID: [],
        createTime: {
          from: '',
          to: ''
        },
        type: ''
      }
      params.type = this.currentType === 1 ? '教师' : '宿管人员'
      this.$post(this.$store.state.api['queryPeopleList'], params).then(data => {
        var type = this.currentType === 1 ? '教师' : '宿管人员'
        console.log(data.data.data)
        this.userList = data.data.data.filter((item) => { return item.type === type }) || []
      })
    },
    getUserInfo () {
      this.number = this.userInfo.idCardNo
      this.phone = this.userInfo.cellPhone
    },
    add () {
      if (this.userInfo === '') {
        return this.$message.error('必须选择一个资源')
      }
      if (this.number === '') {
        return this.$message.error('菜单名称不能为空')
      }
      if (this.phone === '') {
        return this.$message.error('链接不能为空')
      }
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
.el-container .type{
    width: 3.3rem;
    height: .62rem;
    line-height: .62rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: flex-end;
    margin: 0 0 .4rem 0;
}
.type li:first-child::after{
  content: '';
  border-right: 1px solid #CECECE;
  margin: 0 .2rem;
}
.type li{
  font-size: .4rem;
  color: #8C8C8C;
  cursor: pointer;
}
.type li.is-active{
  color: #66A2E4;
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
.el-input, .el-radio-group, .el-select{
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
