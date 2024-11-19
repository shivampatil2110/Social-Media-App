import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../utils/LogoutButton";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="flex justify-between max-w-4xl mx-auto">
        <Link to="/feed" className="font-bold text-lg">
          SocialApp
        </Link>
        <div className="space-x-4">
          <Link to="/feed" className="hover:underline">
            News Feed
          </Link>
          <Link to="/create-post" className="hover:underline">
            Create Post
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
