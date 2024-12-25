import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useFirebase } from "../context/firebase";

export default function HomePage() {
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
    <div className="flex flex-col gap-5 justify-center items-center mt-24">
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold text-center my-10">
        <p>Organize Your Life.</p>
        <p>Effortlessly.</p>
      </div>

      <Link
        to={isLoggedIn ? "/inbox" : "/signup"}
        className="bg-blue-500 hover:bg-blue-700/90 transition duration-200 p-2 sm:p-3 px-3 sm:px-5 rounded-md text-white text-xs md:text-sm lg:text-base"
      >
        {isLoggedIn ? "Go to Inbox" : "Signup For Free"}
      </Link>

      <div className="shadow-lg w-3/4 h-auto my-10">
        <img
          src="/mails_demo.png"
          alt="mails_demo"
          className="border-2 rounded-md w-full h-full"
        />
      </div>

      <div className="flex justify-center items-center gap-20 p-10">
        <img src="/hero_image.png" className=" w-1/3 h-1/3" alt="hero_image" />
        <p className="text-center text-lg sm:text-xl md:text-3xl lg:text-5xl font-semibold">
          The Inbox
          <br />
          That Gets Out of Your Way
        </p>
      </div>

      <Footer />
    </div>
  );
}
