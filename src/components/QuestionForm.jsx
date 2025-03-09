import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionsContext } from './QuestionsContext';

const QuestionForm = () => {
    const { addQuestion } = useContext(QuestionsContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        const newQuestion = {
            id: Date.now(),
            title,
            description,
            vote: { upvote: 0, downvote: 0 }
        };

        addQuestion(newQuestion);
        setTitle('');
        setDescription('');
        navigate('/posts');
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h2>Ask a Question</h2>
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
                <div className="mb-3">
                    <label
                        htmlFor="description"
                        className="form-label w-100"
                        style={{ textAlign: 'justify' }}
                    >
                        Description
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter question description"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit Question
                </button>
            </form>
        </div>
    );
};

export default QuestionForm;