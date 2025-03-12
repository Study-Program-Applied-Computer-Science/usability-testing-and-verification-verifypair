import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3005/question")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const addQuestion = (newQuestion) => {
    fetch("http://localhost:3005/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions((prev) => [data, ...prev]);
      })
      .catch((err) => console.error("Error adding question:", err));
  };

  const toggleFavorite = (questionId) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser; // Ensure user is logged in

      const updatedFavorites = prevUser.favorite.includes(questionId)
        ? prevUser.favorite.filter((id) => id !== questionId) // Remove if exists
        : [...prevUser.favorite, questionId]; // Add if not exists

      const updatedUser = { ...prevUser, favorite: updatedFavorites };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update user in database
      fetch(`http://localhost:3005/user/${prevUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: updatedFavorites }),
      }).catch((err) => console.error("Error updating favorites:", err));

      return updatedUser;
    });
  };

  const login = (username, password) => {
    return fetch("http://localhost:3005/user")
      .then((res) => res.json())
      .then((data) => {
        const validUser = data.find(
          (item) => item.username === username && item.password === password
        );
        if (validUser) {
          setUser(validUser);
          localStorage.setItem("user", JSON.stringify(validUser));
          return { success: true };
        } else {
          return { success: false, message: "Invalid username or password." };
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        return { success: false, message: "An error occurred during login." };
      });
  };

  const register = (username, password) => {
    const newUser = {
      username,
      password,
      contribution: {
        questionsAsked: 0,
        answersGiven: 0,
        upvotesReceived: 0,
      },
      favorite: [],
    };

    return fetch("http://localhost:3005/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        return { success: true };
      })
      .catch((err) => {
        console.error("Registration error:", err);
        return { success: false, message: "An error occurred during registration." };
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
        toggleFavorite, // ✅ Now available for use!
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
