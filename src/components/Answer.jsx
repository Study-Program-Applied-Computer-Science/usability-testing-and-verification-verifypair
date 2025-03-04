import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const Answer = () => {
    const [content, setContent] = useState('');

    const temp = [
        {
            "id": 1,
            "answer": "You can start by setting up json-server with a db.json file and then use fetch or axios in your React app to call the endpoints.",
            "vote": {
                "upvote": 8,
                "downvote": 0
            }
        },
        {
            "id": 2,
            "answer": "Consider using a proxy in your React development environment to avoid CORS issues when connecting to json-server.",
            "vote": {
                "upvote": 5,
                "downvote": 1
            }
        }
    ]


    const [answers, setAnswers] = useState(temp);

    const handleVote = (id, voteType) => {
        setAnswers(prevAnswers =>
            prevAnswers.map(item =>
                item.id === id
                    ? {
                        ...item,
                        vote: {
                            ...item.vote,
                            [voteType]: item.vote[voteType] + 1
                        }
                    }
                    : item
            )
        );
    };

    return (
        <div className="container mt-4">
            <div className='row'>
                {answers.map((item) => {
                    return (
                        <div className="card mt-4" key={item.id}>
                            <div className="card-body">
                                <p>{item.answer}</p>
                                <div className="d-flex justify-content-end">
                                    <div>
                                        <p onClick={() => handleVote(item.id, 'upvote')}>Upvote: {item.vote.upvote}</p>
                                        <p onClick={() => handleVote(item.id, 'downvote')}>Downvote: {item.vote.downvote}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Answer;