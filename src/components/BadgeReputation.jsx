import { useState } from "react";

function Reputation() {
  const [user, setUser] = useState({
    username: "johndoe",
    upvotesReceived: 20,
  });

  // Badge determination based on total number of votes on a user's profile
  const getBadge = (upvotes) => {
    if (upvotes >= 200) return "💎 Diamond";
    if (upvotes >= 100) return "🏆 Platinum";
    if (upvotes >= 50) return "🥇 Gold";
    if (upvotes >= 25) return "🥈 Silver";
    if (upvotes >= 10) return "🥉 Bronze";
    return "🚀 Newbie";
  };

  // This is basically for handling upvotes for when user clicks "upvote" since idk how you did it
  const handleUpvote = () => {
    setUser((prevUser) => ({
      ...prevUser,
      upvotesReceived: prevUser.upvotesReceived + 1,
    }));
  };

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Reputation: {user.upvotesReceived} upvotes</p>
      <p>Badge: {getBadge(user.upvotesReceived)}</p>
      <button onClick={handleUpvote}>Upvote</button>
    </div>
  );
}

export default Reputation;
