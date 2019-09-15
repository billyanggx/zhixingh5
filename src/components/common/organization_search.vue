<template>
  <div>
    <el-cascader
      size="mini"
      :clearable="true"
      :options="organizationList"
      v-model="selectedOptions"
      change-on-select
      :props="props"
      :disabled="disabled"
      :defaultShow='defaultShow'
      @change="handleChange">
    </el-cascader>
  </div>
</template>
<script>
export default {
  props: {
    disabled: Boolean,
    defaultShow: {
      type: Array,
      default: null
    }
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
  watch: {
    defaultShow: {
      handler (newValue, oldValue) {
        if (newValue && newValue.length > 0) {
          this.selectedOptions = newValue
          if (newValue && newValue.length > 0) {
            this.$emit('sendOrganizationValue', newValue.slice(-1)[0].split())
          } else {
            this.$emit('sendOrganizationValue', [])
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    // if (this.defaultShow && this.defaultShow.length > 0) {
    //   this.selectedOptions = this.defaultShow
    //   this.$emit('sendOrganizationValue', this.defaultShow.slice(-1)[0])
    // }
    this.getOrganizationList()
  },
  methods: {
    getOrganizationList () {
      var params = {
        id: 0
      }
      this.$post(this.$store.state.api.getAllChildOrganization, params).then((res) => {
        this.organizationList.push(res.data)
      })
    },
    handleChange (value) {
      if (value && value.length > 0) {
        this.$emit('sendOrganizationValue', value.slice(-1)[0].split())
      } else {
        this.$emit('sendOrganizationValue', [])
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
