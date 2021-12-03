import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, ref, set, get} from "firebase/database";

//init firebase
const firebaseConfig = {
  apiKey: "AIzaSyCe_3Jb2KzBAjMNhgCsFQGkrj9Z6ZkxVUE",
  authDomain: "bank-app-1315f.firebaseapp.com",
  databaseURL:
    "https://bank-app-1315f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bank-app-1315f",
  storageBucket: "bank-app-1315f.appspot.com",
  messagingSenderId: "907053868126",
  appId: "1:907053868126:web:103cea7579062434fb00cf",
  measurementId: "G-M6JPSMBZ61",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      writeUserData(user, user.email, user.email);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(
       `error code: ${errorCode}
        error message: ${errorMessage}
        error email: ${email}`)
    });
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    writeUserData(user, name, email);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const reset = async (email) => {
  try {
    await sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  auth.signOut();
};

function writeUserData(user, name, email) {
  set(ref(db, "/users/" + user.uid), {
    id: user.uid,
    username: name,
    email: email,
    balance: 0
  });
}

export async function getBalance(uid){
  let data = null;
  const snapshot = await get(ref(db, `users/${uid}`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log('balance: ' ,snapshot.val().balance);
      data = snapshot.val().balance;
    }
  }).catch((error) => {
    console.error(error);
  });
  console.log(data);
  return data;
}