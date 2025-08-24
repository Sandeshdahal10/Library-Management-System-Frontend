import { FaHome, FaBook, FaUsers, FaQuestionCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Sidebar() {
  const { pathname } = useLocation();
  const auth = useAuth();
  const user = auth?.user ?? null;

  // simple exact check: consider borrower only when role === 'borrower' or roles includes 'borrower'
  // forgiving check: treat any role value containing 'borrower' as borrower (handles 'ROLE_BORROWER')
  const isBorrower = !!(
    user && (
      (typeof user.role === "string" && user.role.toLowerCase().includes("borrower")) ||
      (Array.isArray(user.roles) && user.roles.some(r => String(r).toLowerCase().includes("borrower"))) ||
      user.isBorrower === true
    )
  );
  // extra fallback: check entire serialized user object for 'borrower'
  const isBorrowerFallback = (() => {
    try {
      return user && JSON.stringify(user).toLowerCase().includes("borrower");
    } catch (e) {
      return false;
    }
  })();
  // If the app is currently on a borrower route, prefer borrower menu as a safe fallback
  const finalIsBorrower = isBorrower || isBorrowerFallback || pathname.startsWith("/borrower");
  return (
    <aside className="hidden md:flex sticky top-16 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white">
      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        role="navigation"
        aria-label="Sidebar"
      >
        {/* Section: Overview */}
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Overview
        </div>
        <ul className="space-y-1">
          <li>
            <Link
              to={finalIsBorrower ? "/borrower" : "/librarian"}
              aria-current={
                finalIsBorrower ? (pathname === "/borrower" ? "page" : undefined) : (pathname === "/librarian" ? "page" : undefined)
              }
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                finalIsBorrower ? (pathname === "/borrower" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50") : (pathname === "/librarian" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50")
              }`}
            >
              <FaHome
                className={
                  finalIsBorrower ? (pathname === "/borrower" ? "text-blue-600" : "text-gray-400") : (pathname === "/librarian" ? "text-blue-600" : "text-gray-400")
                }
              />
              <span>Dashboard</span>
            </Link>
          </li>
        </ul>

        {/* Section: Library */}
        <div className="mt-5 mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Library
        </div>
        <ul className="space-y-1">
          <li>
            <Link
              to={finalIsBorrower ? "/borrower/books" : "/librarian/books"}
              aria-current={
                finalIsBorrower
                  ? (pathname.startsWith("/borrower/books") ? "page" : undefined)
                  : (pathname.startsWith("/librarian/books") ? "page" : undefined)
              }
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                finalIsBorrower
                  ? (pathname.startsWith("/borrower/books") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50")
                  : (pathname.startsWith("/librarian/books") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50")
              }`}
            >
              <FaBook
                className={
                  finalIsBorrower
                    ? (pathname.startsWith("/borrower/books") ? "text-blue-600" : "text-gray-400")
                    : (pathname.startsWith("/librarian/books") ? "text-blue-600" : "text-gray-400")
                }
              />
              <span>Books</span>
            </Link>
          </li>
          {finalIsBorrower ? (
            <li>
              <Link
                to="/borrower/history"
                aria-current={
                  pathname.startsWith("/borrower/history") ? "page" : undefined
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname.startsWith("/borrower/history")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaUsers
                  className={
                    pathname.startsWith("/borrower/history")
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                />
                <span>History</span>
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="/librarian/borrowers"
                aria-current={
                  pathname.startsWith("/librarian/borrowers") ? "page" : undefined
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname.startsWith("/librarian/borrowers")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaUsers
                  className={
                    pathname.startsWith("/librarian/borrowers")
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                />
                <span>Borrowers</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Help */}
        <div className="mt-5 mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Help
        </div>
        <div className="px-2">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-[12px] leading-relaxed text-blue-900 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-blue-800">
              <FaQuestionCircle className="text-blue-600" />
              <span>Getting started</span>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use Library to manage Books and Borrowers.</li>
              <li>Books: view, add, or update your catalog.</li>
              <li>Borrowers: add members and manage details.</li>
              <li>Use the top-right Logout to end your session.</li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Footer badge */}
      <div className="border-t px-3 py-3 text-[11px] text-gray-500">
  {user ? `LBMS · ${finalIsBorrower ? "Borrower" : "Admin"}` : "LBMS · v0.1.0"}
      </div>
    </aside>
  );
}

export default Sidebar;
