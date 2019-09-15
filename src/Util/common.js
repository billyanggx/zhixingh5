import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Store from '../store/store.js'
import {post} from './Server'
Vue.use(ElementUI)
// 返回日期（年月日）
let app = new Vue()
export const getDay = function (number) {
  var temp = new Date(new Date() - number)
  let mon = (temp.getMonth() + 1) < 10 ? '0' + (temp.getMonth() + 1) : (temp.getMonth() + 1)
  let day = temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate()
  var today = temp.getFullYear() + '-' + mon + '-' + day
  return today
}
// 返回日期（时分秒）
export const getTime = function () {
  var temp = new Date()
  var hour = temp.getHours() < 10 ? '0' + temp.getHours() : temp.getHours()
  var min = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
  var sed = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
  var time = hour + ':' + min + ':' + sed
  return time
}

// 格式化后台返回时间
export const myTimeToLocal = function (inputTime) {
  if (!inputTime && typeof inputTime !== 'number') {
    return ''
  }
  if (inputTime.indexOf('Z') === -1 && inputTime.indexOf('T') === -1) {
    return inputTime
  }
  let localTime = ''
  inputTime = new Date(inputTime).getTime()
  let offset = (new Date()).getTimezoneOffset()
  localTime = (new Date(inputTime - offset * 60000)).toISOString()
  if (localTime.indexOf('Z') !== -1) {
    localTime = localTime.substr(0, localTime.lastIndexOf('.'))
  }
  if (localTime.indexOf('T') !== -1) {
    localTime = localTime.replace('T', ' ')
  }

  return localTime
}

// 调超脑
export const downLoadFaceToSuperBrain = function (config) {
  // let params = {
  //   peopleID: peopleID,
  //   name: this.form.name,
  //   identityID: this.form.idCardNo,
  //   pictureType: this.src ? this.src.split('.')[1] : this.srcSec.split('.')[1],
  //   picture: this.src || this.srcSec,
  //   dbName: 'OpenDoor',
  //   operationType: 'add'
  // }
  // params = Object.assign(params, config)
  post(Store.state.api['downLoadFaceToSuperBrain'], config).then((data) => {
    if (!data.success) {
      app.$message.error(data.msg)
      return false
    }
  })
}
