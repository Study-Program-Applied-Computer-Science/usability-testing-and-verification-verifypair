import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Answer from './components/Answer';
import QuestionsList from './components/QuestionsList';
import Login from './components/Login';
import Register from './components/Register';
import QuestionForm from './components/QuestionForm';
import { AppProvider } from './components/AppContext';
import BadgeReputation from './components/BadgeReputation';
import Favorites from './components/Favorites';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/answer/:id" element={<Answer />} />
            <Route path="/posts" element={<QuestionsList />} />
            <Route path="/ask" element={<QuestionForm />} />
            <Route path="/badges" element={<BadgeReputation />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App;
