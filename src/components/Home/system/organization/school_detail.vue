<template>
  <div class="el-container" @click="updSucessTag">
    <p>修改学院</p>
    <div class="pwd">
      <span>学院名称：</span>
      <el-input size="small" @click.native="updTag" v-model="name"></el-input>
    </div>
    <div class="pwd">
      <span>专业名称：</span>
      <ul>
        <li v-for="(item, index) in tagList" :key="index">
          <i v-if="$route.query.type === 'add'" @click="delTag(index, item)"></i>
          <el-tooltip content="单击修改文字" placement="top" :open-delay=300>
            <el-input placeholder="请输入" v-if="isInputNumber === index" @click.native="updTag" autofocus="autofocus" size="mini" v-model="currentTag">
            </el-input>
            <span @click="canUpText(index, item)" v-else>{{item.name}}</span>
          </el-tooltip>
        </li>
        <li v-if="$route.query.type === 'add'" class="add" @click="addTag"></li>
      </ul>
    </div>
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
      name: '',
      majorName: '',
      tagList: [],
      currentTag: '',
      currentTagInfo: {},
      isInputNumber: ''
    }
  },
  mounted () {
    // 监听enter键
    var that = this
    document.onkeydown = function (e) {
      var keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 13) {
        that.updSucessTag()
      }
    }
    console.log(this.$store.state.updateInfo)
    if (this.$store.state.updateInfo !== '') {
      this.getDetail()
    }
  },
  methods: {
    getDetail () {
      var params = {
        organizationID: this.$store.state.updateInfo.academyID
      }
      this.$post(this.$store.state.api.organizationInfo, params).then((res) => {
        this.name = this.$store.state.updateInfo.academyName
        this.tagList = res.data.major
      })
    },
    back () {
      event.stopPropagation()
      this.$router.back()
    },
    updTag () {
      event.stopPropagation()
    },
    canUpText (index, item) {
      event.stopPropagation()
      this.isInputNumber = index
      this.currentTagInfo = item
      this.currentTag = this.tagList[index] === '请输入' ? '' : this.tagList[index].name
    },
    addTag () {
      event.stopPropagation()
      this.tagList.push('请输入')
      console.log(this.tagList.length)
      this.isInputNumber = this.tagList.length - 1
    },
    delTag (index, item) {
      event.stopPropagation()
      this.isInputNumber = ''
      this.tagList.splice(index, 1)
    },
    updSucessTag () {
      console.log('???')
      console.log(this.currentTag, this.isInputNumber)
      return new Promise((resolve, reject) => {
        if (this.isInputNumber !== '') {
          this.currentTagInfo.name = this.currentTag
          this.currentTagInfo.isUpdate = true
          this.tagList.splice(this.isInputNumber, 1, this.currentTagInfo)
          this.isInputNumber = ''
          this.currentTag = ''
          resolve()
        } else {
          resolve()
        }
      })
    },
    add () {
      event.stopPropagation()
      if (this.name === '') {
        return this.$message.error('必须填写学院名称')
      }
      if (this.isInputNumber !== '') {
        this.updSucessTag().then(() => {
          this.updateHttp()
        })
      } else {
        this.updateHttp()
      }
    },
    updateHttp () {
      console.log(this.$store.state.updateInfo, this.tagList)
      // 先把修改的专业提交修改
      let updateMajor = new Promise(async (resolve, reject) => {
        for (let i in this.tagList) {
          if (this.tagList[i].isUpdate === true) {
            let param = {
              organizationID: this.tagList[i].ID,
              name: this.tagList[i].name
            }
            await this.$post(this.$store.state.api.updateOrganization, param).then((res) => {
              if (res.success === true) {
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          resolve()
        }
      })
      updateMajor.then(() => {
        // 修改学院名
        console.log(this.name, this.$store.state.updateInfo.academyName)
        if (this.name !== this.$store.state.updateInfo.academyName) {
          let param = {
            organizationID: this.$store.state.updateInfo.parentID,
            name: this.name
          }
          this.$post(this.$store.state.api.updateOrganization, param).then((res) => {
            if (res.success === true) {
              this.$message.success(res.msg)
              this.back()
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.back()
        }
      })
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
  padding: 0.5rem 3.4rem;
}
.el-container > p {
  color: #4a4a4a;
  font-size: 0.48rem;
  font-weight: 400;
  margin: 0 0 0.6rem 0;
}
.el-container .type {
  width: 3.3rem;
  height: 0.62rem;
  line-height: 0.62rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: flex-end;
  margin: 0 0 0.4rem 0;
}
.type li:first-child::after {
  content: "";
  border-right: 1px solid #cecece;
  margin: 0 0.2rem;
}
.type li {
  font-size: 0.4rem;
  color: #8c8c8c;
  cursor: pointer;
}
.type li.is-active {
  color: #66a2e4;
}
.pwd {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 0 0.2rem 0;
  min-height: 0.76rem;
  height: auto;
  line-height: 0.76rem;
}
.pwd > span {
  height: 0.76rem;
  line-height: 0.76rem;
  position: relative;
}

.pwd > span::before {
  content: "*";
  color: #d0021b;
  font-size: 0.44rem;
  position: absolute;
  top: 0.05rem;
  left: -0.3rem;
}
.el-input,
.el-radio-group,
.el-select {
  width: 8rem;
  height: 0.76rem;
  line-height: 0.76rem;
  text-align: left;
  display: flex;
  align-items: center;
}
.btn {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.save {
  width: 2rem;
  height: 0.76rem;
  line-height: 0.76rem;
  background: #fff;
  border: 2px solid rgba(102, 162, 228, 1);
  border-radius: 5px;
  color: #66a2e4;
  font-size: 0.4rem;
  margin: 0 0.4rem 0 0;
  cursor: pointer;
}
.cancel {
  width: 2rem;
  height: 0.76rem;
  line-height: 0.76rem;
  background: rgba(102, 162, 228, 1);
  border-radius: 5px;
  color: #fff;
  font-size: 0.4rem;
  cursor: pointer;
}

ul {
  width: 8rem;
  min-height: 1.2rem;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}
li {
  width: 2.32rem;
  height: 0.8rem;
  background: rgba(229, 241, 251, 1);
  border: 1px solid rgba(222, 222, 222, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 0.2rem;
  font-size: 0.32rem;
  font-weight: 400;
  line-height: 0.8rem;
  color: rgba(52, 107, 176, 1);
  margin: 0.18rem 0.34rem 0.28rem 0;
  position: relative;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
li > i {
  width: 0.28rem;
  height: 0.28rem;
  background: url("../../../../assets/image/icon-set-del.png") no-repeat;
  background-size: 100%;
  position: absolute;
  right: -0.15rem;
  top: -0.15rem;
}
li.add {
  border: none;
  border-radius: 0;
  box-shadow: none;
  background: url("../../../../assets/image/image-setting-add.png") no-repeat;
  background-size: 100%;
}
li .el-input {
  width: 1.7rem;
  margin: 0 0.2rem;
  font-size: 0.3rem;
}
/deep/ .el-input__inner {
  font-size: 0.4rem;
}
</style>
