import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { supabase } from "../config/supabase";
import Navbar from "./Navbar";

interface Post {
  id: string;
  content: string;
  image: string | null;
  created_at: string;
}

const UserProfile: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      const authorId = Cookies.get("user_id");
      if (!authorId) {
        throw new Error("User not logged in");
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", authorId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error.message);
        return;
      }

      setPosts(data || []);
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="bg-white shadow rounded p-6 mb-6">
        <h1 className="text-2xl font-bold">{"dflkmnds"}</h1>
        <p className="text-gray-600">{"oijsg"}</p>
        <div className="flex space-x-6 mt-4">
          <div>
            <span className="block text-xl font-bold">{"51"}</span>
            <span className="text-gray-500">Followers</span>
          </div>
          <div>
            <span className="block text-xl font-bold">{"51"}</span>
            <span className="text-gray-500">Following</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">Your Posts</h1>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">
              You haven't created any posts yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <p className="text-gray-700 p-4">{post.content}</p>
                  {post.image && (
                    <div className="relative w-full h-64">
                      <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={post.image}
                        alt="Post"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2 p-4">
                    Posted on {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
