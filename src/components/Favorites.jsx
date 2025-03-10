import { useState, useEffect } from "react";

function Favorites() {
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
    <div>
      <h2>Bookmarked Questions</h2>
      {favorites.length > 0 ? (
        favorites.map((id) => <p key={id}>Question {id}</p>)
      ) : (
        <p>No bookmarks yet.</p>
      )}

      {/* Example Button to toggle Favorite (Heres where I replace "toggleFavorite(1)" with the actual question id) */}
      <button onClick={() => toggleFavorite(1)}>Toggle Favorite for Q1</button>
    </div>
  );
}

export default Favorites;
