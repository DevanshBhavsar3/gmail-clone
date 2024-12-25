import { Link } from "react-router";

// Icons
import { CgMail } from "react-icons/cg";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full p-3 bg-blue-500/10 flex items-center justify-between flex-col sm:flex-row">
      <Link to="/" className="flex items-center gap-2 p-2">
        <CgMail className="text-4xl sm:text-5xl text-blue-500" />
        <span className="font-Lato text-lg sm:text-xl lg:text-2xl">Mails</span>
      </Link>
      <Link
        to="https://github.com/DevanshBhavsar3/gmail-clone"
        className="flex items-center gap-2"
      >
        <FaGithub className="text-xl sm:text-2xl" />
        <p className="text-sm sm:text-base">Crafted with ❤️ by Devansh</p>
      </Link>
    </footer>
  );
}
