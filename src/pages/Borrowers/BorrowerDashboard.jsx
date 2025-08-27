import React, { useEffect, useState } from "react";
import Header from "../../Layout/Header";
import Sidebar from "../../Layout/Sidebar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export function BorrowerDashboard() {
  const { user, token } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user || !token) return;
      setLoading(true);
      setError(null);
      try {
        // Assumption: API endpoint GET /api/loans accepts userId as query param
        const userId = user.id ?? user._id ?? user.userId;
        const res = await axios.get("https://library-management-system-boo3.onrender.com/api/", {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.loans)
          ? data.loans
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setLoans(list);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [user, token]);

  const fmt = (s) => {
    if (!s) return "-";
    try {
      return new Date(s).toLocaleDateString();
    } catch (e) {
      return String(s);
    }
  };

  const activeLoans = loans.filter((l) => !l.returnedAt && !l.returned_at && !l.returned);
  const overdue = loans.filter((l) => {
    const ret = l.returnDate ?? l.return_date ?? l.dueDate ?? l.due_date ?? l.returnedAt ?? l.returned_at;
    if (!ret) return false;
    const d = new Date(ret);
    return !isNaN(d.getTime()) && d < new Date();
  });
  const holds = loans.filter((l) => l.status === "hold" || l.status === "on-hold").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary">Welcome back</h1>
              <p className="text-sm text-gray-500">Here's your borrowing activity and quick actions.</p>
            </div>
          </div>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-gray-500">Active Loans</div>
              <div className="mt-2 text-2xl font-bold text-gray-800">{activeLoans.length}</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-gray-500">Overdue</div>
              <div className="mt-2 text-2xl font-bold text-gray-800">{overdue.length}</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-gray-500">Holds</div>
              <div className="mt-2 text-2xl font-bold text-gray-800">{holds}</div>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Current Loans</h2>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              {loading ? (
                <div className="p-6 text-center text-sm text-gray-500">Loading loans...</div>
              ) : error ? (
                <div className="p-6 text-center text-sm text-red-600">Failed to load loans</div>
              ) : loans.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">You have no active loans.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Loan ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Book</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Borrow Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Return Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loans.map((l, i) => (
                      <tr key={l.id ?? i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{l.id ?? l.loanId ?? l.loan_id ?? "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{l.bookTitle ?? l.book?.title ?? l.title ?? "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{fmt(l.borrowDate ?? l.borrow_date ?? l.borrowedAt ?? l.borrowed_at)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{fmt(l.returnDate ?? l.return_date ?? l.dueDate ?? l.due_date ?? l.returnedAt ?? l.returned_at)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Details</button>
                            <button className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Return</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="mt-8 max-w-md">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm">
              <div className="mb-2 font-semibold text-blue-800">Getting started</div>
              <ul className="list-disc pl-5 text-blue-900">
                <li>View your active loans and due dates.</li>
                <li>Use Renew or Return actions to manage loans.</li>
                <li>Use Books to browse the catalog and place holds.</li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default BorrowerDashboard;