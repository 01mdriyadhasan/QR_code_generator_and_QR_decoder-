// decoder.mi.js — Production-ready (Camera toggle + Upload & Scan)

const html5QrCode = new Html5Qrcode("reader");

const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");
const copyBtn = document.getElementById("copyBtn");
const toggleCameraBtn = document.getElementById("toggle-camera-btn");
const fileInput = document.getElementById("qr-file");

let lastResult = "";
let cameraRunning = false;
let scanningFile = false;

const cameraConfig = { facingMode: "environment" };
const scanConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

/* ================= WiFi QR Parse ================= */
function parseWiFiString(str) {
  if (!str || !str.startsWith("WIFI:")) return null;

  str = str.replace(/;+$/, '');
  const parts = {};
  str.slice(5).split(';').forEach(f => {
    if (!f) return;
    const [k, ...v] = f.split(':');
    parts[k] = v.join(':').replace(/\\(.)/g, '$1');
  });

  return {
    type: parts.T || 'Unknown',
    ssid: parts.S || '',
    password: parts.P || '',
    hidden: parts.H === 'true'
  };
}

/* ================= UI Render ================= */
function displayResult(decodedText) {
  lastResult = decodedText;

  const wifi = parseWiFiString(decodedText);
  resultDiv.innerHTML = wifi
    ? `
      <div class="wifi-info"><b>WiFi Data</b></div>
      <div>SSID: <span>${wifi.ssid || 'N/A'}</span></div>
      <div>Password: <span>${wifi.password || 'None'}</span></div>
      <div>Type: <span>${wifi.type}</span></div>
      <div>Hidden: <span>${wifi.hidden ? 'Yes' : 'No'}</span></div>
      <br><small>Raw: ${decodedText}</small>
    `
    : `<b>Decoded:</b><br>${decodedText}`;

  copyBtn.style.display = "inline-block";
  statusDiv.textContent = "QR read successfully✓";
}

/* ================= Scan Callbacks ================= */
function onScanSuccess(text) {
  if (text !== lastResult) displayResult(text);
}
function onScanFailure(_) {}

/* ================= Camera Control ================= */
function startCamera() {
  if (cameraRunning) return;

  statusDiv.textContent = "Camera stating....Allow Please.";

  html5QrCode.start(cameraConfig, scanConfig, onScanSuccess, onScanFailure)
    .then(() => {
      cameraRunning = true;
      toggleCameraBtn.textContent = "Turn Camera Off";
      statusDiv.textContent = "Camera is running";
    })
    .catch(err => {
      cameraRunning = false;
      toggleCameraBtn.textContent = "Turn Camera On";
      statusDiv.textContent = "Camera can not opening";
      console.error(err);
    });
}

function stopCamera() {
  if (!cameraRunning) return;

  html5QrCode.stop().then(() => {
    cameraRunning = false;
    toggleCameraBtn.textContent = "Turn Camera On";
    statusDiv.textContent = "Camera turned off";
  });
}

function toggleCamera() {
  cameraRunning ? stopCamera() : startCamera();
}

/* ================= Upload & Scan ================= */
function uploadAndScan() {
  if (scanningFile) return;

  const file = fileInput.files[0];
  if (!file) {
    alert("Select a picture");
    return;
  }

  scanningFile = true;
  const resumeCamera = cameraRunning;

  const run = () => {
    html5QrCode.scanFile(file, true)
      .then(text => displayResult(text))
      .catch(() => resultDiv.innerHTML = "QR not found on this image 😕")
      .finally(() => {
        scanningFile = false;
        if (resumeCamera) startCamera();
      });
  };

  cameraRunning ? html5QrCode.stop().then(run) : run();
}

/* ================= Copy ================= */
copyBtn.onclick = () => {
  if (!lastResult) return;
  navigator.clipboard.writeText(lastResult).then(() => {
    copyBtn.textContent = "Copied ✓";
    setTimeout(() => copyBtn.textContent = "Copy text", 2000);
  });
};

/* ================= Menu ================= */
function toggleMenu() {
  document.getElementById("menu")?.classList.toggle("active");
        }
