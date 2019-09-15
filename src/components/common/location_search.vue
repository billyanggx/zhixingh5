<template>
  <div>
    <el-cascader
      size="mini"
      :clearable="true"
      :options="organizationList"
      v-model="selectedOptions"
      change-on-select
      filterable
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
          this.$emit('sendLocationValue', newValue.slice(-1)[0])
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    // if (this.defaultShow && this.defaultShow.length > 0) {
    //   this.selectedOptions = this.defaultShow
    //   this.$emit('sendLocationValue', this.defaultShow.slice(-1)[0])
    // }
    this.getOrganizationList()
  },
  methods: {
    getOrganizationList () {
      var params = {
        id: 0
      }
      this.$post(this.$store.state.api.getAllChildLocation, params).then((res) => {
        this.organizationList.push(res.data)
      })
    },
    handleChange (value) {
      if (value.length !== undefined) {
        this.$emit('sendLocationValue', value.slice(-1)[0])
      } else {
        this.$emit('sendLocationValue', '')
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
