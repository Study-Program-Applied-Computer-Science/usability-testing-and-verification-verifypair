import { useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { AppProvider, AppContext } from '../components/AppContext';
import Register from '../components/Register';
import Login from '../components/Login';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe('AppContext - login and register functions', () => {
  let contextValue;
  const TestConsumer = () => {
    contextValue = useContext(AppContext);
    return null;
  };

  beforeEach(() => {
    contextValue = null;
    localStorage.clear();
  });

  it('should successfully login with correct credentials', async () => {
    const fakeUser = {
      id: '1',
      username: 'testuser',
      password: 'testpass',
      contribution: { questionsAsked: 0, answersGiven: 0, upvotesReceived: 0 },
      favorite: []
    };

    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === 'http://localhost:3005/user') {
        return Promise.resolve({
          json: () => Promise.resolve([fakeUser])
        });
      }
      return Promise.reject(new Error('Unhandled fetch'));
    });

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    const result = await contextValue.login('testuser', 'testpass');
    expect(result.success).toBe(true);
    expect(localStorage.getItem('user')).toBe(fakeUser.id);
    fetchMock.mockRestore();
  });

  it('should fail login with incorrect credentials', async () => {
    const fakeUser = {
      id: '1',
      username: 'testuser',
      password: 'testpass',
      contribution: { questionsAsked: 0, answersGiven: 0, upvotesReceived: 0 },
      favorite: []
    };

    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === 'http://localhost:3005/user') {
        return Promise.resolve({
          json: () => Promise.resolve([fakeUser])
        });
      }
      return Promise.reject(new Error('Unhandled fetch'));
    });

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    const result = await contextValue.login('wronguser', 'wrongpass');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid username or password.');
    fetchMock.mockRestore();
  });

  it('should successfully register a new user', async () => {
    const newUser = {
      id: '123',
      username: 'newuser',
      password: 'newpassword',
      contribution: { questionsAsked: 0, answersGiven: 0, upvotesReceived: 0 },
      favorite: []
    };

    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation((url, options) => {
      if (url === 'http://localhost:3005/user' && options.method === 'POST') {
        return Promise.resolve({
          json: () => Promise.resolve(newUser)
        });
      }
      return Promise.reject(new Error('Unhandled fetch'));
    });

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    const result = await contextValue.register('newuser', 'newpassword');
    expect(result.success).toBe(true);

    await waitFor(() => {
      expect(contextValue.user).toEqual(newUser);
    });
    fetchMock.mockRestore();
  });

  it('should handle registration error', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation((url, options) => {
      if (url === 'http://localhost:3005/user' && options.method === 'POST') {
        return Promise.reject(new Error('Registration error'));
      }
      return Promise.reject(new Error('Unhandled fetch'));
    });

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    const result = await contextValue.register('newuser', 'newpassword');
    expect(result.success).toBe(false);
    expect(result.message).toBe('An error occurred during registration.');
    fetchMock.mockRestore();
  });
});

describe('Register Component', () => {
  let registerMock;
  beforeEach(() => {
    registerMock = vi.fn();
    mockedUsedNavigate.mockReset();
  });

  const renderRegisterComponent = () => {
    return render(
      <AppContext.Provider value={{ register: registerMock }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AppContext.Provider>
    );
  };

  it('should display error if username or password is empty', async () => {
    const { getByRole, getByText } = renderRegisterComponent();
    const registerButton = getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);
    expect(await waitFor(() => getByText('Please fill in both username and password.'))).toBeDefined();
  });

  it('should display error if password is less than 8 characters', async () => {
    const { getByTestId, getByRole, getByText } = renderRegisterComponent();
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const registerButton = getByRole('button', { name: /register/i });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(registerButton);
    expect(await waitFor(() => getByText('Password must be at least 8 characters long.'))).toBeDefined();
  });

  it('should call register and navigate on successful registration', async () => {
    registerMock.mockResolvedValue({ success: true });
    const { getByTestId, getByRole } = renderRegisterComponent();
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const registerButton = getByRole('button', { name: /register/i });
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    fireEvent.click(registerButton);
    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith('newuser', 'longenoughpassword');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should display error message on registration failure', async () => {
    registerMock.mockResolvedValue({ success: false, message: 'Registration failed' });
    const { getByTestId, getByRole, getByText } = renderRegisterComponent();
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const registerButton = getByRole('button', { name: /register/i });
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    fireEvent.click(registerButton);
    expect(await waitFor(() => getByText('Registration failed'))).toBeDefined();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});

describe('Login Component', () => {
  let loginMock;
  beforeEach(() => {
    loginMock = vi.fn();
    mockedUsedNavigate.mockReset();
    localStorage.clear();
  });

  const renderLoginComponent = () => {
    return render(
      <AppContext.Provider value={{ login: loginMock }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AppContext.Provider>
    );
  };

  it('should display error if username or password is empty', async () => {
    const { getByRole, getByText } = renderLoginComponent();
    const loginButton = getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    expect(await waitFor(() => getByText('Please enter both username and password.'))).toBeDefined();
  });

  it('should display error if password is less than 8 characters', async () => {
    const { getByTestId, getByRole, getByText } = renderLoginComponent();
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByRole('button', { name: /login/i });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(loginButton);
    expect(await waitFor(() => getByText('Password must be at least 8 characters long.'))).toBeDefined();
  });

  it('should call login and navigate on successful login', async () => {
    loginMock.mockResolvedValue({ success: true });
    const { getByTestId, getByRole } = renderLoginComponent();
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByRole('button', { name: /login/i });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('testuser', 'longenoughpassword');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/posts');
    });
  });

  it('should display error message on login failure', async () => {
    loginMock.mockResolvedValue({ success: false, message: 'Invalid username or password.' });
    const { getByTestId, getByRole, getByText } = renderLoginComponent();
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByRole('button', { name: /login/i });
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    expect(await waitFor(() => getByText('Invalid username or password.'))).toBeDefined();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  it('should automatically navigate to posts if user exists in localStorage', async () => {
    localStorage.setItem('user', 'existingUser');
    renderLoginComponent();
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/posts');
    });
  });
});