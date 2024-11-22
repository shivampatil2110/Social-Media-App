import React, { useState } from "react";
import { supabase } from "../config/supabase";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { client } from "../config/supabase";

const CREATE_POST = gql`
  mutation CreatePost($content: String!, $image: String, $author_id: String!) {
    insertIntopostsCollection(
      objects: { content: $content, image: $image, author_id: $author_id }
    ) {
      records {
        id
        content
        image
        author_id
        created_at
      }
    }
  }
`;

const CreatePost: React.FC = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authorId = Cookies.get("user_id");
      let imageUrl = null;
      if (image) {
        const { data, error } = await supabase.storage
          .from("images")
          .upload(`public/${Date.now()}_${image.name}`, image);

        if (error) throw error;
        imageUrl = supabase.storage.from("images").getPublicUrl(data.path);
      }
      let url = imageUrl?.data.publicUrl;
      // Insert post into the database

      const { data, errors: insertError } = await client.mutate({
        mutation: CREATE_POST,
        variables: {
          content,
          image: url || null,
          author_id: authorId,
        },
      });

      if (insertError) {
        throw insertError;
      }
      toast.success("Post created successfully!");
      setContent("");
      setImage(null);
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Post
          </h1>
          <form onSubmit={handlePostSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-400"
                rows={4}
                placeholder="What's on your mind?"
                required
              ></textarea>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                className="w-full px-4 py-3 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-sm font-bold text-white rounded-lg shadow-md focus:outline-none ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 focus:ring focus:ring-green-300"
              }`}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
