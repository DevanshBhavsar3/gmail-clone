import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "../context/firebase";

export function useGoogleSignin() {
  const firebase = useFirebase();

  const signin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebase.auth, provider);

    const idToken = await result.user.getIdToken();

    document.cookie = `uid=${result.user.uid}`;
    document.cookie = `token=${idToken}`;

    try {
      await setDoc(doc(firebase.db, "users", result.user.email!), {
        lastLogin: Date.now(),
      });
    } catch (error) {
      return error;
    }
  };
  return { signin };
}
