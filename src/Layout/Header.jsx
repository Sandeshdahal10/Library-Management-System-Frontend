import { FaBookOpen, FaSearch, FaBell, FaUser } from "react-icons/fa";
import LogoutButton from "../utils/Logout";
export function Header({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 md:hidden"
            onClick={onToggleSidebar}
            title="Sidebar"
          >
            <span aria-hidden className="text-lg">
              ≡
            </span>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2 whitespace-nowrap text-lg font-bold">
            <FaBookOpen className="text-blue-600" />
            <span>LBMS Admin</span>
          </div>
        </div>

        {/* Center: Search  */}
        <div className="hidden w-full max-w-xl md:block">
          <form className="relative flex items-center" role="search">
            <FaSearch className="pointer-events-none absolute left-3 text-gray-400" />
            <input
              type="search"
              placeholder="Search books"
              className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-24 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400"
            />
            <button
              type="button"
              disabled
              className="absolute right-2 h-8 rounded-lg  px-3 text-xs text-gray-700 pointer-events-none"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50 pointer-events-none"
              disabled
              title="Notifications"
            >
              <FaBell className="text-blue-500" />
            </button>
            <span className="pointer-events-none absolute -right-1 -top-1 h-4 min-w-4 rounded-full border-2  bg-red-500 px-1 text-center text-[10px] leading-4 text-white"></span>
          </div>

          {/* User */}
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-blue-500 shadow-sm hover:bg-gray-50 cursor-pointer"
            disabled
            title="Account"
          >
            <FaUser />
            <span className="sr-only">Open user menu</span>
          </button>

          <LogoutButton />
        </div>
      </div>

      {/* Secondary row: Search on small screens */}
      <div className="block border-t border-gray-100 px-4 py-2 md:hidden">
        <form className="relative flex items-center" role="search">
          <FaSearch className="pointer-events-none absolute left-3 text-gray-400" />
          <input
            type="search"
            placeholder="Search…"
            className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-24 text-sm outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            disabled
            className="absolute right-2 h-8 rounded-lg  px-3 text-xs text-gray-700 pointer-events-none"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
