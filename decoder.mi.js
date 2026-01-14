
        const html5QrCode = new Html5Qrcode("reader");
        const resultDiv = document.getElementById("result");
        const statusDiv = document.getElementById("status");
        const copyBtn = document.getElementById("copyBtn");
        let lastResult = "";

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        // WiFi string parse + escape handle function
        function parseWiFiString(str) {
            if (!str.startsWith("WIFI:")) return null;

            // Remove trailing ;; if present
            str = str.replace(/;+$/, '');

            const parts = {};
            const fields = str.slice(5).split(';'); // WIFI: পর থেকে

            fields.forEach(field => {
                if (!field) return;
                const [key, ...valueParts] = field.split(':');
                let value = valueParts.join(':'); // colon থাকলে জোড়া লাগানো

                // Unescape special chars
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
            copyBtn.style.display = "inline-block";
            statusDiv.textContent = "সফল! QR পড়া হয়েছে ✓";
            lastResult = decodedText;
        }

        function onScanSuccess(decodedText, decodedResult) {
            if (decodedText !== lastResult) {
                displayResult(decodedText);
            }
        }

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            (errorMessage) => {}
        ).catch(err => {
            statusDiv.textContent = "ক্যামেরা অ্যাক্সেস করতে সমস্যা: " + err;
            statusDiv.style.color = "#ffcccc";
        });

        document.getElementById("qr-file").addEventListener("change", e => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                html5QrCode.scanFile(file, true)
                    .then(decodedText => displayResult(decodedText))
                    .catch(err => {
                        resultDiv.innerHTML = "এই ছবিতে QR কোড পাওয়া যায়নি 😕";
                    });
            }
        });

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(lastResult)
                .then(() => {
                    copyBtn.textContent = "কপি হয়েছে! ✓";
                    setTimeout(() => { copyBtn.textContent = "টেক্সট কপি করো"; }, 2000);
                });
        };
    function toggleMenu() {
            document.getElementById("menu").classList.toggle("active");
        }
   
