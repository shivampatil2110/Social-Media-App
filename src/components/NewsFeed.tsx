import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { supabase } from "../config/supabase";
import Navbar from "./Navbar";
import Spinner from "../utils/Spinner";

interface Post {
  id: string;
  content: string;
  image: string | null;
  author_id: string;
  created_at: string;
}

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const POSTS_PER_PAGE = 5;
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch posts with pagination
  const fetchFeed = async (page: number) => {
    try {
      const currentUserId = Cookies.get("user_id");
      if (!currentUserId) {
        throw new Error("User not logged in");
      }

      const { data, error } = await supabase.rpc("get_followed_posts", {
        current_user_id: currentUserId,
        limit_param: POSTS_PER_PAGE,
        off_offset: page * POSTS_PER_PAGE,
      });

      if (error) {
        console.error("Error fetching feed:", error.message);
        return;
      }

      // Append new posts to the list
      if (data && data.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setHasMore(data.length === POSTS_PER_PAGE); // If less than limit, no more posts
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // callback to load more posts
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const loadMorePosts = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(loadMorePosts, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (lastPostRef.current) observer.current.observe(lastPostRef.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [posts, hasMore]);

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">News Feed</h1>
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              ref={index === posts.length - 1 ? lastPostRef : null}
              key={post.id}
              className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-4"
            >
              {post.image ? (
                <img
                  className="w-full object-cover"
                  src={post.image}
                  alt="Post"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200"></div>
              )}

              <div className="p-4">
                <span className="font-semibold text-gray-900">
                  {post.content}
                </span>
              </div>
            </div>
          ))}

          {loading && <Spinner />}
          {!hasMore && (
            <p className="text-center text-gray-500">No more posts</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsFeed;
