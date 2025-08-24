import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function BookTable({ books: initialBooks }) {
  const auth = useAuth();
  const token = auth?.token ?? localStorage.getItem('token');
  const user = auth?.user ?? (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch(e){ return null; }
  })();
  const [books, setBooks] = React.useState(initialBooks ?? []);
  const [loading, setLoading] = React.useState(!Array.isArray(initialBooks) || initialBooks.length === 0);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (Array.isArray(initialBooks) && initialBooks.length > 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Backend now exposes a public GET /api/books — call without Authorization header.
        const res = await axios.get('http://localhost:8000/api/books');
        if (!mounted) return;
        setBooks(res.data || []);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to fetch books';
        setError(msg);
        console.error('BookTable fetch error', err);
        toast.error(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [initialBooks]);

  const handleDelete = async (isbn) => {
    if (!isbn) return toast.error('Missing ISBN');
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/books/${encodeURIComponent(isbn)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setBooks((s) => s.filter(b => (b.isbn || b.ISBN) !== isbn));
      toast.success('Book deleted');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to delete';
      toast.error(msg);
    }
  };

  const handleEdit = async (isbn) => {
    if (!isbn) return toast.error('Missing ISBN');
    const book = books.find(b => (b.isbn || b.ISBN) === isbn);
    if (!book) return toast.error('Book not found');
    const title = window.prompt('Title', book.title || '');
    if (title === null) return; // cancelled
    const author = window.prompt('Author', book.author || '');
    if (author === null) return;
    const quantityStr = window.prompt('Quantity', String(book.quantity ?? book.total ?? 0));
    if (quantityStr === null) return;
    const availableStr = window.prompt('Available Books', String(book.availableBooks ?? book.available ?? 0));
    if (availableStr === null) return;
    const quantity = parseInt(quantityStr, 10) || 0;
    const availableBooks = parseInt(availableStr, 10) || 0;
    try {
      const res = await axios.put(`http://localhost:8000/api/books/${encodeURIComponent(isbn)}`, { title, author, quantity, availableBooks }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const updated = res.data?.book || res.data;
      setBooks((s) => s.map(b => ((b.isbn || b.ISBN) === isbn ? updated : b)));
      toast.success('Book updated');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to update';
      toast.error(msg);
    }
  };

  const handleBorrow = async (book) => {
    const bookId = book._id || book.id || book.bookId;
    if (!bookId) return toast.error('Missing book id for borrow');
    try {
      const res = await axios.post('http://localhost:8000/api/borrow', { bookId }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      toast.success(res?.data?.message || 'Borrowed');
      // update available locally
      setBooks((s) => s.map(b => ((b._id === bookId || b.id === bookId) ? { ...b, availableBooks: (b.availableBooks ?? b.available ?? 0) - 1 } : b)));
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to borrow';
      toast.error(msg);
    }
  };

  const handleReturn = async (book) => {
    // Find the borrow record id for this user & book then call POST /api/borrow/return/:borrowId
    try {
      const bookId = book._id || book.id || (book.bookId && (book.bookId._id || book.bookId.id)) || null;
      const hdrs = token ? { Authorization: `Bearer ${token}` } : {};

      // Get borrow history for current user
      const res = await axios.get('http://localhost:8000/api/borrow/history', { headers: hdrs });
      const history = res.data?.borrows || [];

      const found = history.find(rec => {
        const recReturned = rec.returnDate !== null && typeof rec.returnDate !== 'undefined';
        if (recReturned) return false;
        // rec.bookId may be populated (object) or just an id
        const recBookId = rec.bookId && (rec.bookId._id || rec.bookId.id) ? (rec.bookId._id || rec.bookId.id) : rec.bookId;
        const matchById = bookId && recBookId && (String(recBookId) === String(bookId));
        const matchByIsbn = rec.bookId && rec.bookId.isbn && book.isbn && String(rec.bookId.isbn) === String(book.isbn);
        return matchById || matchByIsbn;
      });

      if (!found) {
        return toast.error('No active borrow record found for this book');
      }

      const borrowId = found._id || found.id;
      if (!borrowId) return toast.error('Borrow record id not found');

      const url = `http://localhost:8000/api/borrow/return/${encodeURIComponent(borrowId)}`;
      const ret = await axios.post(url, {}, { headers: hdrs });
      toast.success(ret?.data?.message || 'Returned');

      // update available locally
      setBooks((s) => s.map(b => {
        const matches = (b._id && book._id && String(b._id) === String(book._id)) || (b.id && book.id && String(b.id) === String(book.id)) || (b.isbn && book.isbn && String(b.isbn) === String(book.isbn));
        if (!matches) return b;
        return { ...b, availableBooks: (b.availableBooks ?? b.available ?? 0) + 1 };
      }));
    } catch (err) {
      const msg = err?.response?.data || err?.response?.data?.message || err.message || 'Failed to return';
      const text = typeof msg === 'string' ? msg : JSON.stringify(msg);
      toast.error(text);
      console.error('Return error', err);
    }
  };

  // role detection
  const isBorrower = (() => {
    try {
      if (!user) return false;
      const normalize = v => (v ? String(v).toLowerCase() : '');
      if (normalize(user.role || user.type || user.userType).includes('borrower')) return true;
      if (Array.isArray(user.roles) && user.roles.some(r => normalize(r).includes('borrower'))) return true;
      if (user.isBorrower === true) return true;
      return JSON.stringify(user).toLowerCase().includes('borrower');
    } catch (e) {
      return false;
    }
  })();

  const isLibrarian = (() => {
    try {
      if (!user) return false;
      const normalize = v => (v ? String(v).toLowerCase() : '');
      if (normalize(user.role || user.type || user.userType).includes('librarian')) return true;
      if (Array.isArray(user.roles) && user.roles.some(r => normalize(r).includes('librarian'))) return true;
      if (user.isAdmin === true || user.isLibrarian === true) return true;
      return JSON.stringify(user).toLowerCase().includes('librarian');
    } catch (e) {
      return false;
    }
  })();

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Title</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ISBN</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Available</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b._id || b.isbn || b.id} className="border-t">
              <td className="px-4 py-3 text-sm text-gray-800">{b.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{b.isbn}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{b.quantity ?? b.total ?? 0}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{b.availableBooks ?? b.available ?? 0}</td>
              <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-3">
                {isLibrarian && (
                  <>
                    <button onClick={() => handleEdit(b.isbn)} title="Edit" className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(b.isbn)} title="Delete" className="text-red-600 hover:text-red-800">Delete</button>
                  </>
                )}
                {isBorrower && (
                  <>
                    <button onClick={() => handleBorrow(b)} title="Borrow" className="ml-2 rounded px-2 py-1 text-white bg-green-600 hover:bg-green-700">Borrow</button>
                    <button onClick={() => handleReturn(b)} title="Return" className="ml-2 rounded px-2 py-1 text-white bg-yellow-500 hover:bg-yellow-600">Return</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
