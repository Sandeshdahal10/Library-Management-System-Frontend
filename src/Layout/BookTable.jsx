import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * BookTable
 * A reusable table component showing a list of books with actions.
 * Props:
 *  - books: optional initial array of book objects. Each book may contain
 *    fields like _id, id, isbn, title, author, quantity/total, availableBooks/available.
 *
 * Behavior:
 *  - If `books` prop is empty/absent, fetches from the public GET /api/books.
 *  - Shows different action buttons depending on user role (borrower or librarian).
 *  - Provides local updates after borrow/return/delete/edit to keep UI responsive.
 */

export default function BookTable({ books: initialBooks }) {
  const auth = useAuth();
  const token = auth?.token ?? localStorage.getItem('token');
  const user = auth?.user ?? (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch(e){ return null; }
  })();
  const [books, setBooks] = React.useState(initialBooks ?? []);
  const [loading, setLoading] = React.useState(!Array.isArray(initialBooks) || initialBooks.length === 0);
  const [error, setError] = React.useState(null);
  const [modelForm, setModelForm] = React.useState(false);
  const [editingBook, setEditingBook] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});

  /**
   * Load books on mount when no initialBooks prop is supplied.
   * Uses a mounted flag to avoid state updates after unmount.
   */
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
        const res = await axios.get('https://library-management-system-boo3.onrender.com/api/books');
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

  /**
   * Delete a book by ISBN.
   * - isbn: string identifier for the book to delete.
   * Side effects: shows confirmation, calls DELETE API, updates local state and toasts.
   */
  const handleDelete = async (isbn) => {
    if (!isbn) return toast.error('Missing ISBN');
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`https://library-management-system-boo3.onrender.com/api/books/${encodeURIComponent(isbn)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setBooks((s) => s.filter(b => (b.isbn || b.ISBN) !== isbn));
      toast.success('Book deleted');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to delete';
      toast.error(msg);
    }
  };

  /**
   * Open the edit modal and seed the edit form for the given book.
   * - book: book object to edit.
   */
  const handleOpenEdit = (book) => {
    if (!book) return toast.error('Missing book');
    setEditingBook(book);
    setEditForm({
      title: book.title || '',
      author: book.author || '',
      quantity: book.quantity ?? book.total ?? 0,
      availableBooks: book.availableBooks ?? book.available ?? 0,
    });
    setModelForm(true);
  };

  /**
   * Save the currently editing book.
   * Calls PUT /api/books/:isbn and updates local books list on success.
   */
  const handleSaveEdit = async (e) => {
    e?.preventDefault?.();
    if (!editingBook) return toast.error('Nothing to edit');
    const isbn = editingBook.isbn || editingBook.ISBN;
    if (!isbn) return toast.error('Missing ISBN');
    try {
      const payload = {
        title: editForm.title,
        author: editForm.author,
        quantity: Number(editForm.quantity) || 0,
        availableBooks: Number(editForm.availableBooks) || 0,
      };
      const res = await axios.put(`https://library-management-system-boo3.onrender.com/api/books/${encodeURIComponent(isbn)}`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const updated = res.data?.book || res.data || { ...editingBook, ...payload };
      setBooks((s) => s.map(b => ((b.isbn || b.ISBN) === isbn ? updated : b)));
      toast.success('Book updated');
      setModelForm(false);
      setEditingBook(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to update';
      toast.error(msg);
      console.error('Edit save error', err);
    }
  };

  /**
   * Borrow a book for the current authenticated user.
   * Calls POST /api/borrow and decrements availableBooks locally on success.
   */
  const handleBorrow = async (book) => {
    const bookId = book._id || book.id || book.bookId;
    if (!bookId) return toast.error('Missing book id for borrow');
    try {
      const res = await axios.post('https://library-management-system-boo3.onrender.com/api/borrow', { bookId }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      toast.success(res?.data?.message || 'Borrowed');
      // update available locally
      setBooks((s) => s.map(b => ((b._id === bookId || b.id === bookId) ? { ...b, availableBooks: (b.availableBooks ?? b.available ?? 0) - 1 } : b)));
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to borrow';
      toast.error(msg);
    }
  };

  /**
   * Return a previously borrowed book for the current user.
   * - book: book object to return. The function fetches the user's borrow
   *   history, finds the active borrow record for this book and calls the return endpoint.
   */
  const handleReturn = async (book) => {
    // Find the borrow record id for this user & book then call POST /api/borrow/return/:borrowId
    try {
      const bookId = book._id || book.id || (book.bookId && (book.bookId._id || book.bookId.id)) || null;
      const hdrs = token ? { Authorization: `Bearer ${token}` } : {};

      // Get borrow history for current user
      const res = await axios.get('https://library-management-system-boo3.onrender.com/api/borrow/history', { headers: hdrs });
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

      const url = `https://library-management-system-boo3.onrender.com/api/borrow/return/${encodeURIComponent(borrowId)}`;
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

  // role detection helpers 
  /**
   * Tries multiple common property names and structures to detect borrower role.
   */
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

  /**
   * Tries multiple common property names and structures to detect librarian/admin role.
   */
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
    <>
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
                    <button onClick={() => handleOpenEdit(b)} title="Edit" className="text-blue-600 hover:text-blue-800">Edit</button>
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
    {modelForm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-lg rounded bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Edit Book</h3>
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
            <div>
              <label className="block text-sm text-gray-700">Title</label>
              <input value={editForm.title} onChange={(e) => setEditForm((s) => ({ ...s, title: e.target.value }))} className="mt-1 w-full rounded border-gray-300 p-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Author</label>
              <input value={editForm.author} onChange={(e) => setEditForm((s) => ({ ...s, author: e.target.value }))} className="mt-1 w-full rounded border-gray-300 p-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700">Quantity</label>
                <input type="number" value={editForm.quantity} onChange={(e) => setEditForm((s) => ({ ...s, quantity: e.target.value }))} className="mt-1 w-full rounded border-gray-300 p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Available</label>
                <input type="number" value={editForm.availableBooks} onChange={(e) => setEditForm((s) => ({ ...s, availableBooks: e.target.value }))} className="mt-1 w-full rounded border-gray-300 p-2" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button type="button" onClick={() => { setModelForm(false); setEditingBook(null); }} className="rounded border px-3 py-1">Cancel</button>
              <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-white">Save</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}
