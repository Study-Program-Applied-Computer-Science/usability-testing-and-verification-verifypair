import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Answer from './components/Answer';
import QuestionsList from './components/QuestionsList';
import Login from './components/Login';
import Register from './components/Register';
import QuestionForm from './components/QuestionForm';
import { AppProvider } from './components/AppContext';

import Layout from './Layout';

function App() {

  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<>TEst</>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/answer" element={<Answer />} />
            <Route path="/posts" element={<QuestionsList />} />
            <Route path="/ask" element={<QuestionForm />} />
          </Routes>
        </Layout>
      </BrowserRouter >
    </AppProvider>
  )
}

export default App