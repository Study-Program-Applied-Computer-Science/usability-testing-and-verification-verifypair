import Header from "./Header";

const QuestionsList = () => {
  const questions = [
    { id: 1, title: "What is React?"},
    { id: 2, title: "How does Vite work?" },
    { id: 3, title: "What is JSX?"}
  ];

  return (
    <div className="container mt-5">
      <Header />
      <h2>Questions List</h2>
      <ul className="list-group">
        {questions.map((question) => (
          <li key={question.id} className="list-group-item">
            <h5>{question.title}</h5>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsList;