import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Answer from "./components/Answer";
import QuestionsList from "./components/QuestionsList";
import Login from "./components/Login";
import Register from "./components/Register";
import QuestionForm from "./components/QuestionForm";
import BadgeReputation from "./components/BadgeReputation";
import Favorites from "./components/Favorites";
import { AppProvider } from "./components/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/">
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
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
  );
}

export default App;
