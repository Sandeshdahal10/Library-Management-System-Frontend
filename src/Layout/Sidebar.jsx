import { FaHome, FaBook, FaUsers, FaQuestionCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const { pathname } = useLocation();
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
              to="/librarian"
              aria-current={pathname === "/librarian" ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === "/librarian"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaHome
                className={
                  pathname === "/librarian" ? "text-blue-600" : "text-gray-400"
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
              to="/librarian/books"
              aria-current={
                pathname.startsWith("/librarian/books") ? "page" : undefined
              }
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname.startsWith("/librarian/books")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaBook
                className={
                  pathname.startsWith("/librarian/books")
                    ? "text-blue-600"
                    : "text-gray-400"
                }
              />
              <span>Books</span>
            </Link>
          </li>
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
        LBMS Admin · v0.1.0
      </div>
    </aside>
  );
}

export default Sidebar;
