import React from "react";
import { gql, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import Navbar from "./Navbar";
import defaultProfilePicture from "../img/default_profile_picture.png";
import Spinner from "../utils/Spinner";

// Relay-style GraphQL Queries
const GET_USER = gql`
  query GetUser($userId: String!) {
    usersCollection(filter: { userId: { eq: $userId } }, first: 1) {
      edges {
        node {
          id
          username
          profile_picture
        }
      }
    }
  }
`;

const GET_USER_POSTS = gql`
  query GetUserPosts($userId: String!) {
    postsCollection(
      filter: { author_id: { eq: $userId } }
      orderBy: { created_at: DescNullsLast }
      first: 10
    ) {
      edges {
        node {
          id
          content
          image
          created_at
        }
      }
    }
  }
`;

const GET_USER_STATS = gql`
  query GetUserStats($userId: String!) {
    followers: followsCollection(filter: { following_id: { eq: $userId } }) {
      edges {
        node {
          id
        }
      }
    }
    following: followsCollection(filter: { follower_id: { eq: $userId } }) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const UserProfile: React.FC = () => {
  const userId = Cookies.get("user_id");

  // Fetch User Profile
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  // Fetch User Posts
  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
  } = useQuery(GET_USER_POSTS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  // Fetch User Stats
  const {
    loading: statsLoading,
    error: statsError,
    data: statsData,
  } = useQuery(GET_USER_STATS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  if (userLoading || postsLoading || statsLoading) return <Spinner />;
  if (userError || postsError || statsError) {
    return (
      <p>
        Error:{" "}
        {userError?.message || postsError?.message || statsError?.message}
      </p>
    );
  }

  const user = userData?.usersCollection.edges[0]?.node;
  const posts =
    postsData?.postsCollection.edges.map((edge: any) => edge.node) || [];
  const followersCount = statsData?.followers.edges.length || 0;
  const followingCount = statsData?.following.edges.length || 0;

  return (
    <>
      <Navbar />
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-6">
          <img
            src={user?.profile_picture || defaultProfilePicture}
            alt={user?.username || "Default profile"}
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
          />
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {user?.username || "No Username"}
            </h1>
            <p className="text-sm text-gray-500">
              @{user?.username || "unknown"}
            </p>
          </div>
        </div>
        <div className="flex space-x-10 mt-6">
          <div className="text-center">
            <span className="block text-2xl font-semibold text-gray-800">
              {followersCount}
            </span>
            <span className="text-sm text-gray-500">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-semibold text-gray-800">
              {followingCount}
            </span>
            <span className="text-sm text-gray-500">Following</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Your Posts
        </h1>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <p className="text-gray-700 p-8 text-md">{post.content}</p>
                {post.image && (
                  <img
                    className="w-full h-64 object-cover"
                    src={post.image}
                    alt="Post"
                  />
                )}
                <p className="text-xs text-gray-500 mt-4 p-6">
                  Posted on {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            You haven't created any posts yet.
          </p>
        )}
      </div>
    </>
  );
};

export default UserProfile;
