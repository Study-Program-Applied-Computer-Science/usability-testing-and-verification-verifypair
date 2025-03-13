import { useContext } from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import QuestionForm from '../components/QuestionForm';
import QuestionsList from '../components/QuestionsList';
import { AppContext, AppProvider } from '../components/AppContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const fakeQuestions = [
  {
    id: '1',
    question_title: 'First Question',
    question_description: 'Description for first question',
    username: 'User1',
    answers: [],
  },
  {
    id: '2',
    question_title: 'Second Question',
    question_description: 'Description for second question',
    username: 'User2',
    answers: [],
  },
];

const fakeDeleteQuestion = vi.fn();

const renderWithContext = (ui, { route = '/posts' } = {}) => {
  const contextValue = {
    questions: fakeQuestions,
    deleteQuestion: fakeDeleteQuestion,
    addQuestion: () => {},
    user: null,
    login: () => {},
    register: () => {},
    logout: () => {},
    toggleFavorite: () => {},
    updateReputation: () => {},
  };

  return render(
    <AppContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </AppContext.Provider>
  );
};

const TestComponent = () => {
    const { questions, addQuestion } = useContext(AppContext);
    return (
      <div>
        <div data-testid="questions">{JSON.stringify(questions)}</div>
        <button
          data-testid="add-question-btn"
          onClick={() =>
            addQuestion({
              id: '123',
              question_title: 'Test Question',
              question_description: 'Test Description',
              username: 'Tester',
              answers: []
            })
          }
        >
          Add Question
        </button>
      </div>
    );
  };

beforeEach(() => {
  mockNavigate.mockReset();
  localStorage.clear();
});

describe('AppContext - addQuestion', () => {
    const originalFetch = global.fetch;
  
    beforeEach(() => {
      localStorage.clear();
      global.fetch = vi.fn();
    });
  
    afterEach(() => {
      global.fetch = originalFetch;
      vi.restoreAllMocks();
    });
  
    it('fetches initial questions on mount and adds a question', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '123',
          question_title: 'Test Question',
          question_description: 'Test Description',
          username: 'Tester',
          answers: []
        })
      });
  
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('questions').textContent).toBe('[]');
      });
  
      fireEvent.click(screen.getByTestId('add-question-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('questions').textContent).toContain('Test Question');
      });
    });
  });

describe('QuestionForm Component', () => {
  test('renders form inputs and handles submit correctly', async () => {

    const fakeAddQuestion = vi.fn();

    const contextValue = {
      addQuestion: fakeAddQuestion,
      questions: [],
      user: null,
      login: () => {},
      register: () => {},
      logout: () => {},
      toggleFavorite: () => {},
      updateReputation: () => {},
    };

    localStorage.setItem('username', 'Tester');

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter initialEntries={['/ask']}>
          <Routes>
            <Route path="/ask" element={<QuestionForm />} />
          </Routes>
        </MemoryRouter>
      </AppContext.Provider>
    );

    const titleInput = screen.getByPlaceholderText('Enter question title');
    expect(titleInput).toBeInTheDocument();

    const descriptionInput = screen.getByPlaceholderText('Enter question description');
    expect(descriptionInput).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: 'Test Question Title' } });
    expect(titleInput.value).toBe('Test Question Title');

    fireEvent.change(descriptionInput, { target: { value: 'Test Question Description' } });
    expect(descriptionInput.value).toBe('Test Question Description');

    const form = titleInput.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(fakeAddQuestion).toHaveBeenCalled();
    });

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/posts');
    });
  });

  test('Back button navigates to previous page', async () => {
    const contextValue = {
      addQuestion: () => {},
      questions: [],
      user: null,
      login: () => {},
      register: () => {},
      logout: () => {},
      toggleFavorite: () => {},
      updateReputation: () => {},
    };

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter initialEntries={['/ask']}>
          <Routes>
            <Route path="/ask" element={<QuestionForm />} />
          </Routes>
        </MemoryRouter>
      </AppContext.Provider>
    );

    const backButton = screen.getByRole('button', { name: /back to questions/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});

describe('QuestionsList Component', () => {
  test('renders list of questions and "Ask a Question" button', () => {
    renderWithContext(
      <Routes>
        <Route path="/posts" element={<QuestionsList />} />
      </Routes>,
      { route: '/posts' }
    );

    fakeQuestions.forEach((question) => {
      expect(screen.getByText(question.question_title)).toBeInTheDocument();
      expect(screen.getByText(question.question_description)).toBeInTheDocument();
    });

    const askButton = screen.getByRole('button', { name: /ask a question/i });
    expect(askButton).toBeInTheDocument();
  });

  test('navigates to /ask when "Ask a Question" is clicked', async () => {
    renderWithContext(
      <Routes>
        <Route path="/posts" element={<QuestionsList />} />
      </Routes>,
      { route: '/posts' }
    );

    const askButton = screen.getByRole('button', { name: /ask a question/i });
    fireEvent.click(askButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ask');
    });
  });

  test('calls deleteQuestion when Delete button is clicked', async () => {
    renderWithContext(
      <Routes>
        <Route path="/posts" element={<QuestionsList />} />
      </Routes>,
      { route: '/posts' }
    );

    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fakeDeleteQuestion).toHaveBeenCalledWith(fakeQuestions[0].id);
    });
  });
});
