<template>
  <div></div>
</template>

<script>
// import mqtt from '@/assets/js/mqtt'
export default {
  data () {
    return {
      // ws://47.75.190.168:3000
      // client: new Paho.MQTT.Client('ws://47.75.190.168:3000', 3000, ''), // 第三个参数是clientID可以为空
      topic: 'mqtt' // 订阅的主题
    }
  },

  components: {},

  computed: {},

  mounted () {
    this.client.connect({onSuccess: this.onConnect}) // 连接服务器并注册连接成功处理事件
    this.client.onConnectionLost = this.onConnectionLost // 注册连接断开处理事件
    this.client.onMessageArrived = this.onMessageArrived // 注册消息接收处理事件
  },

  methods: {
    onConnectionLost: function (responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
        console.log('连接已断开')
      }
    },
    onMessageArrived: function (message) {
      console.log('收到消息:' + message.payloadString)
    },
    onConnect: function () {
      console.log('onConnected')
      this.client.subscribe(this.topic) // 订阅主题
    }
  }
}

</script>
