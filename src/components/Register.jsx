import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

const Register = () => {
  const { register } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please fill in both username and password.');
      return;
    }
    if (!isValidEmail(username)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setErrorMsg('');
    const result = await register(username, password);
    if (result.success) {
      navigate('/login');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Register</h2>
      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      <form onSubmit={handleSubmit} data-testid="register-form">
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-25 mx-auto"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username-input"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control w-25 mx-auto"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
          />
        </div>
        <button type="submit" className="btn btn-success">Register</button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
