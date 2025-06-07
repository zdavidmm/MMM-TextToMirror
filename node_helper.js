const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start() {
    console.log("MMM-TextToMirror helper started");
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_MESSAGE") {
      fetch(payload)
        .then(res => res.json())
        .then(json => {
          this.sendSocketNotification("MESSAGE", json.text || "");
        })
        .catch(err => console.error("MMM-TextToMirror error", err));
    }
  }
});
