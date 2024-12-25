import { Link } from "react-router";
import Searchbox from "./Searchbox";

// Icons
import { CgMail } from "react-icons/cg";

interface HeaderProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
}

export default function Header({ searchValue, setSearchValue }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 shadow-md border-b">
      {/* Mail Logo */}
      <Link to="/" className="flex items-center gap-2">
        <CgMail className="text-3xl sm:text-5xl text-blue-500" />
        <span className="font-Lato text-lg sm:text-xl">Mails</span>
      </Link>
      {/* Search Input */}
      <Searchbox searchValue={searchValue} setSearchValue={setSearchValue} />
    </header>
  );
}
