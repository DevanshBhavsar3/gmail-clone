import { NavLink } from "react-router";

// Icons
import { CgMail } from "react-icons/cg";

interface NavbarProp {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProp) {
  return (
    <nav className="z-10 fixed top-0 left-0 w-full flex justify-between p-5 text-sm sm:text-md lg:text-base backdrop-blur-[3px]">
      <NavLink to="/" className="flex items-center gap-2 p-2">
        <CgMail className="text-4xl sm:text-5xl text-blue-500" />
        <span className="font-Lato text-lg sm:text-xl lg:text-2xl">Mails</span>
      </NavLink>
      <div className="w-auto flex p-3 gap-5 text-center items-center">
        {isLoggedIn ? (
          <NavLink
            to="/inbox"
            className="w-full px-2 sm:px-3 p-1 sm:p-2 rounded-md bg-blue-500 text-white hover:bg-blue-700/90 transition duration-200 whitespace-nowrap"
          >
            Go to Inbox
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/login"
              className="w-full px-2 sm:px-2 p-1 sm:p-2 rounded-md transition duration-200 hover:underline hover:text-blue-500 whitespace-nowrap"
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className="w-full px-2 sm:px-3 p-1 sm:p-2 rounded-md bg-blue-500 text-white hover:bg-blue-700/90 transition duration-200 whitespace-nowrap"
            >
              Sign up free
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
