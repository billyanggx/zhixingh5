<template>
  <div class="page">
    <ul @click="updSucessTag">
      <li v-for="(item, index) in tagList" :key="index">
        <i @click="delTag(index, item)"></i>
        <el-tooltip content="单击修改文字" placement="top" :open-delay=300>
          <el-input placeholder="请输入" v-if="isInputNumber === index" autofocus="autofocus" @click.native="updTag" v-model="currentTag">
          </el-input>
          <span @click="updateTag(index, item.ID)" v-else>{{item.name}}</span>
        </el-tooltip>
      </li>
      <li class="add" @click="addTag"></li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentTag: '',
      tagList: [],
      isInputNumber: '',
      currentType: '' // 当前状态是修改还是添加
    }
  },
  mounted () {
    this.getList()
    // 监听enter键
    var that = this
    document.onkeydown = function (e) {
      var keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 13) {
        that.updSucessTag()
      }
    }
  },
  methods: {
    getList () {
      this.$post(this.$store.state.api.tagList, {}).then((res) => {
        this.tagList = res.data
      })
    },
    delTag (index, item) {
      event.stopPropagation()
      console.log(typeof this.isInputNumber, this.currentTag)
      if (typeof this.isInputNumber === 'number') {
        this.isInputNumber = ''
        this.tagList.splice(index, 1)
      } else {
        this.$confirm('确认要删除该选项吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isInputNumber = ''
          this.$post(this.$store.state.api.deleteAllTag, {ID: item.ID}).then((res) => {
            if (res.success === true) {
              this.$message.success(res.msg)
              this.tagList.splice(index, 1)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 点击文字
    updateTag (index, ID) {
      event.stopPropagation()
      this.isInputNumber = index
      this.currentTag = this.tagList[index] === '' ? '' : this.tagList[index].name
      this.currentType = ID
    },
    updTag () {
      event.stopPropagation()
    },
    addTag () {
      event.stopPropagation()
      if (typeof this.isInputNumber === 'number' && this.currentTag === '') {
        return this.$message.error('内容不能为空！')
      } else {
        this.updSucessTag()
        var item = {
          name: '',
          type: '"stranger"'
        }
        this.tagList.push(item)
        this.updateTag(this.tagList.length - 1)
      }
    },
    updSucessTag () {
      var temp = this.tagList[this.isInputNumber]
      if (typeof this.isInputNumber === 'number' && this.currentTag === '') {
        return this.$message.error('内容不能为空！')
      }
      if (this.isInputNumber !== '') {
        temp.name = this.currentTag
        this.tagList.splice(this.isInputNumber, 1, temp)
        var params = {
          type: 'stranger',
          name: this.currentTag
        }
        if (this.currentType === undefined) {
          this.$post(this.$store.state.api.addAllTag, params).then((res) => {
            if (res.success === true) {
              this.$message.success(res.msg)
              this.isInputNumber = ''
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          params.ID = this.currentType
          this.$post(this.$store.state.api.updAllTag, params).then((res) => {
            if (res.success === true) {
              this.$message.success(res.msg)
              this.isInputNumber = ''
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
    }
  }

}
</script>
<style scoped>
.page {
  width: 100%;
  height: auto;
  min-height: 100%;
  background-color: #fff;
  display: flex;
  flex: 1;
}
ul {
  padding: 0.7rem 0 0 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}
li {
  width: 5.04rem;
  height: 1.76rem;
  background: rgba(229, 241, 251, 1);
  border: 1px solid rgba(222, 222, 222, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 0.2rem;
  font-size: 0.6rem;
  font-weight: 400;
  line-height: 1.76rem;
  color: rgba(52, 107, 176, 1);
  margin: 0 0.74rem 1.3rem 0.52rem;
  position: relative;
  cursor: pointer;
}
li > i {
  width: 0.6rem;
  height: 0.6rem;
  background: url("../../../assets/image/icon-set-del.png") no-repeat;
  background-size: 100%;
  position: absolute;
  right: -0.3rem;
  top: -0.3rem;
}
li.add {
  border: none;
  border-radius: 0;
  box-shadow: none;
  background: url("../../../assets/image/image-setting-add.png") no-repeat;
  background-size: 100%;
}
.el-input {
  width: 3.4rem;
}
/deep/ .el-input__inner {
  font-size: 0.4rem;
}
</style>
