import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from './AppContext';

const QuestionsList = () => {
  const { questions, deleteQuestion } = useContext(AppContext);
  const navigate = useNavigate();

  const formRedirect = () => {
    navigate('/ask');
  };

  return (
    <>
      <div className="container mt-2  min-vh-100" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Questions List</h2>
          <button onClick={formRedirect} className="btn btn-primary">
            Ask a Question
          </button>
        </div>
        {questions.map((question) => (
          <div key={question.id} className="card mt-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/answer/${question.id}`)}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title" style={{ textAlign: 'justify' }}>{question.question_title}</h4>
                <button onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id);}}className="btn btn-danger btn-sm">Delete</button>
              </div>
              
              <p className="card-text" style={{ textAlign: 'justify' }}>
                {question.question_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default QuestionsList;