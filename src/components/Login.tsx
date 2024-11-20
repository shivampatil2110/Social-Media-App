import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let res = await signInWithEmailAndPassword(auth, email, password);
      Cookies.set("user_id", res.user.uid, { expires: 7 });
      navigate("/feed");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="w-96 p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log In
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="to-blue-600">SignUp</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
