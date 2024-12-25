// Icons
import { IoMdSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface SearchboxProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
}

export default function Searchbox({
  searchValue,
  setSearchValue,
}: SearchboxProps) {
  return (
    <div className="relative w-full sm:w-1/2 mt-4 sm:mt-0 group">
      <IoMdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg sm:text-2xl text-gray-400 group-focus-within:text-black" />

      {searchValue && (
        <RxCross2
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-md sm:text-xl cursor-pointer"
          onClick={() => {
            setSearchValue("");
            document.getElementById("search-box")?.focus();
          }}
        />
      )}

      <input
        type="text"
        id="search-box"
        value={searchValue}
        placeholder="Search mail"
        className="w-full px-12 py-1 sm:py-2 text-sm sm:text-lg bg-gray-100 rounded-full focus:bg-gray-200 focus:text-black focus:outline-none transition duration-200 border-2 border-black/10"
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
}
