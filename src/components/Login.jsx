import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

const Login = () => {
  const { login } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user');
    if (userId) {
      navigate('/posts');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setErrorMsg('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/posts');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-4">
          <h2 className="mb-4 text-center">Login</h2>
          {errorMsg && <p className="text-danger">{errorMsg}</p>}
          <form onSubmit={handleSubmit} data-testid="login-form">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="username-input"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="password-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
      <p className="mt-3 text-center">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
      </div>
      </div>
    </div>
  );
};

export default Login;
