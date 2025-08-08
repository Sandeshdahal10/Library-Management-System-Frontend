import { FaBookOpen } from "react-icons/fa";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import LogoutButton from "../utils/Logout";

export function Header() {
  return (
    <>
      <div className="flex  justify-between bg-primary">
        <div className="flex items-center p-2 gap-2.5">
          <FaBookOpen className="cursor-pointer text-4xl text-blue-500" />
          <h1 className="text-3xl text-blue-500 font-bold">
            Book Nest Library
          </h1>
        </div>
        <div className="flex items-center justify-between text-5xl gap-6 mr-4">
          <FaSearch className="cursor-pointer text-2xl text-blue-500" />
          <FaBell className="cursor-pointer text-2xl text-blue-500" />
          <FaUser className="cursor-pointer text-2xl text-blue-500" />
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

export default Header;
