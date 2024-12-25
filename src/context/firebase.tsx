import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { createContext, useContext } from "react";

interface FirebaseContextProps {
  auth: Auth;
  db: Firestore;
}

// Paste Your web app's Firebase configuration here

// It should look something like these:
// const firebaseConfig = {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "",
// };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const FirebaseContext = createContext<FirebaseContextProps>({ auth, db });

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <FirebaseContext.Provider value={{ auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// eslint-disable-next-line
export const useFirebase = () => {
  return useContext(FirebaseContext);
};
