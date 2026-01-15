// ছোট ধাঁচের service worker রেজিস্ট্রেশন — এই ফাইলটিকে প্রতিটি পেজে যোগ করুন (index.html, QR Decoder.html, profile.html)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/QR_code_generator_and_QR_decoder-/sw.js')
      .then(reg => {
        console.log('ServiceWorker registered:', reg.scope);
      })
      .catch(err => {
        console.warn('ServiceWorker registration failed:', err);
      });
  });
}