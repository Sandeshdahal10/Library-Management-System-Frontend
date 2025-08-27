import { FaBookOpen, FaSearch, FaBell, FaUser } from "react-icons/fa";
import LogoutButton from "../utils/Logout";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header({ onToggleSidebar }) {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const timerRef = React.useRef(null);

  // fetch suggestions (debounced)
  React.useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await axios.get('https://library-management-system-boo3.onrender.com/api/books', { params: { q: searchTerm } });
        const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.books) ? res.data.books : []);
        setSuggestions(list.slice(0, 10));
      } catch (err) {
        console.debug('Suggestion fetch error', err?.toString());
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [searchTerm]);

  const selectSuggestion = (s) => {
    // navigate to books page with single result
    navigate('/librarian/books', { state: { searchResults: [s] } });
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.trim().length === 0) return;
    try {
      const res = await axios.get('https://library-management-system-boo3.onrender.com/api/books', { params: { q: searchTerm } });
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.books) ? res.data.books : []);
      // navigate to books page and pass results in state
      navigate('/librarian/books', { state: { searchResults: list } });
      setSearchTerm('');
      setSuggestions([]);
    } catch (err) {
      console.error('Search error', err);
    }
  };

  // forgiving role check: treat anything containing 'borrower' as borrower (e.g. 'ROLE_BORROWER')
  const isBorrower = !!(
    user && (
      (typeof user.role === "string" && user.role.toLowerCase().includes("borrower")) ||
      (Array.isArray(user.roles) && user.roles.some(r => String(r).toLowerCase().includes("borrower"))) ||
      user.isBorrower === true ||
      (() => {
        try {
          return JSON.stringify(user).toLowerCase().includes("borrower");
        } catch (e) {
          return false;
        }
      })()
    )
  );
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
            <span>{isBorrower ? "LBMS Borrower" : "LBMS Librarian"}</span>
          </div>
        </div>

        {/* Center: Search  */}
        <div className="hidden w-full max-w-xl md:block">
          <form className="relative flex items-center" role="search" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <FaSearch className="pointer-events-none absolute left-3 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
              placeholder="Search books"
              className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-24 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 h-8 rounded-lg px-3 text-xs text-gray-700"
            >
              Search
            </button>

            {/* suggestions dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white p-2 shadow">
                {suggestions.map((s) => (
                  <li key={s._id || s.isbn || s.id} className="cursor-pointer px-2 py-1 text-sm hover:bg-gray-100" onClick={() => selectSuggestion(s)}>{s.title}</li>
                ))}
              </ul>
            )}
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
