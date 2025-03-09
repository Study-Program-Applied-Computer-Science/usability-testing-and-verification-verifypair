import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    return fetch('http://localhost:3001/user')
      .then((res) => res.json())
      .then((data) => {
        if (username === data.username && password === data.password) {
          setUser(data);
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
      username,
      password,
      contribution: {
        questionsAsked: 0,
        answersGiven: 0,
        upvotesReceived: 0
      },
      favorite: []
    };

    return fetch('http://localhost:3001/user', {
      method: 'PUT',
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

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};
