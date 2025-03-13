import { useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";


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
        if (user && questions?.length) {
            let upvotes = 0;

            questions.forEach(question => {
                question.answers?.forEach(answer => {
                    if (answer.username === user.username) {
                        upvotes += answer.vote?.upvote?.length || 0;
                    }
                });
            });

            setTotalUpvotes(upvotes);
        }
    }, [user, questions]);

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center p-5 border rounded shadow bg-light w-100" style={{ maxWidth: "900px" }}>
                <h1 className="fw-bold">Welcome, {user?.username || "Guest"}</h1>
                <hr className="my-3" />
                <p className="fs-4 text-muted">Reputation Level</p>
                <p className="display-4 fw-bold">
                    <span className="badge bg-primary p-4">{getBadge(totalUpvotes)}</span>
                </p>
                <p className="fs-5">Total Upvotes: <strong>{totalUpvotes}</strong></p>
            </div>
        </div>
    );

};

export default BadgeReputation;