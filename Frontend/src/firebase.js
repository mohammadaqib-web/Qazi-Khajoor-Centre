import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGECtHTEXql4tot3eux4xkRjPcI3PgUeo",
  authDomain: "qkconline.firebaseapp.com",
  projectId: "qkconline",
  appId: "1:31736541075:web:5ec2dc4fe1dec7456c4266",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
