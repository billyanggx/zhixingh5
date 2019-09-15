<template>
 <el-dialog :visible.sync="dialogVisible" width="60%" top="3vh" @close="closeDialog" :close-on-click-modal="false">
 <div slot="title" class="titleBox clearfix">
   <span class="first">人脸抓拍</span>
   <span class="sec" v-if="sign == '1'">请进行人脸拍照</span>
   <span class="sec" v-else>拍摄时,请摘眼镜</span>
 </div>
 <!-- 拍照区域 -->
 <div style="width:100%;height:12rem;">
   <video id="v" style="width: 100%;height: 100%;object-fit: fill;" ref="video"></video>
    <canvas id="canvas" style="display:none;"></canvas>
 </div>
 <div slot="footer" class="footerBox">
   <img src="../../../assets/image/sendPhoto.png" alt="" @click="getPhoto">
 </div>
</el-dialog>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {
      dialogVisible: false,
      mediaStreamTrack: null,
      videoPlaying: null,
      src: '',
      srcSec: '',
      v: null,
      sign: ''
    }
  },

  components: {},

  computed: {
  },

  mounted () {
    this.$bus.on('setPhoto', (val) => {
      this.dialogVisible = val.dialogVisible
      this.sign = val.sign
      this.$nextTick(function () {
        this.setPhoto()
      })
    })
  },

  methods: {
    setPhoto (str) {
      let _this = this
      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in _this browser'))
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      const constraints = {
        video: true,
        audio: false
      }
      _this.videoPlaying = false
      _this.v = document.getElementById('v')
      // _this.v = this.$refs.video

      let promise = navigator.mediaDevices.getUserMedia(constraints)
      promise.then(stream => {
        // 旧的浏览器可能没有srcObject
        _this.mediaStreamTrack = stream
        if ('srcObject' in _this.v) {
          _this.v.srcObject = stream
        } else {
          // 防止再新的浏览器里使用它，应为它已经不再支持了
          _this.v.src = window.URL.createObjectURL(stream)
        }
        _this.v.onloadedmetadata = function (e) {
          _this.v.play()
          _this.videoPlaying = true
        }
      }).catch(err => {
        console.error(err.name + ': ' + err.message)
      })
    },
    getPhoto () {
      let _this = this
      if (_this.videoPlaying) {
        let canvas = document.getElementById('canvas')
        canvas.width = _this.v.videoWidth
        canvas.height = _this.v.videoHeight
        canvas.getContext('2d').drawImage(_this.v, 0, 0)
        let data = canvas.toDataURL('image/jpeg')
        // document.getElementById('photo').setAttribute('src', data)
        this.upLoadImg(data, this.sign)
        this.closeDialog()
        this.dialogVisible = false
      }
    },
    closeDialog () {
      this.mediaStreamTrack.getTracks()[0].stop()
      this.dialogVisible = false
    },
    // 上传图片
    upLoadImg (data, sign) {
      this.$post(this.$store.state.api['uploadBase64Image'], {data: data}).then((data) => {
        if (data.success) {
          let dataUrl = data.data
          console.log(dataUrl)
          if (sign === '1') {
            this.$emit('sendSrc', dataUrl)
          } else {
            this.$emit('sendSrcSec', dataUrl)
          }
        } else {
          this.$message.error('上传图片失败')
        }
      })
    }
  }
}

</script>
<style scoped>
.titleBox, .footerBox{
  background: #333;
  text-align: center;
}
.titleBox .first{
  color:#fff;
  font-size: 0.5rem;
  font-weight: 800;
  display: inline-block;
  line-height: 1rem;
  float:left;
  margin-left: .2rem;
}
.titleBox .sec{
  color:#F06F6F;
  font-size: 0.6rem;
  font-weight: 800;
  display: inline-block;
  line-height: 1rem;
}
/deep/ .el-dialog__header  {
  padding:0;
  height: 1rem;
}
/deep/ .el-dialog__footer{
  padding:0;
  height: 1.5rem;
  background: #333;
}
/deep/ .el-dialog__body{
  padding:0;
}
/deep/ .el-dialog__headerbtn {
  top: 10px!important;
}
</style>
