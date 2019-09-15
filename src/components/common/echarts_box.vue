<template>
<div class="echarts">
  <p>{{title}}</p>
  <div class="echarts-box">
    <slot></slot>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    title: ''
  },
  watch: {
    title () {
      console.log(this.title)
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
  }
}
</script>
<style scoped>
.echarts {
  width: 9.6rem;
  height: 6.74rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
p {
  color: #2CC0E8;
  font-size: .5rem;
  text-align: left;
  opacity: .6;
}
.echarts-box{
  width: 9.6rem;
  height: 5.6rem;
  background: rgba(134,199,254,0.05);
  border: 1px solid rgba(26,149,254,1);
  opacity: 1;
  border-radius: .2rem;
  color: #888CAD;
  box-sizing: border-box;
}
</style>
