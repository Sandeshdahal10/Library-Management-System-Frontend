import {
  FaHome,
  FaBook,
  FaUsers,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";

export function Sidebar() {
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
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 pointer-events-none"
            >
              <FaHome className="text-blue-600" />
              <span>Dashboard</span>
            </button>
          </li>
        </ul>

        {/* Section: Library */}
        <div className="mt-5 mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Library
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 pointer-events-none"
            >
              <FaBook className="text-gray-400" />
              <span>Books</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 pointer-events-none"
            >
              <FaUsers className="text-gray-400" />
              <span>Borrowers</span>
            </button>
          </li>
        </ul>

        {/* Section: Insights */}
        <div className="mt-5 mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Insights
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 pointer-events-none"
            >
              <FaChartBar className="text-gray-400" />
              <span>Reports</span>
            </button>
          </li>
        </ul>

        {/* Section: System */}
        <div className="mt-5 mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          System
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 pointer-events-none"
            >
              <FaCog className="text-gray-400" />
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 pointer-events-none"
            >
              <FaQuestionCircle className="text-gray-400" />
              <span>Help</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer badge */}
      <div className="border-t px-3 py-3 text-[11px] text-gray-500">
        LBMS Admin · v0.1.0
      </div>
    </aside>
  );
}

export default Sidebar;
