import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from './AppContext';
import { getBadge } from './BadgeReputation'; 

const QuestionsList = () => {
  const { questions } = useContext(AppContext);
  const navigate = useNavigate();
  
  // State to track favorited questions
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
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

  const formRedirect = () => {
    navigate('/ask');
  };

  return (
    <>
      <div className="container mt-2  min-vh-100" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Questions List</h2>
          <button onClick={formRedirect} className="btn btn-primary">
            Ask a Question
          </button>
        </div>
        {questions.map((question) => (
          <div key={question.id} className="card mt-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/answer/${question.id}`)}>
            <div className="card-body">
              <h4 className="card-title" style={{ textAlign: 'justify' }}>{question.question_title}</h4>
              <p className="card-text" style={{ textAlign: 'justify' }}>
                {question.question_description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="container mt-4" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Questions List</h2>
            <button onClick={formRedirect} className="btn btn-primary">
                Ask a Question
            </button>
        </div>
        {questions.map((question) => (
            <div key={question.id} className="card mt-3">
                <div className="card-body">
                    {/* Display username with badge */}
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>
                            {question.username} 
                            <span className="badge bg-secondary ms-2">
                                {getBadge(question.upvotes)}
                            </span>
                        </h5>
                    </div>
                    <h4 className="card-title" style={{ textAlign: 'justify' }}>{question.question_title}</h4>
                    <p className="card-text" style={{ textAlign: 'justify' }}>
                        {question.question_description}
                    </p>
                    
                    {/* Favorite Button */}
                    <button 
                        className="btn btn-outline-warning"
                        onClick={() => toggleFavorite(question.id)}
                    >
                        {favorites.includes(question.id) ? "⭐ Unfavorite" : "☆ Favorite"}
                    </button>
                </div>
            </div>
        ))}
      </div>
    </>
  );
};

export default QuestionsList;
