Module.register("MMM-TextToMirror", {
  defaults: {
    updateInterval: 5 * 60 * 1000,
    serverURL: "http://localhost:3000/message"
  },

  start() {
    this.message = "";
    this.getMessage();
    setInterval(() => this.getMessage(), this.config.updateInterval);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "text-to-mirror";
    wrapper.innerHTML = this.message || "Waiting for message...";
    return wrapper;
  },

  getStyles() {
    return ["MMM-TextToMirror.css"];
  },

  getMessage() {
    this.sendSocketNotification("GET_MESSAGE", this.config.serverURL);
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "MESSAGE") {
      this.message = payload;
      this.updateDom();
    }
  }
});
