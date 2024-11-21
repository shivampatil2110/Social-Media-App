import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import NewsFeed from "./components/NewsFeed";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./utils/ProtectedRoute";
import Signup from "./components/Signup";
import UsersToFollow from "./components/UsersToFollow";
import Snackbar from "./utils/Snackbar";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { client } from "./config/supabase";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <NewsFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users-to-follow"
              element={
                <ProtectedRoute>
                  <UsersToFollow />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Snackbar />
      </Router>
    </ApolloProvider>
  );
};

export default App;
