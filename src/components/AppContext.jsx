import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3005/question')
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error('Error fetching questions:', err));
  }, []);

  const addQuestion = (newQuestion) => {
    fetch('http://localhost:3005/question', {
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

  const deleteQuestion = (id) => {
    fetch(`http://localhost:3005/question/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      })
      .catch((err) => console.error('Error deleting question:', err));
  };

  const login = (username, password) => {
    return fetch('http://localhost:3005/user')
      .then((res) => res.json())
      .then((data) => {
        const validUser = data.filter((item) => item.username === username && item.password === password)
        if (validUser.length > 0) {
          setUser(validUser[0]);
          localStorage.setItem('user', validUser[0].id);
          localStorage.setItem('username', validUser[0].username);
          return { success: true };
        } else {
          return { success: false, message: 'Invalid username or password.' };
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
        return { success: false, message: 'An error occurred during login.' };
      });
  };

  const register = (username, password) => {
    const newUser = {
      id: String(Date.now()),
      username,
      password,
      contribution: {
        questionsAsked: 0,
        answersGiven: 0,
        upvotesReceived: 0
      },
      favorite: []
    };

    return fetch('http://localhost:3005/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        return { success: true };
      })
      .catch((err) => {
        console.error('Registration error:', err);
        return { success: false, message: 'An error occurred during registration.' };
      });
  };

  const logout = () => {
    setUser(null);
  };

  const updateReputation = (username, upvoteChange) => {
    fetch("http://localhost:3005/user")
      .then((res) => res.json())
      .then((users) => {
        const userToUpdate = users.find((u) => u.username === username);
        if (!userToUpdate) return;

        const updatedReputation = userToUpdate.contribution.upvotesReceived + upvoteChange;

        fetch(`http://localhost:3005/user/${userToUpdate.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contribution: { ...userToUpdate.contribution, upvotesReceived: updatedReputation } }),
        }).catch((err) => console.error("Error updating reputation:", err));
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  const toggleFavorite = (questionId) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedFavorites = prevUser.favorite.includes(questionId)
        ? prevUser.favorite.filter((id) => id !== questionId)
        : [...prevUser.favorite, questionId];

      const updatedUser = { ...prevUser, favorite: updatedFavorites };
      localStorage.setItem("user", updatedUser.id);

      fetch(`http://localhost:3005/user/${prevUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: updatedFavorites }),
      }).catch((err) => console.error("Error updating favorites:", err));

      return updatedUser;
    });
  };

  return (
    <AppContext.Provider
      value={{
        questions,
        addQuestion,
        user,
        login,
        register,
        logout,
        toggleFavorite,
        updateReputation,
        deleteQuestion
      }}
    >
      {children}
    </AppContext.Provider>
  );
};