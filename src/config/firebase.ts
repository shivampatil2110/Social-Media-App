import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.firebase_api_key,
  authDomain: process.env.firebase_auth_domain,
  projectId: process.env.firebase_project_id,
  storageBucket: process.env.firebase_storage_bucket,
  messagingSenderId: process.env.firebase_messaging_id,
  appId: process.env.app_id,
  measurementId: process.env.measurement_id,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
