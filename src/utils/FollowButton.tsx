import React, { useState } from 'react';

interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`py-2 px-4 rounded ${
        isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
      } text-white`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
