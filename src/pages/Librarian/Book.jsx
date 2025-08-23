import BookCard from "../../Layout/BookCard";
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import AddBookButton from "../Button";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Book() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/books");
      setBooks(res.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
            <BookCard books={books} />
          </div>
        </main>
      </div>
    </>
  );
}
