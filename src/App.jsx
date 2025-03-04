import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Answer from './components/Answer';

import Layout from './Layout';

function App() {

  return (

    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<>TEst</>} />
          <Route path="/answer" element={<Answer />} />
        </Routes>
      </Layout>
    </BrowserRouter >

  )
}

export default App