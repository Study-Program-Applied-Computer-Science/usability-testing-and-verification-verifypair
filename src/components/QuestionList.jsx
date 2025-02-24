import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionList = ({ questions }) => {
  const navigate = useNavigate();

  const handleViewDetail = (question) => {
    navigate('/question-detail', { state: { question } });
  };

  return (
    <div>
      <h2>Questions</h2>
      {questions.length === 0 ? (
        <p>No questions available. Please add some!</p>
      ) : (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              {question}
              <button onClick={() => handleViewDetail(question)}>View Detail</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/question-form')}>Ask New Question</button>
    </div>
  );
};

export default QuestionList;
