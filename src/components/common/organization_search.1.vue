<template>
  <div>
    <el-cascader
      size="mini"
      :clearable="true"
      :options="organizationList"
      @active-item-change="getOrganizationChildren"
      v-model="selectedOptions"
      :props="props"
      :disabled="disabled"
      @change="handleChange">
    </el-cascader>
  </div>
</template>
<script>
export default {
  props: {
    disabled: Boolean
  },
  data () {
    return {
      organizationList: [],
      selectedOptions: [],
      props: {
        label: 'name',
        value: 'ID',
        children: 'children'
      }
    }
  },
  mounted () {
    this.getOrganizationList()
  },
  methods: {
    getOrganizationList () {
      var params = {
        organizationID: 0,
        type: '学院'.split()
      }
      this.$post(this.$store.state.api.getChildOrganization, params).then((res) => {
        res.data.filter((item) => {
          item.children = []
        })
        this.organizationList = res.data
        console.log(this.organizationList)
      })
    },
    handleChange (value) {
      this.$emit('sendOrganizationValue', this.selectedOptions)
    },
    getOrganizationChildren (value) {
      let parentId
      if (value.length === 1) {
        // 如果点击的是一级分类
        parentId = value[0]
        this.organizationList.map((item, index) => {
          if (item.ID === parentId && item.children.length === 0) {
            // 当顶级分类的的children为空时才请求数据
            let type = []
            type.push('专业')
            var params = {
              organizationID: value[0],
              type: type
            }
            this.$post(this.$store.state.api.getChildOrganization, params).then((res) => {
              if (res.data.length > 0) {
                res.data.filter((item) => {
                  item.children = []
                })
                this.$set(this.organizationList[index], 'children', res.data)
              } else {
                this.$delete(this.organizationList[index], 'children')
              }
              console.log(this.organizationList)
            })
          } else if (item.children !== undefined && item.children.length > 0) {
            // 收起面板，将选中的赋值
            console.log(item)
          }
        })
      } else {
        // 如果点击的是二级分类，则直接将三级分类绑定到organizationList
        parentId = value[1]
        this.organizationList.map((item, index) => {
          item.children.map((innerItem, innerIndex) => {
            if (innerItem.ID === parentId && innerItem.children.length === 0) {
              // 当二级分类的的child为空时才请求一次数据
              let type = []
              type.push('班级')
              var params = {
                organizationID: value[1],
                type: type
              }
              this.$post(this.$store.state.api.getChildOrganization, params).then((res) => {
                if (res.data.length > 0) {
                  this.$set(item.children[innerIndex], 'children', res.data)
                } else {
                  this.$delete(item.children[innerIndex], 'children')
                }
              })
            } else if (innerItem.children !== undefined && innerItem.children.length > 0) {
              console.log(innerItem)
            }
          })
        })
      }
    }
  }
}
</script>
<style scoped>
/deep/ .el-cascader, .el-input__inner{
  width: 5rem;
  height: .76rem;
  line-height: .76rem;
}
</style>
