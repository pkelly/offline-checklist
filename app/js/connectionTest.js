var connectionTestInterval;

function checkConnection() {
  if(!navigator.onLine) {
    alert('Connection has been lost.')
    clearInterval(connectionTestInterval);
  }
}

function InitiateSpeedDetection() {
  connectionTestInterval = setInterval(checkConnection, 1000);
};    

window.addEventListener('load', InitiateSpeedDetection, false);
