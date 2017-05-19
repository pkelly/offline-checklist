var connectionTestInterval;

function checkConnection() {
  var connectionStatusElement = document.getElementById('connection-status');
  if(navigator.onLine) {
    connectionStatusElement.classList.remove('status-disconnected');
    connectionStatusElement.classList.add('status-connected');
    connectionStatusElement.innerText = 'Status: Online';
  }
  else {
    connectionStatusElement.classList.remove('status-connected');
    connectionStatusElement.classList.add('status-disconnected');
    connectionStatusElement.innerText = 'Status: Disconnected';
  }
}

function InitiateSpeedDetection() {
  connectionTestInterval = setInterval(checkConnection, 2000);
};    

window.addEventListener('load', InitiateSpeedDetection, false);
