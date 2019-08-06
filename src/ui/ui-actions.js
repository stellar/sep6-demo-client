const Renderjson = require("renderjson");
Renderjson.set_show_to_level(1);

const $ = id => document.getElementById(id);

const container = $("container");
const actionText = $("action-text");
const actionButton = $("action-button");
const configButton = $("config-button");
const configPanel = $("config-panel");
const deviceFrame = $("device-frame");

configButton.addEventListener("click", () => {
  configPanel.classList.toggle("visible");
});
configPanel.querySelector("#close-button").addEventListener("click", () => {
  configPanel.classList.toggle("visible");
});

const showConfig = () => {
  configPanel.classList.add("visible");
};

const addEntry = (message, className) => {
  const div = document.createElement("div");
  div.textContent = message;
  div.className = className;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
};

const setAction = action => {
  actionText.textContent = action || "Continue";
};

const addInstruction = instruction => addEntry(instruction, "instruction");
const addLog = message => {
  if (typeof message === "object") {
    container.appendChild(Renderjson(message));
    return;
  }
  addEntry(message, "log");
};

const setLoading = (loading, loadingMessage) => {
  if (loading) {
    actionButton.textContent = loadingMessage || "Loading...";
    actionButton.disabled = true;
  } else {
    actionButton.textContent = "Continue";
    actionButton.disabled = false;
  }
};

const setDevicePage = src => {
  deviceFrame.src = src;
};

const waitForPageContinue = src => {
  return new Promise((resolve, reject) => {
    deviceFrame.src = src;
    const cb = function(e) {
      if (e.data.continue) {
        window.removeEventListener("message", cb);
        resolve();
      }
    };
    window.addEventListener("message", cb);
  });
};

const error = message => {
  addEntry(message, "error");
};

module.exports = {
  addEntry,
  setAction,
  instruction: addInstruction,
  log: addLog,
  actionButton,
  container,
  actionText,
  setLoading,
  error,
  showConfig,
  setDevicePage,
  waitForPageContinue
};
