import { useContext } from "react";
import { AppContext } from "./AppContext";

function Favorites() {
    const { user, questions, toggleFavorite } = useContext(AppContext);
    if (!user) {
        return <p data-testid="login-message">Please log in to see your favorites.</p>;
    }

    
    const favoriteQuestions = questions.filter((q) => user.favorite.includes(q.id));

    return (
        <div className="container mt-4 min-vh-100">
            <h2>Bookmarked Questions</h2>
            {favoriteQuestions.length > 0 ? (
                favoriteQuestions.map((q) => (
                    <div key={q.id} className="card mt-3" data-testid={`favorite-question-${q.id}`}>
                
                        <div className="card-body">
                            <h4 className="card-title">{q.question_title}</h4>
                            <p className="card-text">{q.question_description}</p>

                            {/* Unfavorite Button */}
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => toggleFavorite(q.id)}
                                data-testid={`unfavorite-button-${q.id}`}
                            >
                                ⭐ Unfavorite
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p data-testid="no-favorites-message">No bookmarked questions yet.</p>
            )}
        </div>
    );
}

export default Favorites;