import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import { getBadge } from "./BadgeReputation";

const QuestionsList = () => {
  const { questions, user, toggleFavorite } = useContext(AppContext);
  const navigate = useNavigate();

  const formRedirect = () => {
    navigate('/ask');
  };

  if (!questions) return <p>Loading questions...</p>;

  return (
    <div className="container mt-4 min-vh-100" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Questions List</h2>
        <button onClick={formRedirect} className="btn btn-primary">
          Ask a Question
        </button>
      </div>

      {questions.map((question) => (
        <div key={question.id} className="card mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5>
                {question.username}{" "}
                <span className="badge bg-secondary ms-2">
                  {getBadge(question.upvotes)}
                </span>
              </h5>
            </div>
            <h4 className="card-title" style={{ textAlign: "justify" }}>
              {question.question_title}
            </h4>
            <p className="card-text" style={{ textAlign: "justify" }}>
              {question.question_description}
            </p>
            <div className="d-flex justify-content-between">
              {user && (
                <button
                  className={`btn ${user.favorite.includes(question.id)
                    ? "btn-warning"
                    : "btn-outline-warning"
                    }`}
                  onClick={() => toggleFavorite(question.id)}
                >
                  {user.favorite.includes(question.id) ? "⭐ Unfavorite" : "☆ Favorite"}
                </button>
              )}

              {/* Answer Button */}
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(`/answer/${question.id}`)}
              >
                ✍ Answer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;