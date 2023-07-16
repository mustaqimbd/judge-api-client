import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const Layout = () => {
    const {user}=useContext(AuthContext)
  return (
    <div className="container mx-auto">
        <nav>
            <ul className="flex justify-between">
                <li className="font-bold text-lg py-1 px-2"><Link to='/'>Home</Link></li>
                <li className="text-lg font-bold"> {user?.displayName}</li>
                <li className="font-bold text-lg bg-gray-500 hover:bg-gray-700 text-white py-1 px-2"><Link to='/login'>Login</Link></li>
            </ul>
        </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
