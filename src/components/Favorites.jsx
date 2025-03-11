import { useState, useEffect, useContext } from "react";
import { QuestionsContext } from "./QuestionsContext";

function Favorites() {
  const { questions } = useContext(QuestionsContext); // ✅ Fetch questions from context
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

  // Filter only favorited questions
  const favoriteQuestions = questions.filter(q => favorites.includes(q.id));

  return (
    <div className="container mt-4">
      <h2>Bookmarked Questions</h2>
      {favoriteQuestions.length > 0 ? (
        favoriteQuestions.map((q) => (
          <div key={q.id} className="card mt-3">
            <div className="card-body">
              <h4 className="card-title">{q.question_title}</h4>
              <p className="card-text">{q.question_description}</p>
              
              {/* Unfavorite Button */}
              <button 
                className="btn btn-outline-danger"
                onClick={() => toggleFavorite(q.id)}
              >
                ⭐ Unfavorite
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No bookmarked questions yet.</p>
      )}
    </div>
  );
}

export default Favorites;
