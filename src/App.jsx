import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Librarian/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Book from "./pages/Librarian/Book";
import Borrowers from "./pages/Librarian/Borrowers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/librarian" element={<Dashboard />} />
        <Route path="/librarian/books" element={<Book />} />
        <Route path="/librarian/borrowers" element={<Borrowers />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="dark"
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
