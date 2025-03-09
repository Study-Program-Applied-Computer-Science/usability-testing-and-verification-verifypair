import { createContext, useState, useEffect } from 'react';

export const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/question')
            .then((res) => res.json())
            .then((data) => setQuestions(data))
            .catch((err) => console.error('Error fetching questions:', err));
    }, []);

    const addQuestion = (newQuestion) => {
        fetch('http://localhost:3001/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuestion)
        })
            .then((res) => res.json())
            .then((data) => {
                setQuestions((prev) => [data, ...prev]);
            })
            .catch((err) => console.error('Error adding question:', err));
    };

    return (
        <QuestionsContext.Provider value={{ questions, addQuestion }}>
            {children}
        </QuestionsContext.Provider>
    );
};
