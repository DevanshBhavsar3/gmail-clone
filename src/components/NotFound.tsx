import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function NotFound() {
  const firebase = useFirebase();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, [firebase.auth, setIsLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col justify-center overflow-hidden">
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="flex-grow flex items-center justify-center">
        <img src="/404_image.jpg" className="w-1/2 h-1/3" alt="hero_image" />
        <p className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold text-center text-blue-500">
          404 Not Found
        </p>
      </div>

      <Footer />
    </div>
  );
}
