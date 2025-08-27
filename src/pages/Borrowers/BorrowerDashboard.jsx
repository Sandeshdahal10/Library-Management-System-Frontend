import React from "react";
import Header from "../../Layout/Header";
import Sidebar from "../../Layout/Sidebar";
import { useAuth } from "../../context/AuthContext";

export function BorrowerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary">Welcome back, {user?.name || user?.fullName || user?.email || 'Reader'}</h1>
              <p className="text-sm text-gray-500">Use the buttons to browse the library or view your history.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.location.href = '/borrower/books'} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Browse Books</button>
              <button onClick={() => window.location.href = '/borrower/history'} className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium">History</button>
            </div>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
              <p className="text-sm text-gray-600">Find books, manage your borrows, and check your history from the left menu or the buttons above.</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Explore</h2>
              <p className="text-sm text-gray-600">Recommended: Browse new arrivals or search by title/author to find your next read.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default BorrowerDashboard;