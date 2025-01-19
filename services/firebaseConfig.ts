// services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/compat/auth";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
//const firebaseConfig = {
  //apiKey: "AIzaSyBzQIZnyJ1hJzlm9qnfC6LQwm28gjMSwXg",
  //authDomain: "fishfeeder-fe8a0.firebaseapp.com",
  //projectId: "fishfeeder-fe8a0",
  //storageBucket: "fishfeeder-fe8a0.firebasestorage.app",
  //messagingSenderId: "448262170116",
  //appId: "1:448262170116:web:4871f6c3bd6d43da533751",
  //measurementId: "G-1541MTRNKD",
//
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCk5YV5cB8CrhA_FpxL0IOJajhIVKwCqtc",
  authDomain: "smart-fish-feeder-88b78.firebaseapp.com",
  databaseURL: "https://smart-fish-feeder-88b78-default-rtdb.firebaseio.com",
  projectId: "smart-fish-feeder-88b78",
  storageBucket: "smart-fish-feeder-88b78.firebasestorage.app",
  messagingSenderId: "743759330027",
  appId: "1:743759330027:web:977ab173f502f222505cae",
  measurementId: "G-1JJ14B711R"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const storage = getStorage(app);
export { storage, auth, app };
