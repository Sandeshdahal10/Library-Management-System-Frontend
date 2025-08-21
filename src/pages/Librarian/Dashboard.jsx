import Header from "../../Layout/Header";
import Sidebar from "../../Layout/Sidebar";
import { useAuth } from "../../context/AuthContext";
import AddBorrowerButton from "../AddBorrowerButton";
import {
  FaPlus,
  FaUsers,
  FaBook,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";
import AddBookButton from "../Button";

export function Dashboard() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const click = (label) => () => {
    toast.info(`${label} coming soon`, { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={() => setMobileOpen(true)} />
      <div className="flex">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="text-sm font-semibold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md border border-gray-200 px-2 py-1 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="h-[calc(100%-48px)] overflow-y-auto">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6">
          {/* Hero Section */}
          <section className="mb-4 sm:mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back{user?.name ? `, ${user.name}` : ", Librarian"}
                </h1>
                <p className="text-gray-600">
                  Here’s a quick overview and helpful shortcuts.
                </p>
              </div>
              <div className="flex gap-2">
                <AddBookButton />
                <AddBorrowerButton />
              </div>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="mb-4 grid gap-3 sm:mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={click("Books")}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div className="text-sm text-gray-500">Total Books</div>
                <FaBook className="text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold">1,284</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-blue-700">
                View <FaArrowRight />
              </div>
            </button>

            <button
              onClick={click("Borrowers")}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div className="text-sm text-gray-500">Active Borrowers</div>
                <FaUsers className="text-indigo-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold">342</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-700">
                View <FaArrowRight />
              </div>
            </button>

            <button
              onClick={click("Overdue items")}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div className="text-sm text-gray-500">Overdue Items</div>
                <FaExclamationTriangle className="text-amber-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold">27</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700">
                Review <FaArrowRight />
              </div>
            </button>

            <button
              onClick={click("Reservations queue")}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div className="text-sm text-gray-500">Reservations Queue</div>
                <FaBook className="text-green-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold">12</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-700">
                Review <FaArrowRight />
              </div>
            </button>
          </section>

          {/* Announcements */}
          <section className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-3">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Announcements
              </h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="rounded-md  p-3">
                  System maintenance scheduled for Friday 9 PM.
                </li>
                <li className="rounded-md  p-3">
                  New arrivals this week in Fiction and Science.
                </li>
                <li className="rounded-md  p-3">
                  Reminder: Update borrower contact details regularly.
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
