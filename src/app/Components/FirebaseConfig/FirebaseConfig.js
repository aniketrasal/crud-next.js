// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database";

function FirebaseConfig(){
    const firebaseConfig = {
        apiKey: "AIzaSyB2Va8ZJmk2Bu9vXLyjVIfy9Mm-3im9qZE",
        authDomain: "pric-assign-backend.firebaseapp.com",
        databaseURL: "https://pric-assign-backend-default-rtdb.firebaseio.com",
        projectId: "pric-assign-backend",
        storageBucket: "pric-assign-backend.appspot.com",
        messagingSenderId: "462961431353",
        appId: "1:462961431353:web:274ccdb807ed63c201cee8",
        measurementId: "G-JZEWG8VG7F"
      };

      const app = initializeApp(firebaseConfig);

      return getDatabase(app);

}

export default FirebaseConfig

