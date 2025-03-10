import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Answer from './components/Answer';
import BadgeReputation from './components/BadgeReputation';
import Favorites from './components/Favorites';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<>Test</>} />
          <Route path="/answer" element={<Answer />} />
          <Route path="/badges" element={<BadgeReputation />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
