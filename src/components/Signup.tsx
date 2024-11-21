import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { supabase } from "../config/supabase";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";
import { gql } from "@apollo/client";
import { client } from "../config/supabase";

const INSERT_USER = gql`
  mutation InsertUser(
    $userId: String!
    $username: String!
    $profile_picture: String!
  ) {
    insertIntousersCollection(
      objects: {
        userId: $userId
        username: $username
        profile_picture: $profile_picture
      }
    ) {
      records {
        id
        username
        profile_picture
      }
    }
  }
`;

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await createUserWithEmailAndPassword(auth, email, password);
      Cookies.set("user_id", res.user.uid, { expires: 7 });
      let imageUrl = null;
      if (image) {
        const { data, error } = await supabase.storage
          .from("profile_picture")
          .upload(`public/${res.user.uid}_${image.name}`, image);

        if (error) throw error;
        imageUrl = supabase.storage
          .from("profile_picture")
          .getPublicUrl(data.path);
      }
      let url = imageUrl?.data.publicUrl;

      const { data, errors: insertError } = await client.mutate({
        mutation: INSERT_USER,
        variables: {
          userId: res.user.uid,
          username: username,
          profile_picture: url,
        },
      });

      if (insertError) throw insertError;

      toast.success("Account Created Successfully");
      navigate("/feed");
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error("An issue occured when creating account");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <FaUserPlus className="text-green-500 text-6xl mb-3" />
            <h2 className="text-3xl font-extrabold text-green-700">
              Create Account
            </h2>
            <p className="text-sm text-gray-600">Join us today!</p>
          </div>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-400 focus:border-green-400"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-400 focus:border-green-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-400 focus:border-green-400"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-2 text-sm font-bold text-white rounded-lg shadow-md focus:outline-none ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 focus:ring focus:ring-green-300"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium text-green-500 hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
