import { useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";

// ✅ Function to determine badge based on upvotes
export const getBadge = (upvotes) => {
  if (upvotes >= 200) return "💎 Diamond";
  if (upvotes >= 100) return "🏆 Platinum";
  if (upvotes >= 50) return "🥇 Gold";
  if (upvotes >= 25) return "🥈 Silver";
  if (upvotes >= 10) return "🥉 Bronze";
  return "🚀 Newbie";
};

const BadgeReputation = () => {
    const { user, questions } = useContext(AppContext);
    const [totalUpvotes, setTotalUpvotes] = useState(0);

    useEffect(() => {
        if (user && questions?.length) {  // ✅ Prevents errors if questions are empty
            let upvotes = 0;

            questions.forEach(question => {
                question.answers?.forEach(answer => {  // ✅ Prevents errors if answers are missing
                    if (answer.username === user.username) {
                        upvotes += answer.vote?.upvote?.length || 0; // ✅ Ensures no errors if vote array is missing
                    }
                });
            });

            setTotalUpvotes(upvotes);
        }
    }, [user, questions]);

    return (
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="card shadow-lg p-5 text-center">
          <h1 className="mb-3">Welcome, <span className="fw-bold">{user?.username}</span></h1>
          <h2 className="badge bg-secondary p-3 mt-3">{getBadge(totalUpvotes)}</h2>
          <h3 className="text-primary mt-3">Total Upvotes: <span className="fw-bold">{totalUpvotes}</span></h3>
        </div>
      </div>
    );
    
};

export default BadgeReputation;
