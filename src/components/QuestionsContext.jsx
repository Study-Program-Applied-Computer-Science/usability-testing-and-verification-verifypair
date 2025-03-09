import { createContext, useState } from 'react';

export const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
    const [questions, setQuestions] = useState([
        {
            id: 1,
            title: 'How do I set up a React project?',
            description: 'I am looking for guidance on setting up a new React project from scratch, including best practices for file structure and dependencies.',
            vote: { upvote: 8, downvote: 0 }
        },
        {
            id: 2,
            title: 'What is the difference between props and state?',
            description: 'I would like to understand how props and state differ and when to use each in a React component.',
            vote: { upvote: 5, downvote: 1 }
        },
        {
            id: 3,
            title: 'How do I manage side effects in React?',
            description: 'Could someone explain how to handle side effects in React applications, perhaps using hooks like useEffect?',
            vote: { upvote: 3, downvote: 0 }
        }
    ]);

    const addQuestion = (newQuestion) => {
        setQuestions((prev) => [newQuestion, ...prev]);
    };

    return (
        <QuestionsContext.Provider value={{ questions, addQuestion }}>
            {children}
        </QuestionsContext.Provider>
    );
};
