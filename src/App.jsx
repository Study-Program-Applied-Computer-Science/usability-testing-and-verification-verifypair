import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Answer from './components/Answer';
import Layout from './Layout';

function App() {
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

  // Favorite (Bookmark) Feature
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Toggle favorite (add/remove question ID)
  const toggleFavorite = (questionId) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.includes(questionId)
        ? prev.filter((id) => id !== questionId) // Remove if exists
        : [...prev, questionId]; // Add if not exists
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <BrowserRouter>
      <Layout>
        <h1>Welcome, {user.username}</h1>
        <p>Reputation: {user.upvotesReceived} upvotes</p>
        <p>Badge: {getBadge(user.upvotesReceived)}</p>
        <button onClick={handleUpvote}>Upvote</button>

        {/* Bookmarks Section */}
        <h2>Bookmarked Questions</h2>
        {favorites.length > 0 ? (
          favorites.map((id) => <p key={id}>Question {id}</p>)
        ) : (
          <p>No bookmarks yet.</p>
        )}

        {/* Example Button to Toggle Favorite (Replace with actual question list) */}
        <button onClick={() => toggleFavorite(1)}>Toggle Favorite for Q1</button>

        <Routes>
          <Route path="/" element={<>TEst</>} />
          <Route path="/answer" element={<Answer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;