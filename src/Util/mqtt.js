let mqtt = require('mqtt')
let client = {}
export default {
  launch (id, callback) {
    client = mqtt(window.localStorage.getItem('mqttUrl'), {
      port: 3000,
      clientId: id,
      clean: false
    })
    client.on('message', (topic, message) => {
      callback(topic, message)
    })
    client.subscribe('/school/access/log', {
      qos: 1
    })
  },
  end () {
    client.end()
  }
}
