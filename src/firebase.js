import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBtNNZt9vtCLpVWqcyVbtU8wPNZdUfbCrc",
  authDomain: "club-furia.firebaseapp.com",
  projectId: "club-furia",
  storageBucket: "club-furia.firebasestorage.app",
  messagingSenderId: "162672961902",
  appId: "1:162672961902:web:24e9a2345b990741ad397f",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const VAPID_KEY =
  "BHQhfuAYqLmSaIqbMMHWUl-ZZRSXRuYt6TrOhp0GhgHiTpLCaOo0rTQ51YKfphSJBSMUyef3Bz4DzixvOCx4Pyk";