import BookCard from "../../Layout/BookCard";
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import AddBookButton from "../Button";
export default function Book() {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="mt-10 w-full px-4 sm:px-6 lg:px-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-secondary">Book List</h2>
            <AddBookButton />
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <BookCard />
          </div>
        </main>
      </div>
    </>
  );
}
