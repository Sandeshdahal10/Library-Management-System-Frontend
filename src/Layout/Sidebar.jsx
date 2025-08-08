// import { FaBookOpen } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { MdHistory } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineQueryStats } from "react-icons/md";
import { Link,useLocation } from "react-router-dom";
export default function Sidebar(){
  return(
    <>
    <div className="w-64 border-r shadow-md p-4 min-h-screen bg-primary">
      <nav className="flex flex-col gap-4 text-gray-400">
        <SidebarItems>
          icon={<ImBooks />}
          label="Manage books"
        </SidebarItems>
        <SidebarItems>
          icon={<MdHistory />}
          label="Borrow records"
        </SidebarItems>
        <SidebarItems>
          icon={<CiCirclePlus />}
          label="Add new book"
        </SidebarItems>
        <SidebarItems>
          icon={<MdOutlineQueryStats />}
          label="Stats"
        </SidebarItems>
       
      </nav>
    </div>
    </>
  )
}

const SidebarItems = ({ icon, label, to }) => {
    const location = useLocation();
    const active = location.pathname === to;
    const baseclass = "flex items-center  gap-2 py-2 px-2  text-black";
    const activeClass = active ? "bg-black text-primary rounded" : "bg-none";
    return (
        <Link to={to} className="cursor-pointer text-2xl">
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
};