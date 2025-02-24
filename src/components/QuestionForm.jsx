import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionForm = ({ addQuestion }) => {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() === '') return;
    addQuestion(question);
    setQuestion('');
    navigate('/');
  };

  return (
    <div>
      <h2>Ask a New Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => navigate('/')}>Back to Questions</button>
    </div>
  );
};

export default QuestionForm;
