<template>
  <div class="page">
    <header>
      <img class="logo" src="../../assets/image/tv-logo.png"/>
      <div class="weather">
        <div class="weather-info-top">
          <img src="../../assets/image/weather.png" alt="" srcset="">
          <span class="temperature">16°</span>
          <span class="cloudy">多云</span>
        </div>
        <div class="weather-info-bottom">
          <span>上海 </span>
          <span>PM2.5   35</span>
          <span>轻度污染</span>
        </div>
      </div>
      <h2>智行校园宿舍管理系统</h2>
      <div class="date">
        <span>2019-07-02</span>
        <span>13:35:33</span>
        <span>星期二</span>
      </div>
    </header>
    <div class="content">
      <div class="left">
        <echartsBox :title="buildingText" style="float: 'right'">
          <ul class="building-box">
            <li class="info-box" v-for="(item, index) in 4" :key="index">
              <p>房间数</p>
              <div class="num">280</div>
            </li>
          </ul>
        </echartsBox>
        <echartsBox :title="passTotalText" style="float: 'right'">
          <div id="passTotalEcharts" :style="{width: '9.6rem', height: '5.6rem'}"></div>
        </echartsBox>
      </div>
      <div class="center">
        <div class="total">
          <div class="total-box" v-for="(item, index) in 5" :key="index">
            <p>今日进</p>
            <div>
              <b class="total-num">3000</b>
              <span>/次</span>
            </div>
          </div>
        </div>
        <div class="person">
          <div class="person-box" v-for="(item, index) in 4" :key="index">
            <div class="person-img-box">
              <img class="person-img" src="../../assets/image/img-person.jpg"/>
              <i class="late">晚归</i>
            </div>
            <ul class="person-info">
              <li>姓&nbsp;&nbsp;&nbsp;&nbsp;名：张婷婷</li>
              <li>宿&nbsp;&nbsp;&nbsp;&nbsp;舍：506</li>
              <li>专&nbsp;&nbsp;&nbsp;&nbsp;业：软件工程</li>
              <li>班&nbsp;&nbsp;&nbsp;&nbsp;级：1902</li>
              <li>时&nbsp;&nbsp;&nbsp;&nbsp;间：9/12 12:33</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right">
        <echartsBox :title="passText" style="float: 'right'">
          <div id="passEcharts" :style="{width: '9.6rem', height: '5.6rem'}"></div>
        </echartsBox>
        <echartsBox :title="checkText" style="float: 'right'">
          <div id="passCheckEcharts" :style="{width: '9.6rem', height: '5.6rem'}"></div>
        </echartsBox>
      </div>
    </div>
    <footer>
      <div class="current-visitor-text">当前访客</div>
      <div class="current-visitor">
        <div class="visitor-box" v-for="(item, index) in 6" :key="index">
          <div class="visitor-img-box">
            <img class="visitor-img" src="../../assets/image/img-person.jpg"/>
          </div>
          <ul class="visitor-info">
            <li>姓&nbsp;&nbsp;&nbsp;&nbsp;名：张婷婷</li>
            <li>受访人：李玉</li>
            <li>宿&nbsp;&nbsp;&nbsp;&nbsp;舍：506</li>
            <li>时&nbsp;&nbsp;&nbsp;&nbsp;间：9/12 12:33</li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import echartsBox from '../common/echarts_box'
export default {
  data () {
    return {
      buildingText: '楼栋基本情况',
      passTotalText: '通行统计',
      passText: '通行人群统计',
      checkText: '考勤统计'
    }
  },
  components: {
    echartsBox
  },
  mounted () {
    this.drawPassEcharts()
    this.drawPassTotalEcharts()
    this.drawPassCheckEcharts()
  },
  beforeDestroy () {
  },
  methods: {
    drawPassEcharts () {
      let myChart = this.$echarts.init(document.getElementById('passEcharts'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        grid: {
          top: '83px',
          left: '22px',
          right: '22px',
          bottom: '34px',
          containLabel: true
        },
        legend: {
          right: '82px',
          orient: 'vertical',
          x: 'right',
          data: ['学生', '访客', '老师', '其它'],
          textStyle: {
            color: '#888CAD',
            fontSize: '.32rem'
          }
        },
        series: [{
          type: 'pie',
          radius: ['50%', '70%'],
          color: ['#24C768', '#FFD900', '#00A1E4', '#FF7E00'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            }
          },
          data: [
            {value: 50, name: '学生'},
            {value: 30, name: '访客'},
            {value: 10, name: '老师'},
            {value: 10, name: '其它'}
          ]
        }]
      })
    },
    drawPassTotalEcharts () {
      let myChart = this.$echarts.init(document.getElementById('passTotalEcharts'))
      // 绘制图表
      myChart.setOption({
        legend: {
          data: ['进', '出'],
          show: true,
          top: '33px',
          right: '29px',
          x: 'right',
          textStyle: {
            color: '#888CAD',
            fontSize: '.32rem'
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, .18)'
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, .18)'
            }
          },
          splitLine: {
            show: false
          }
        },
        grid: {
          top: '79px',
          left: '17px',
          right: '28px',
          bottom: '33px',
          containLabel: true
        },
        series: [{
          name: '进',
          data: [80, 43, 90, 94, 120, 130, 130],
          type: 'line',
          smooth: true,
          color: '#27B2EE'
        }, {
          name: '出',
          data: [80, 93, 99, 134, 90, 130, 120],
          type: 'line',
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#FFC64B'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }])
            }
          },
          smooth: true
        }]
      })
    },
    drawPassCheckEcharts () {
      let myChart = this.$echarts.init(document.getElementById('passCheckEcharts'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '83px',
          left: '22px',
          right: '22px',
          bottom: '34px',
          containLabel: true
        },
        legend: {
          data: ['迟到', '未归'],
          show: true,
          top: '35px',
          textStyle: {
            color: '#888CAD',
            fontSize: '.32rem'
          }
        },
        xAxis: [{
          type: 'category',
          show: true,
          boundaryGap: true,
          data: ['6.12', '6.13', '6.14', '6.15', '6.16', '6.17', '6.18'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, .18)'
            }
          },
          splitLine: {
            show: false
          }
        }],
        yAxis: [{
          type: 'value',
          data: ['6.12', '6.13', '6.14', '6.15', '6.16', '6.17', '6.18'],
          axisLabel: {
            color: '#fff',
            fontSize: 22,
            fontFamily: 'tslfont'
          },
          inverse: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, .18)'
            }
          },
          splitLine: {
            show: true
          }
        }],
        series: [{
          name: '迟到',
          type: 'bar',
          areaStyle: {},
          data: [12, 13, 11, 14, 90, 23, 21],
          color: '#FF7E00'
        }, {
          name: '未归',
          type: 'bar',
          areaStyle: {},
          data: [22, 12, 11, 24, 20, 30, 30],
          color: '#24C768'
        }]
      })
    }
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.page {
  width: 100%;
  background-color: #05213E;
  height: 100%;
  background-image: url(../../assets/image/tv-bj.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 14.92rem 14.68rem;
  padding: .18rem 0 0 0;
}
header{
  width: 100%;
  height: 1.4rem;
  background: url(../../assets/image/tv-title-bj.png) no-repeat;
  background-size: 100%;
  padding: .18rem 0 0 0;
  position: relative;
}
.logo{
  width: 5.52rem;
  height: .9rem;
  position: absolute;
  left: .6rem;
  top: .36rem;
}
.weather{
  width: 4.6rem;
  height: 1.2rem;
  position: absolute;
  left: 7rem;
  color: #2CC0E8;
  top: .16rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.weather-info-top, .weather-info-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.weather-info-top span {
  height: .64rem;
  line-height: .64rem;
}
.temperature{
  font-size: .6rem;
}
.cloudy{
  font-size: .4rem;
}
.weather img {
  width: .76rem;
  height: .64rem;
}
h2 {
  color: #7EDEF7;
  width: 6.8rem;
  height: .9rem;
  font-size: .68rem;
  font-weight: bold;
  line-height: .9rem;
  opacity: 1;
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  margin:auto;
}
.date {
  width: 5.52rem;
  height: .5rem;
  color: #2CC0E8;
  font-size: .36rem;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  right: .6rem;
  top: .6rem;
}
.content{
  margin: 1rem .64rem 0 .64rem;
  height: 14.3rem;
  display: flex;
  flex-direction: row;
}
.left, .right{
  width: 9.6rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.building-box {
  width: 100%;
  height: 100%;
  padding: .62rem 1.24rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
}
.info-box {
  width: 2.94rem;
  height: 1.9rem;
}
.info-box p{
  font-size: .32rem;
  font-weight: 400;
  margin: 0 0 .14rem 0;
  color: #fff;
}
.num {
  width: 2.94rem;
  height: 1.32rem;
  border: 1px solid rgba(27,150,255,1);
  border-radius: .2rem;
  font-size: .48rem;
  line-height: 1.32rem;
  color: #24C768;
}
.right{
  float: right;
}
.center {
  width: 18rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.12rem .64rem 0 .64rem;
}
.total {
  width: 16.64rem;
  height: 2.24rem;
  color: #00FFFF;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.total-box {
  width: 2.96rem;
  height: 2.24rem;
  background: url(../../assets/image/tv-total-border.png) no-repeat;
  background-size: 100%;
  padding: .44rem .2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.total-box p{
  width: 100%;
  height: .48rem;
  font-size: .34rem;
  font-weight: 400;
  color: rgba(0,255,255,1);
  opacity: 0.58;
}
.total-num {
  font-size: .58rem;
}
.person {
  width: 16.64rem;
  height: 9.14rem;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
}
.person-box {
  width: 6.82rem;
  height: 9.12rem;
  margin: 0 .6rem 0 0;
  padding: .6rem;
  border-radius: .2rem;
  background: rgba(134,199,254,0.05);
  border: 1px solid rgba(27,150,255,1);
  color: #7EDEF7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.person-img-box {
  width: 5.64rem;
  height: 5.64rem;
  position: relative;
}
.person-img {
  width: 100%;
  height: 100%;
}
.late {
  width: 1rem;
  height: .48rem;
  line-height: .48rem;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #00A1E4;
  color: #000;
}
.person-info {
  height: 1.76rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
/* 单行 */
.person-info li {
  text-align: left;
  height: .4rem;
  line-height: .4rem;
}
.person-info li:nth-child(odd){
  width: 60%;
}
/* 双行 */
.person-info li:nth-child(even){
  width: 40%;
}
footer{
  display: flex;
  width: 100%;
  height: 4.76rem;
  padding: .68rem .64rem;
  position: fixed;
  bottom: 0;
  left: 0;
}
.current-visitor-text{
  writing-mode: vertical-lr;
  width: 1.22rem;
  height: 2.84rem;
  font-size: .5rem;
  font-weight: 400;
  line-height: .72rem;
  color: rgba(44,192,232,1);
  opacity: 0.66;
  letter-spacing: .15rem;
  margin: .2rem 0 0 0;
}
.current-visitor{
  color: #66B7CD;
  width: 35.9rem;
  height: 3.4rem;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
}
.visitor-box{
  border: 1px solid rgba(112,112,112,1);
  margin: 0 .56rem 0 0;
  border-radius: .2rem;
  width: 6.04rem;
  height: 3.4rem;
  margin: 0 .56rem 0 0;
  padding: .4rem;
  background: rgba(134,199,254,0.05);
  color: #7EDEF7;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.visitor-img-box {
  background: url(../../assets/image/tv-perser-border.png) no-repeat;
  background-size: 100%;
  width: 2.04rem;
  height: 2.58rem;
  padding: 1px;
}
.visitor-img {
  width: 1.93rem;
  height: 2.45rem;
}
.visitor-info {
  width: 3.04rem;
  height: 2.56rem;
  margin: 0 0 0 .24rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.visitor-info li{
  text-align: left;
}
</style>
