import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Account created successfully");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="w-96 p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Sign Up
            </button>
          </form>
          <p>
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
