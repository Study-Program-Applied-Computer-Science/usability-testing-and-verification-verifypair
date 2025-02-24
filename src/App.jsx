import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import User from './components/User';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
