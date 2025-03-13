import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

const QuestionForm = () => {
    const { addQuestion } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        const newQuestion = {
            id: String(Date.now()),
            username: username,
            question_title: title,
            question_description: description,
            answers: [],
        };

        addQuestion(newQuestion);
        setTitle('');
        setDescription('');
        navigate('/posts');
    };

    return (
        <div className="container mt-4 min-vh-100">
            <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0">Ask a Question</h2>
                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-2"></i> Back to Questions
                    </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label
                        htmlFor="title"
                        className="form-label w-100"
                        style={{ textAlign: 'justify' }}
                    >
                        Question Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter question title"
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionForm;