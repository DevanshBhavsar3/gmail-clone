import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useFirebase } from "../context/firebase";
import { useGoogleSignin } from "../utils/useGoogleSignin";

// Icons
import { CgMail } from "react-icons/cg";
import { FaGoogle } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";

export default function Login() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const signInWithGoogle = useGoogleSignin();

  useEffect(() => {
    onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        navigate("/inbox", {
          state: { successMsg: "You're logged in." },
        });
      }
    });

    if (state?.successMsg) {
      setMessage(state.successMsg);

      navigate(location.pathname, { state: {} });
    }
  }, [state, firebase.auth, navigate, location.pathname]);

  async function handleLogInUserWithEmailAndPassword(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );

      const user = userCredential.user;

      const token = await user.getIdToken();

      document.cookie = `token=${token}`;
      document.cookie = `uid=${user.uid}`;

      setDoc(doc(firebase.db, "users", email.toLowerCase()), {
        lastLogin: Date.now(),
      });

      navigate("/inbox", { state: { successMsg: "Log In successfull." } });
    } catch (error) {
      console.error(error);
      setError("Wrong Credentials.");
    }
  }

  async function handleLogInUserWithGoogle() {
    try {
      await signInWithGoogle.signin();

      navigate("/inbox");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {error ? (
        <div className="fixed flex items-center bg-red-400  p-2 w-auto rounded-md bottom-5 left-5">
          <RiErrorWarningLine className="text-xl sm:text-2xl mr-3" />
          <span className="text-sm sm:text-md">{error}</span>
        </div>
      ) : undefined}

      {message ? (
        <div className="fixed flex items-center bg-green-400/80  p-2 w-auto rounded-md bottom-5 left-5">
          <RiErrorWarningLine className="text-xl sm:text-2xl mr-3" />
          <span className="text-sm sm:text-md">{message}</span>
        </div>
      ) : undefined}

      <div className="flex flex-col items-center justify-center min-h-screen font-Lato px-4">
        <h1 className="text-3xl sm:text-4xl mb-8">Login</h1>

        <form
          className="flex flex-col w-full max-w-md p-6 rounded-md shadow-xl text-sm md:text-md lg:text-base"
          onSubmit={(e) => handleLogInUserWithEmailAndPassword(e)}
        >
          <div className="flex items-center mb-6">
            <CgMail className="text-3xl sm:text-5xl text-blue-500" />
            <span className="font-Lato text-2xl sm:text-3xl">Mails</span>
          </div>

          <input
            type="text"
            placeholder="Email"
            className="p-3 mb-4 bg-gray-500/20 rounded-md focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 mb-4 bg-gray-500/20 rounded-md focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full p-3 mb-4 bg-blue-500 rounded-md hover:bg-blue-800/90 text-white transition duration-200 shadow-lg"
          >
            Log In
          </motion.button>

          <div className="flex items-center justify-center mb-4">
            <span className="text-sm">Don't have an account?</span>
            <Link to="/signup" className="ml-2 text-blue-400 hover:underline">
              Sign Up
            </Link>
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-black" />
            <span className="mx-2">or</span>
            <hr className="flex-grow border-black" />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            className="flex items-center justify-center p-3 rounded-md bg-blue-500 hover:bg-blue-800/90 text-white transition duration-200 shadow-lg"
            onClick={() => handleLogInUserWithGoogle()}
          >
            <FaGoogle className="text-lg md:text-2xl mr-2" />
            Continue with Google
          </motion.button>
        </form>
      </div>
    </>
  );
}
