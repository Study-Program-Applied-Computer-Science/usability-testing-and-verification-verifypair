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
        <div className="container mt-4 min-vh-100">
            <h2>Welcome, {user?.username}</h2>
            <p>Total Reputation: {totalUpvotes} upvotes</p>
            <p>Badge: <span className="badge bg-secondary">{getBadge(totalUpvotes)}</span></p>
        </div>
    );
};

export default BadgeReputation;
