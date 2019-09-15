<template>
  <el-select v-model="buildingValue" filterable placeholder="请选择" size="mini" @change="changeBuilding">
    <el-option
        v-for="item in buildingList"
        :key="item.ID"
        :label="item.name"
        :value="item.ID">
    </el-option>
  </el-select>
</template>
<script>
export default {
  data () {
    return {
      buildingValue: '',
      buildingList: []
    }
  },
  mounted () {
    this.buildingValue = localStorage.getItem('userLocationID')
    this.getLocation()
  },
  methods: {
    getLocation () {
      let params = {
        locationID: '',
        type: '楼栋'.split()
      }
      this.$post(this.$store.state.api['getChildLocation'], params).then(data => {
        this.buildingList = data.data || []
        if (this.buildingList.length !== 0 && localStorage.getItem('userLocationID') === '') {
          this.buildingValue = localStorage.getItem('userLocationID') === '' ? this.buildingList[0].ID : localStorage.getItem('userLocationID')
          this.changeBuilding()
        }
      })
    },
    changeBuilding () {
      localStorage.setItem('userLocationID', this.buildingValue)
      this.$emit('sendLocationValue', this.buildingValue)
    }
  }
}
</script>
<style scoped>
/deep/ .el-select{
  width: 5.6rem;
  height: .76rem;
}
</style>
