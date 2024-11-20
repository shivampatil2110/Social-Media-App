import React, { useState } from "react";
import { supabase } from "../config/supabase";
import Navbar from "./Navbar";
import Cookies from "js-cookie";

const CreatePost: React.FC = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image to Supabase storage
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
      const { error: insertError } = await supabase.from("posts").insert({
        content,
        image: url,
        author_id: authorId,
      });

      if (insertError) throw insertError;

      alert("Post created successfully!");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">Create Post</h1>
        <form
          onSubmit={handlePostSubmit}
          className="max-w-md mx-auto bg-white p-4 shadow rounded"
        >
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Post Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Upload Image
            </label>
            <input
              type="file"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
