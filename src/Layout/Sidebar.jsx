import { ImBooks } from "react-icons/im";
import { MdHistory } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineQueryStats } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
export default function Sidebar() {
  return (
    <>
      <div className="w-64 border-r shadow-md p-4 min-h-screen bg-primary">
        <nav className="flex flex-col gap-4 text-white">
          <SidebarItems
            icon={<ImBooks />}
            label="Manage books"
            to="/librarian/managebooks"
          />

          <SidebarItems
            icon={<MdHistory />}
            label="Borrow records"
            to="/librarian/borrow-records"
          />

          <SidebarItems
            icon={<CiCirclePlus />}
            label="Add new book"
            to="/librarian/add-book"
          />

          <SidebarItems
            icon={<MdOutlineQueryStats />}
            label="Stats"
            to="/librarian/stats"
          />
        </nav>
      </div>
    </>
  );
}

const SidebarItems = ({ icon, label, to }) => {
  const location = useLocation();
  const active = location.pathname === to;
  const baseclass = "flex items-center  gap-2 py-4 px-6  ";
  const activeClass = active ? " text-white rounded" : "text-white";
  return (
    <Link
      to={to}
      className={`cursor-pointer text-2xl  ${activeClass} ${baseclass}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
};
