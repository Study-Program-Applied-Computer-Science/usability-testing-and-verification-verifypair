import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please fill in both username and password.');
      return;
    }
    setErrorMsg('');
    console.log('Registering user:', username, password);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Register</h2>
      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      <form onSubmit={handleSubmit} data-testid="register-form">
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
        <button type="submit" className="btn btn-success">Register</button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
