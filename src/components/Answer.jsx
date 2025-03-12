import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import { getBadge } from './BadgeReputation';

const Answer = () => {
    const { user } = useContext(AppContext);
    const param = useParams();
    const navigate = useNavigate();
    const questionId = param.id;
    const [content, setContent] = useState({});
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3005/question/${questionId}`)
            .then((res) => res.json())
            .then((data) => {
                setContent(data);
                setAnswers(data.answers || []);
            })
            .catch((err) => console.error('Error fetching question:', err));
    }, [questionId]);

    const postAnswer = () => {
        const answerText = document.getElementById('answerText').value.trim();
        if (!answerText || !user) return;

        const newAnswer = {
            id: answers.length ? Math.max(...answers.map(a => a.id)) + 1 : 1,
            username: user.username, // ✅ Fix: Now includes username
            answer: answerText,
            vote: { upvote: [], downvote: [] } // ✅ Fix: Uses arrays for voting
        };

        fetch(`http://localhost:3005/question/${questionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: [...answers, newAnswer] })
        })
            .then((res) => res.json())
            .then((data) => {
                setAnswers(data.answers);
            })
            .catch((err) => console.error('Error posting answer:', err));

        document.getElementById('answerText').value = '';
    };

    const handleVote = (id, voteType) => {
        if (!user) {
            alert('You must be logged in to vote.');
            return;
        }

        setAnswers((prevAnswers) =>
            prevAnswers.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        vote: {
                            ...item.vote,
                            [voteType]: [...item.vote[voteType], user.id] // ✅ Fix: Ensures votes are stored per user
                        }
                    }
                    : item
            )
        );
    };

    return (
        <div className="container mt-4 d-flex flex-column justify-content-start min-vh-100" style={{ overflowY: "auto" }}>
            <div className="mb-4 d-flex justify-content-between align-items-start">
                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i> Back
                </button>
            </div>
            <div className="d-flex flex-column justify-content-between align-items-start p-4 border">
                <h2 className="justify-content-between">{content.question_title}</h2>
                <p style={{ textAlign: 'justify' }}>{content.question_description}</p>
            </div>

            <div className='row'>
                {answers.map((item) => (
                    <div className="card mt-4 p-0" key={item.id}>
                        <div className="card-body">
                            {/* Display username with badge */}
                            <div className="d-flex justify-content-between align-items-center">
                                <h5>{item.username} <span className="badge bg-secondary">{getBadge(item.vote.upvote.length)}</span></h5>
                            </div>
                            <p>{item.answer}</p>
                            <div className="d-flex justify-content-end">
                                <div>
                                    <p className="text-muted">{item.username}</p>
                                    <p onClick={() => handleVote(item.id, 'upvote')} style={{ cursor: "pointer" }}>
                                        👍 Upvote: {item.vote.upvote.length}
                                    </p>
                                    <p onClick={() => handleVote(item.id, 'downvote')} style={{ cursor: "pointer" }}>
                                        👎 Downvote: {item.vote.downvote.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-2">
                <h3>Your Answer</h3>
                <div className="form-group">
                    <textarea className="form-control" rows="2" placeholder="Write your answer here..." id="answerText"></textarea>
                </div>
                <button className="btn btn-primary mt-2" onClick={postAnswer}>
                    Post Answer
                </button>
            </div>
        </div>
    );
};

export default Answer;
