import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AddBookButton({ onClick }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    isbn: "",
    totalQuantity: "",
    author: "",
  });

  const handleClick = () => {
    if (onClick) return onClick();
    setOpen(true);
  };

  const close = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit; wire to API later
    console.log("Submitting book:", form);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
      >
        <FaPlus /> Add Book
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-book-title"
        >
          <div className="absolute inset-0 bg-black/40" onClick={close} />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="add-book-title"
                className="text-lg font-semibold text-gray-900"
              >
                Add a new book
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Book Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. The Pragmatic Programmer"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="isbn"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  ISBN
                </label>
                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={form.isbn}
                  onChange={handleChange}
                  placeholder="e.g. 978-0135957059"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="totalQuantity"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Total Quantity
                </label>
                <input
                  id="totalQuantity"
                  name="totalQuantity"
                  type="number"
                  min="0"
                  value={form.totalQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="e.g. Andy Hunt, Dave Thomas"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
