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
      <div className="container mt-2 min-vh-100">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="d-flex justify-content-between align-items-center mb-4 mb-md-4">
              <h2>Questions List</h2>
              <button onClick={formRedirect} className="btn btn-primary">
                Ask a Question
              </button>
            </div>
            <div className="row g-3">
              {questions.map((question) => (
                <div key={question.id} className="col-12">
                  <div className="card mt-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/answer/${question.id}`)}>
                    <div className="card-body">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                        <div className="flex-grow-1 pe-md-3">
                          <h4 className="card-title" style={{ textAlign: 'justify' }}>{question.question_title}</h4>
                          <p className="card-text" style={{ textAlign: 'justify' }}>
                            {question.question_description}
                          </p>
                        </div>
                        <div className="d-flex gap-2 align-self-end align-self-md-center">
                          <button onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionsList;