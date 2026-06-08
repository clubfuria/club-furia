importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBtNNZt9vtCLpVWqcyVbtU8wPNZdUfbCrc",
  authDomain: "club-furia.firebaseapp.com",
  projectId: "club-furia",
  storageBucket: "club-furia.firebasestorage.app",
  messagingSenderId: "162672961902",
  appId: "1:162672961902:web:24e9a2345b990741ad397f",
});

const messaging = firebase.messaging();