// decoder.mi.js - camera toggle এবং upload-and-scan সহ

const html5QrCode = new Html5Qrcode("reader");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");
const copyBtn = document.getElementById("copyBtn");
const toggleCameraBtn = document.getElementById("toggle-camera-btn");
const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("qr-file");
let lastResult = "";
let cameraRunning = false;
let currentCameraConfig = { facingMode: "environment" };
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

// WiFi string parse + escape handle function
function parseWiFiString(str) {
    if (!str || !str.startsWith("WIFI:")) return null;
    str = str.replace(/;+$/, '');
    const parts = {};
    const fields = str.slice(5).split(';');
    fields.forEach(field => {
        if (!field) return;
        const [key, ...valueParts] = field.split(':');
        let value = valueParts.join(':');
        value = value.replace(/\\(.)/g, '$1');
        parts[key] = value;
    });
    return {
        type: parts.T || 'Unknown',
        ssid: parts.S || '',
        password: parts.P || '',
        hidden: parts.H === 'true'
    };
}

function displayResult(decodedText) {
    let displayHTML = `<strong>ডিকোড হয়েছে:</strong><br>${decodedText}`;
    const wifiData = parseWiFiString(decodedText);
    if (wifiData) {
        displayHTML = `
            <div class="wifi-info">WiFi নেটওয়ার্ক তথ্য:</div>
            <div class="wifi-info">নেটওয়ার্ক নাম (SSID): <span>${wifiData.ssid || 'N/A'}</span></div>
            <div class="wifi-info">পাসওয়ার্ড: <span>${wifiData.password || 'কোনো পাসওয়ার্ড নেই'}</span></div>
            <div class="wifi-info">টাইপ: <span>${wifiData.type}</span></div>
            <div class="wifi-info">হিডেন: <span>${wifiData.hidden ? 'হ্যাঁ' : 'না'}</span></div>
            <br><small>Raw: ${decodedText}</small>
        `;
    }
    resultDiv.innerHTML = displayHTML;
    if (copyBtn) copyBtn.style.display = "inline-block";
    statusDiv.textContent = "সফল! QR পড়া হয়েছে ✓";
    lastResult = decodedText;
}

function onScanSuccess(decodedText /*, decodedResult */) {
    if (decodedText !== lastResult) {
        displayResult(decodedText);
    }
}
function onScanFailure(error) {
    // optional logging: console.debug('QR scan failed:', error);
}

function startCamera() {
    if (cameraRunning) return Promise.resolve();
    statusDiv.textContent = 'Camera opening......';
    return html5QrCode.start(
        currentCameraConfig,
        config,
        onScanSuccess,
        onScanFailure
    ).then(() => {
        cameraRunning = true;
        if (toggleCameraBtn) toggleCameraBtn.textContent = 'Turn Camera Off';
        statusDiv.textContent = 'Camera is running';
    }).catch(err => {
        cameraRunning = false;
        statusDiv.textContent = 'ক্যামেরা অ্যাক্সেস করতে সমস্যা: ' + err;
        statusDiv.style.color = '#ff4444';
        if (toggleCameraBtn) toggleCameraBtn.textContent = 'Turn Camera On';
    });
}

function stopCamera() {
    if (!cameraRunning) return Promise.resolve();
    return html5QrCode.stop().then(() => {
        cameraRunning = false;
        if (toggleCameraBtn) toggleCameraBtn.textContent = 'Turn Camera On';
        statusDiv.textContent = 'Camera stopped';
    }).catch(err => {
        statusDiv.textContent = 'Camera stop error: ' + err;
    });
}

function toggleCamera() {
    if (cameraRunning) {
        stopCamera();
    } else {
        startCamera();
    }
}

function uploadAndScan() {
    const files = fileInput.files;
    if (!files || !files[0]) {
        alert('অনুগ্রহ করে একটি ফাইল নির্বাচন করুন।');
        return;
    }
    const file = files[0];
    const wasRunning = cameraRunning;

    const runScan = () => {
        html5QrCode.scanFile(file, true)
            .then(decodedText => {
                displayResult(decodedText);
                if (wasRunning) startCamera();
            })
            .catch(() => {
                resultDiv.innerHTML = 'এই ছবিতে QR কোড পাওয়া যায়নি 😕';
                if (wasRunning) startCamera();
            });
    };

    if (cameraRunning) {
        html5QrCode.stop().then(() => {
            cameraRunning = false;
            if (toggleCameraBtn) toggleCameraBtn.textContent = 'Turn Camera On';
            runScan();
        }).catch(() => {
            runScan();
        });
    } else {
        runScan();
    }
}

// copy button
if (copyBtn) {
    copyBtn.onclick = () => {
        if (!lastResult) return;
        navigator.clipboard.writeText(lastResult)
            .then(() => {
                copyBtn.textContent = 'কপি হয়েছে! ✓';
                setTimeout(() => { copyBtn.textContent = 'টেক্সট কপি করো'; }, 2000);
            });
    };
}

function toggleMenu() {
    const m = document.getElementById("menu");
    if (m) m.classList.toggle("active");
}

// Start camera on load
startCamera();