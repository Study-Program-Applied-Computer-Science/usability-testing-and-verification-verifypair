import { useContext } from "react";
import { AppContext } from "./AppContext";

function Favorites() {
    const { user, questions, toggleFavorite } = useContext(AppContext);
    if (!user) {
        return <p>Please log in to see your favorites.</p>;
    }

    // Filter only favorited questions
    const favoriteQuestions = questions.filter((q) => user.favorite.includes(q.id));

    return (
        <div className="container mt-4 min-vh-100">
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