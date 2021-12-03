import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  getDatabase,
  ref,
  set,
  update,
  child,
  push,
  get,
} from "firebase/database";
import { getBalance } from "../client/src/api/firebase-client-helper";

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

function handle(uid, data) {
  console.log("type: ", typeof data + "length ", data.length);
  let totalBalance = getBalance(uid);
  for (const transaction of Object.values(data)) {
    console.log("tran: ", transaction.type);
    if (transaction.type === "DEPOSIT") {
      console.log("data: ", transaction.amount);
      totalBalance += parseInt(transaction.amount);
      update(ref(db, `users/${uid}`), {
        balance: totalBalance,
      });
    } else if ("WITHDRAW") {
      totalBalance -= parseInt(transaction.amount);
      update(ref(db, `users/${uid}`), {
        balance: `${totalBalance}`,
      });
    }
  }
}

export async function createTransaction(uid, type, amount) {
  const tid = push(child(ref(db), "/users/" + uid + "/transactions")).key;
  try {
    await set(ref(db, `/users/${uid}/transactions/${tid}`), {
      type,
      amount,
    });
    console.log(
      `transaction successfully created:type: ${type}, amount: ${amount}, tid: ${tid}`
    );
    return {
      tid,
      type,
      amount,
    };
  } catch (err) {
    console.error(err);
    return {
      err,
      tid,
      type,
      amount,
    };
  }
}


export async function updateBalance(uid, type, amount) {
  return createTransaction(uid, type, amount).then(async () => {
    let data = null;
    try {
      const snapshot = await get(ref(db, `users/${uid}/transactions`));
      if (snapshot.exists()) {
        data = snapshot.val();
        console.log("data: ", data);
        handle(uid, data);
      } else {
        console.log("no data available");
      }
    } catch (err) {
      return console.error(err);
    }
    return data;
  });
}
