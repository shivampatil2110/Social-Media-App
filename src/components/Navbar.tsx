import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../utils/LogoutButton";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/feed" className="font-bold text-xl">
          SocialApp
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`flex flex-col md:flex-row md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-500 md:bg-transparent transition-transform transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Link
            to="/feed"
            className="block py-2 px-4 md:py-0 hover:underline text-center md:text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            News Feed
          </Link>
          <Link
            to="/create-post"
            className="block py-2 px-4 md:py-0 hover:underline text-center md:text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Post
          </Link>
          <Link
            to="/profile"
            className="block py-2 px-4 md:py-0 hover:underline text-center md:text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/users-to-follow"
            className="block py-2 px-4 md:py-0 hover:underline text-center md:text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Users to Follow
          </Link>
          <div
            className="block py-2 px-4 md:py-0 text-center md:text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
