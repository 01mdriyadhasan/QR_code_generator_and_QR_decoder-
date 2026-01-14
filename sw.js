const CACHE_NAME = 'qr-tools-cache-v1';

const urlsToCache = [
  // বেসিক + রুট পেজ (অবশ্যই যোগ করো)
  '/',
  '/QR_code_generator_and_QR_decoder-/index.html',                  // মেইন পেজ

  // PWA সম্পর্কিত ফাইল (manifest + আইকন – এগুলো আছে তোমার রিপোতে)
  '/QR_code_generator_and_QR_decoder-/manifest.json',
  '/QR_code_generator_and_QR_decoder-/icon-192.png',
  '/QR_code_generator_and_QR_decoder-/icon-512.png',

  // CSS ফাইলগুলো (যা তোমার রিপোতে আছে)
  '/QR_code_generator_and_QR_decoder-/style.css',                   // index.html-এর জন্য
  '/QR_code_generator_and_QR_decoder-/decoder.css',                 // QR Decoder পেজের জন্য

  // JS ফাইলগুলো (যা তোমার রিপোতে আছে এবং লোড হচ্ছে)
  '/QR_code_generator_and_QR_decoder-/qrcode.min.js',               // QR জেনারেটর লাইব্রেরি
  '/QR_code_generator_and_QR_decoder-/profile.min.js',              // প্রোফাইল আপডেটের জন্য
  '/QR_code_generator_and_QR_decoder-/index.min.js',                // সম্ভবত index.html-এর মেইন স্ক্রিপ্ট
  '/QR_code_generator_and_QR_decoder-/decoder.mi.js',               // ডিকোডারের JS (যদি decoder.mi.js হয়, নাম চেক করে নাও)

  // অন্য পেজগুলো (যাতে অফলাইনে ওপেন হয়)
  '/QR_code_generator_and_QR_decoder-/QR Decoder.html',
  '/QR_code_generator_and_QR_decoder-/profile.html'
];
