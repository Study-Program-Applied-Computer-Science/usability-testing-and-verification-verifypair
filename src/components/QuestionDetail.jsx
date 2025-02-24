import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuestionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { question } = location.state || {};

  return (
    <div>
      <h2>Question Detail</h2>
      <p>{question}</p>
      <button onClick={() => navigate('/')}>Back to Questions</button>
      <button onClick={() => navigate('/question-form')}>Ask New Question</button>
    </div>
  );
};

export default QuestionDetail;
