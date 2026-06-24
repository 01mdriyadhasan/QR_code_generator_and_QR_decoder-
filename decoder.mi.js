// Decoder Configuration
const html5QrCode = new Html5Qrcode('reader');
const resultDiv = document.getElementById('result');
const statusDiv = document.getElementById('status');
const copyBtn = document.getElementById('copyBtn');
const toggleCameraBtn = document.getElementById('toggle-camera-btn');
const fileInput = document.getElementById('qr-file');

let lastResult = '';
let cameraRunning = false;
let scanningFile = false;

const cameraConfig = { facingMode: 'environment' };
const scanConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// Parse WiFi QR strings
function parseWiFiString(str) {
  if (!str || !str.startsWith('WIFI:')) return null;
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

// Display decoded result
function displayResult(decodedText) {
  lastResult = decodedText;
  const wifi = parseWiFiString(decodedText);
  
  if (resultDiv) {
    resultDiv.innerHTML = wifi
      ? `<div class="wifi-info"><b>WiFi Data</b></div>
         <div>SSID: <span>${wifi.ssid || 'N/A'}</span></div>
         <div>Password: <span>${wifi.password || 'None'}</span></div>
         <div>Type: <span>${wifi.type}</span></div>
         <div>Hidden: <span>${wifi.hidden ? 'Yes' : 'No'}</span></div>
         <br><small>Raw: ${decodedText}</small>`
      : `<b>Decoded:</b><br>${decodedText}`;
  }
  
  if (copyBtn) copyBtn.style.display = 'inline-block';
  if (statusDiv) statusDiv.textContent = 'QR read successfully ✓';
}

// Scan callbacks
function onScanSuccess(text) {
  if (text !== lastResult) {
    displayResult(text);
  }
}

function onScanFailure(error) {
  // Silent fail - continue scanning
}

// Start camera
function startCamera() {
  if (cameraRunning) return;
  if (statusDiv) statusDiv.textContent = 'Camera starting... Please allow access.';

  html5QrCode.start(cameraConfig, scanConfig, onScanSuccess, onScanFailure)
    .then(() => {
      cameraRunning = true;
      if (toggleCameraBtn) toggleCameraBtn.textContent = 'Turn Camera Off';
      if (statusDiv) statusDiv.textContent = 'Camera is running';
    })
    .catch(err => {
      cameraRunning = false;
      if (toggleCameraBtn) toggleCameraBtn.textContent = 'Turn Camera On';
      if (statusDiv) statusDiv.textContent = 'Camera cannot be opened';
      console.error('Camera error:', err);
    });
}

// Stop camera
function stopCamera() {
  if (!cameraRunning) return;
  html5QrCode.stop().then(() => {
    cameraRunning = false;
    if (toggleCameraBtn) toggleCameraBtn.textContent = 'Turn Camera On';
    if (statusDiv) statusDiv.textContent = 'Camera turned off';
  });
}

// Toggle camera
function toggleCamera() {
  cameraRunning ? stopCamera() : startCamera();
}

// Upload and scan file
function uploadAndScan() {
  if (scanningFile) return;
  const file = fileInput ? fileInput.files[0] : null;
  
  if (!file) {
    alert('Please select an image file');
    return;
  }

  scanningFile = true;
  const resumeCamera = cameraRunning;

  const run = () => {
    html5QrCode.scanFile(file, true)
      .then(text => displayResult(text))
      .catch(() => {
        if (resultDiv) resultDiv.innerHTML = 'QR code not found in this image 😕';
      })
      .finally(() => {
        scanningFile = false;
        if (resumeCamera) startCamera();
      });
  };

  cameraRunning ? html5QrCode.stop().then(run) : run();
}

// Copy text
if (copyBtn) {
  copyBtn.onclick = () => {
    if (!lastResult) return;
    navigator.clipboard.writeText(lastResult).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  };
}

// Toggle menu
function toggleMenu() {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

// Start camera on page load
window.addEventListener('load', () => {
  setTimeout(() => {
    startCamera();
  }, 500);
});