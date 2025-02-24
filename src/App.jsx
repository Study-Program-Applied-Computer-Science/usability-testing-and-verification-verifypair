import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';

function App() {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionList questions={questions} />} />
        <Route path="/question-form" element={<QuestionForm addQuestion={addQuestion} />} />
        <Route path="/question-detail" element={<QuestionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

