import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBadge } from './BadgeReputation';

const Answer = () => {
    const param = useParams();
    const userID = parseInt(localStorage.getItem('user'));
    const userName = localStorage.getItem('username');

    const navigate = useNavigate();
    const questionId = param.id;
    const [content, setContent] = useState({});
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3005/question/${questionId}`).then((res) => res.json())
            .then((data) => {
                setContent(data);
                setAnswers(data.answers);
            })
            .catch((err) => console.error('Error fetching question:', err));
    }, [questionId]);

    const postAnswer = () => {

        const answerText = document.getElementById('answerText').value;
        if (!answerText.trim()) return;

        const newAnswer = {
            id: answers.length ? Math.max(...answers.map(a => a.id)) + 1 : 1,
            answer: answerText,
            vote: { upvote: [], downvote: [] }
        };

        fetch(`http://localhost:3005/question/${questionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: [...answers, newAnswer], username: userName })
        }).then((res) => res.json())
            .then((data) => {
                setAnswers(data.answers);
            })
            .catch((err) => console.error('Error posting answer:', err));

        document.getElementById('answerText').value = '';
    }

    const handleVote = (id, voteType) => {
        if (!userID) return;
        const updatedAnswers = [...answers];
        const answerIndex = updatedAnswers.findIndex(item => item.id === id);

        if (answerIndex !== -1) {
            const answer = updatedAnswers[answerIndex];
            const hasVotedThisType = Array.isArray(answer.vote[voteType]) &&
                answer.vote[voteType].includes(userID);
            const oppositeType = voteType === 'upvote' ? 'downvote' : 'upvote';
            const hasVotedOpposite = Array.isArray(answer.vote[oppositeType]) &&
                answer.vote[oppositeType].includes(userID);

            const updatedVote = { ...answer.vote };

            if (hasVotedThisType) {
                updatedVote[voteType] = updatedVote[voteType].filter(id => id !== userID);
            }

            if (!hasVotedThisType) {
                updatedVote[voteType] = Array.isArray(updatedVote[voteType])
                    ? [...updatedVote[voteType], userID]
                    : [userID];

                if (hasVotedOpposite) {
                    updatedVote[oppositeType] = updatedVote[oppositeType].filter(id => id !== userID);
                }
            }

            updatedAnswers[answerIndex] = {
                ...answer,
                vote: updatedVote
            };
        }
        setAnswers(updatedAnswers);
        updateVote(updatedAnswers)
    };


    const updateVote = (updatedAnswers) => {
        fetch(`http://localhost:3005/question/${questionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: updatedAnswers })
        }).then((res) => res.json())
            .then((data) => {
                setAnswers(data.answers);
            })
            .catch(err => console.error('Error updating vote:', err));
    }

    const checkVote = (voteArray) => {
        if (Array.isArray(voteArray)) {
            console.log(voteArray, userID, voteArray.includes(userID));
            return voteArray.includes(userID);
        }

    }

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleEdit = (answerId, currentText) => {
        setEditingId(answerId);
        setEditText(currentText);
    };

    const handleUpdate = (answerId) => {
        if (!editText.trim()) return;

        const updatedAnswers = answers.map(answer =>
            answer.id === answerId ? { ...answer, answer: editText, username: userName } : answer
        );

        fetch(`http://localhost:3005/question/${questionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: updatedAnswers })
        }).then((res) => res.json())
            .then((data) => {
                setAnswers(data.answers);
                setEditingId(null);
                setEditText('');
            })
            .catch((err) => console.error('Error updating answer:', err));
    };

    const handleDelete = (answerId) => {
        const updatedAnswers = answers.filter(answer => answer.id !== answerId);

        fetch(`http://localhost:3005/question/${questionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: updatedAnswers })
        }).then((res) => res.json())
            .then((data) => {
                setAnswers(data.answers);
            })
            .catch((err) => console.error('Error deleting answer:', err));
    }

    const sortedAnswers = [...answers].sort((a, b) => {
        const aUpvotes = Array.isArray(a.vote.upvote) ? a.vote.upvote.length : 0;
        const bUpvotes = Array.isArray(b.vote.upvote) ? b.vote.upvote.length : 0;
        return bUpvotes - aUpvotes; // Sort in descending order (highest upvotes first)
    });

    return (
        <>
            <div className="container mt-4 mb-5">
                <div className="mb-4 d-flex justify-content-between align-items-start">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i> Back to Questions
                    </button>
                </div>
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-light">
                        <h2 className="mb-0" data-testid="question_title_in_detail">{content.question_title}</h2>
                    </div>
                    <div className="card-body">
                        <p className="lead" style={{ textAlign: 'justify' }}>{content.question_description}</p>
                        <div className="d-flex justify-content-end">
                            <small className="text-muted" data-testid="question-asked-by">
                                Asked by {content.username || "Anonymous"}
                            </small>
                        </div>
                    </div>
                </div>
                <h4 className="mb-3 d-flex justify-content-start">{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h4>
                {sortedAnswers && sortedAnswers.length > 0 ? (
                    sortedAnswers.map((item) => (
                        <div className="card shadow-sm mb-3" key={item.id} data-testid={`answer-card-${item.id}`}>
                            <div className="card-body">
                                <div className="row">
                                    {editingId !== item.id && <div className="col-md-1 col-sm-2 d-flex flex-column align-items-center text-center">
                                        <div className="d-grid gap-2 col-6 mx-auto">
                                            <div className="d-flex flex-row  align-items-center justify-content-between mb-2">
                                                <button className={checkVote(item.vote.upvote) ? `btn btn-primary btn-sm` : `btn btn-light btn-sm`} onClick={() => handleVote(item.id, 'upvote')}>
                                                    Upvote
                                                </button>
                                                {item.vote.upvote.length}
                                            </div>
                                            <div className="d-flex flex-row  align-items-center">
                                                <button className={checkVote(item.vote.downvote) ? `btn btn-primary btn-sm` : `btn btn-light btn-sm`} onClick={() => handleVote(item.id, 'downvote')}>
                                                    Downvote
                                                </button>
                                                {item.vote.downvote.length}
                                            </div>
                                        </div>
                                    </div>}
                                    <div className="col-md-11 col-sm-10">
                                        {editingId === item.id ? (
                                            <div className="mb-3" data-testid={`edit-section-${item.id}`}>
                                                <textarea
                                                    className="form-control mb-2 "
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    rows="4"
                                                ></textarea>
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleUpdate(item.id)}
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className='d-flex flex-row justify-content-between'>
                                                    <p className="mb-4 w-100" data-testid={`answer-text-${item.id}`}>{item.answer}</p>
                                                    <button className="btn btn-light btn-sm" onClick={() => handleDelete(item.id)}>
                                                        Delete
                                                    </button>
                                                </div>

                                                <div className="d-flex justify-content-end align-items-center gap-2">
                                                    <button
                                                        className="btn btn-light btn-sm"
                                                        onClick={() => handleEdit(item.id, item.answer)}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i> Edit
                                                    </button>
                                                    <small className="text-muted" data-testid={`answered-by-${item.id}`}>
                                                        Answered by <span className="fw-bold">{item.username || "Anonymous"}</span>
                                                        <span className="badge bg-secondary ms-2">{getBadge(item.vote.upvote.length)}</span>
                                                    </small>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-secondary" data-testid="no-answers-alert">No answers yet. Be the first to answer!</div>
                )}

                <div className="card shadow-sm mt-4" data-testid="post-answer-card">
                    <div className="card-header bg-light">
                        <h3 className="mb-0">Your Answer</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Write your answer here..."
                                id="answerText"
                                data-testid="post-answer-textarea"
                            ></textarea>
                        </div>
                        <button
                            className="btn btn-primary mt-3"
                            data-testid="post-answer-button"
                            onClick={() => {
                                postAnswer();
                            }}
                        >
                            <i className="bi bi-send me-2"></i>
                            Post Your Answer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Answer;