import React, { useState, useEffect } from "react";
import Header from "../../Layout/Header";
import Sidebar from "../../Layout/Sidebar";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AddBorrowerButton from "../AddBorrowerButton";

export default function Borrowers() {
  const { token } = useAuth();
  const [borrower, setBorrower] = useState([]);
  const [modelForm, setModelForm] = useState(false);

  const formatDate = (val) => {
    if (!val) return "-";
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? String(val) : d.toLocaleString();
    } catch (e) {
      return String(val);
    }
  };

  const fetchBorrower = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/borrowers", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.status === 200) {
        // normalize response to an array
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.borrowers)
          ? data.borrowers
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setBorrower(list);
      } else {
        console.error("Unexpected status when fetching borrowers:", res.status, res.data);
      }
    } catch (err) {
      console.error("Error fetching borrowers:", err);
    }
  };

  useEffect(() => {
    fetchBorrower();
  }, [token]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="mt-10 w-full px-4 sm:px-6 lg:px-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-secondary">Borrower List</h2>
            <AddBorrowerButton />
          </div>

          <div className="mt-4 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      User ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Book ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Borrow Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Return Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(borrower || []).map((r, idx) => {
                    const userId = r.userId ?? r.user_id ?? r.user?.id ?? r.memberId ?? r.member_id ?? r.user ?? r.id;
                    const bookId = r.bookId ?? r.book_id ?? r.book?.id ?? r.book ?? r.bookId ?? r.book_id;
                    const borrowDate = r.borrowDate ?? r.borrow_date ?? r.borrowedAt ?? r.borrowed_at ?? r.createdAt ?? r.created_at;
                    const returnDate = r.returnDate ?? r.return_date ?? r.dueDate ?? r.due_date ?? r.returnedAt ?? r.returned_at;
                    return (
                      <tr key={r.id ?? idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{String(userId ?? "-")}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{String(bookId ?? "-")}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(borrowDate)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(returnDate)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
