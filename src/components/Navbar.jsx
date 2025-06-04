import { useContext, useState } from "react";
import { Home, Users, FileText, CalendarCheck, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { AppContext } from "../context/AppContext";
import { LogIn } from "lucide-react";


// Nav Item Component for Reusability
const NavItem = ({ to, icon, label, setIsOpen }) => (
  <Link
    to={to}
    onClick={() => (setIsOpen ? setIsOpen(prev => !prev) : null)}
    className="flex items-center gap-2 px-4 py-2 hover:text-slate-400 font-medium text-sm transition"
  >
    {icon} {label}
  </Link>
);



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { adminData, isAuthenticated } = useContext(AppContext);


  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-20">
      {
        adminData
          ?
          <div>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              {/* Logo */}
              <Link to='/' className='text-4xl w-20 h-20'>
                <img src="/logo6.png" className='w-16' alt="" />
                <p className="text-xs font-medium">Admin Panel</p>
              </Link>

              {/* Desktop Nav */}
              {
                isAuthenticated
                &&
                <ul className="hidden md:flex space-x-6 items-center">
                  <NavItem to="/" icon={<Home size={20} />} label="Home" />
                  <NavItem to="/submitted-forms" icon={<FileText size={20} />} label="Form Submitted" />
                  <NavItem to="/free-sessions" icon={<CalendarCheck size={20} />} label="Free Session" />
                  <NavItem to="/all-users" icon={<Users size={20} />} label="All Users" />
                </ul>
              }
              <Logout className={"hidden md:flex"} setIsOpen={setIsOpen} />


              <button className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
              <div className="md:hidden flex flex-col py-4">
                {
                  isAuthenticated
                  &&
                  <ul className="flex flex-col space-y-2 border-t border-gray-700">
                    <NavItem setIsOpen={setIsOpen} to="/" icon={<Home size={20} />} label="Home" />
                    <NavItem setIsOpen={setIsOpen} to="/all-users" icon={<Users size={20} />} label="All Users" />
                    <NavItem setIsOpen={setIsOpen} to="/submitted-forms" icon={<FileText size={20} />} label="Form Submitted" />
                    <NavItem setIsOpen={setIsOpen} to="/free-sessions" icon={<CalendarCheck size={20} />} label="Free Session" />
                    <NavItem setIsOpen={setIsOpen} to="/login" icon={<CalendarCheck size={20} />} label="Login" />
                  </ul>
                }
                <Logout className={"flex mx-4"} setIsOpen={setIsOpen} />
              </div>
            )}
          </div>

          :

          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to='/' className='text-4xl w-20 h-20'>
              <img src="/logo6.png" className='w-16' alt="" />
              <p className="text-xs font-medium">Admin Panel</p>
            </Link>
            <Link to={"/login"} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition cursor-pointer">
              Login
              <LogIn size={20} />
            </Link>
          </div>
      }
    </nav>
  );
};


export default Navbar;
