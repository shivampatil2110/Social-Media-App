import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "./Navbar";
import Spinner from "../utils/Spinner";
import { toast } from "react-toastify";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

// GraphQL Queries and Mutations
const GET_ALL_USERS = gql`
  query GetAllUsers {
    usersCollection {
      edges {
        node {
          id
          username
          profile_picture
          userId
        }
      }
    }
  }
`;

const GET_FOLLOWED_USERS = gql`
  query GetFollowedUsers($followerId: String!) {
    followsCollection(filter: { follower_id: { eq: $followerId } }) {
      edges {
        node {
          following_id
        }
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($followerId: String!, $followingId: String!) {
    insertIntofollowsCollection(
      objects: { follower_id: $followerId, following_id: $followingId }
    ) {
      records {
        id
      }
    }
  }
`;

const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerId: String!, $followingId: String!) {
    deleteFromfollowsCollection(
      filter: {
        follower_id: { eq: $followerId }
        following_id: { eq: $followingId }
      }
    ) {
      affectedCount
    }
  }
`;

interface User {
  id: string;
  username: string;
  profile_picture?: string;
  userId: string;
  isFollowed: boolean;
}

const UsersToFollow: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = Cookies.get("user_id");

  const [getAllUsers, { data: allUsersData, loading: allUsersLoading }] =
    useLazyQuery(GET_ALL_USERS, { fetchPolicy: "cache-and-network" });
  const [getFollowedUsers, { data: followedUsersData }] = useLazyQuery(
    GET_FOLLOWED_USERS,
    { fetchPolicy: "cache-and-network" }
  );
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  // Fetch users and their follow status
  const fetchUsersWithFollowStatus = async () => {
    try {
      if (!currentUserId) {
        throw new Error("User not logged in");
      }

      // Fetch all users
      getAllUsers();

      // Fetch followed users
      getFollowedUsers({ variables: { followerId: currentUserId } });

      if (allUsersData && followedUsersData) {
        const allUsers = allUsersData.usersCollection.edges.map(
          (edge: any) => edge.node
        );
        const followedIds = followedUsersData.followsCollection.edges.map(
          (edge: any) => edge.node.following_id
        );

        const usersWithStatus = allUsers
          .filter((user: any) => user.userId !== currentUserId)
          .map((user: any) => ({
            ...user,
            isFollowed: followedIds.includes(user.userId),
          }));

        setUsers(usersWithStatus);
      }
    } catch (error: any) {
      toast.error("Error fetching users and follow status");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (followingId: string) => {
    try {
      await followUser({
        variables: { followerId: currentUserId, followingId },
      });
      toast.success("User followed successfully!");
      fetchUsersWithFollowStatus();
    } catch (error) {
      toast.error("Error following user");
    }
  };

  const handleUnfollow = async (followingId: string) => {
    try {
      await unfollowUser({
        variables: { followerId: currentUserId, followingId },
      });
      toast.success("User unfollowed successfully!");
      fetchUsersWithFollowStatus();
    } catch (error) {
      toast.error("Error unfollowing user");
    }
  };

  useEffect(() => {
    fetchUsersWithFollowStatus();
  }, [allUsersData, followedUsersData]);

  if (loading || allUsersLoading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Users
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No users found!
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                <img
                  src={user.profile_picture || "/default-profile.png"}
                  alt={`${user.username}'s profile`}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover mb-4"
                />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {user.username}
                  </p>
                </div>
                {user.isFollowed ? (
                  <button
                    onClick={() => handleUnfollow(user.userId)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(user.userId)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600"
                  >
                    Follow
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default UsersToFollow;
