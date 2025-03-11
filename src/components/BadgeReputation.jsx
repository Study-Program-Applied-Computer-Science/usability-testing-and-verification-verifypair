import { useState } from "react";

// Exported getBadge function to be used in other components
export const getBadge = (upvotes) => {
  if (upvotes >= 200) return "💎 Diamond";
  if (upvotes >= 100) return "🏆 Platinum";
  if (upvotes >= 50) return "🥇 Gold";
  if (upvotes >= 25) return "🥈 Silver";
  if (upvotes >= 10) return "🥉 Bronze";
  return "🚀 Newbie";
};

function Reputation() {
  const [user, setUser] = useState({
    username: "johndoe",
    upvotesReceived: 20,
  });

  // This is basically for handling upvotes for when user clicks "upvote" since idk how you did it
  const handleUpvote = () => {
    setUser((prevUser) => ({
      ...prevUser,
      upvotesReceived: prevUser.upvotesReceived + 1,
    }));
  };

  return (
    <div className="container mt-4">
      <h1>Welcome, {user.username}</h1>
      <p>Reputation: {user.upvotesReceived} upvotes</p>
      <p>Badge: <span className="badge bg-secondary">{getBadge(user.upvotesReceived)}</span></p>
      <button className="btn btn-primary" onClick={handleUpvote}>Upvote</button>
    </div>
  );
}

export default Reputation;
