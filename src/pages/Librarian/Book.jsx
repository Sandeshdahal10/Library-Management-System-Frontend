import BookTable from "../../Layout/BookTable";
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import AddBookButton from "../Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
export default function Book() {
  const [books, setBooks] = useState([]);
  const auth = useAuth();
  const token = auth?.token ?? localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      // try with token first (librarian may have a token), then fall back to public
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const res = await axios.get('https://library-management-system-boo3.onrender.com/api/books', { headers });
        setBooks(res.data?.books || res.data || []);
        return;
      } catch (err) {
        // try without auth as fallback
        try {
          const res2 = await axios.get('https://library-management-system-boo3.onrender.com/api/books');
          setBooks(res2.data?.books || res2.data || []);
          return;
        } catch (err2) {
          console.error('Books fetch errors:', { withAuth: err?.toString(), withoutAuth: err2?.toString() });
          toast.error('Failed to fetch books');
        }
      }
    } catch (e) {
      console.error('Unexpected error fetching books', e);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // accept searchResults passed via navigation state
  const location = useLocation();
  const searchResults = location?.state?.searchResults ?? null;

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="mt-10 w-full px-4 sm:px-6 lg:px-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-secondary">Book List</h2>
            <AddBookButton fetchBooks={fetchBooks} />
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <BookTable books={searchResults ?? books} />
          </div>
        </main>
      </div>
    </>
  );
}
