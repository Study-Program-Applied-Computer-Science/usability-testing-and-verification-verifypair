import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Answer from '../components/Answer';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';

describe('Answer Component', () => {
    test('renders the Answer component with a question', async () => {
        const fakeQuestion = {
            question_title: "Test Title",
            question_description: "Test description",
            username: "Tester",
            answers: []
        };

        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
            json: async () => fakeQuestion,
        });

        render(
            <MemoryRouter initialEntries={['/answer/1']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("question_title_in_detail")).toHaveTextContent("Test Title");
        });
        globalThis.fetch.mockRestore();
    });

    test('renders no answers alert when there are no answers', async () => {
        const fakeQuestion = {
            question_title: "No Answers Q",
            question_description: "No answers desc",
            username: "Test2",
            answers: []
        };

        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
            json: async () => fakeQuestion,
        });

        render(
            <MemoryRouter initialEntries={['/answer/2']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("no-answers-alert")).toBeInTheDocument();
        });
        globalThis.fetch.mockRestore();
    });

    test('displays answer cards when answers are provided', async () => {
        const fakeQuestion = {
            question_title: "With Answers Q",
            question_description: "Answers included",
            username: "Test3",
            answers: [
                {
                    id: 1,
                    answer: "Test answer",
                    vote: { upvote: [], downvote: [] },
                    username: "Answerer"
                }
            ]
        };

        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
            json: async () => fakeQuestion,
        });

        render(
            <MemoryRouter initialEntries={['/answer/3']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("answer-card-1")).toBeInTheDocument();
            expect(screen.getByTestId("answer-text-1")).toHaveTextContent("Test answer");
        });
        globalThis.fetch.mockRestore();
    });

    test('handles fetch error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error("Failed to fetch"));

        render(
            <MemoryRouter initialEntries={['/answer/4']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching question:', expect.any(Error));
        });
        globalThis.fetch.mockRestore();
        consoleSpy.mockRestore();
    });

    test('successfully posts an answer and updates the answer list', async () => {
        const initialQuestion = {
            question_title: "Post Answer Q",
            question_description: "Desc",
            username: "Tester",
            answers: []
        };

        const newAnswer = {
            id: 1,
            answer: "New Answer",
            vote: { upvote: [], downvote: [] }
        };

        vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce({
                json: async () => initialQuestion,
            })
            .mockResolvedValueOnce({
                json: async () => ({ answers: [newAnswer] }),
            });

        render(
            <MemoryRouter initialEntries={['/answer/5']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("question_title_in_detail")).toHaveTextContent("Post Answer Q");
        });

        const textarea = screen.getByTestId("post-answer-textarea");
        const postButton = screen.getByTestId("post-answer-button");

        fireEvent.change(textarea, { target: { value: "New Answer" } });
        fireEvent.click(postButton);

        await waitFor(() => {
            expect(screen.getByTestId("answer-card-1")).toBeInTheDocument();
            expect(screen.getByTestId("answer-text-1")).toHaveTextContent("New Answer");
        });
        globalThis.fetch.mockRestore();
    });

    test('does not post an answer when input is empty', async () => {
        const fakeQuestion = {
            question_title: "Empty Answer Q",
            question_description: "Desc",
            username: "Tester",
            answers: []
        };

        const fetchMock = vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce({ json: async () => fakeQuestion });

        render(
            <MemoryRouter initialEntries={['/answer/6']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("question_title_in_detail")).toHaveTextContent("Empty Answer Q");
        });

        const postButton = screen.getByTestId("post-answer-button");
        const textarea = screen.getByTestId("post-answer-textarea");

        fireEvent.change(textarea, { target: { value: "    " } });
        fireEvent.click(postButton);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });
        fetchMock.mockRestore();
    });

    test('does not handle voting when user is not logged in', async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('username');

        const fakeQuestion = {
            question_title: "Vote Test Q",
            question_description: "Desc",
            username: "Tester",
            answers: [
                {
                    id: 1,
                    answer: "Answer for vote test",
                    vote: { upvote: [], downvote: [] },
                    username: "Answerer"
                }
            ]
        };

        const fetchMock = vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce({ json: async () => fakeQuestion });

        render(
            <MemoryRouter initialEntries={['/answer/7']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("answer-text-1")).toHaveTextContent("Answer for vote test");
        });

        const upvoteButton = screen.getByText("Upvote");
        fireEvent.click(upvoteButton);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });
        fetchMock.mockRestore();
    });

    test('handles voting interactions correctly', async () => {
        localStorage.setItem('user', '1');
        localStorage.setItem('username', 'TestUser');

        const fakeAnswer = {
            id: 1,
            answer: "Answer to vote on",
            vote: { upvote: [], downvote: [] },
            username: "Answerer"
        };

        const fakeQuestion = {
            question_title: "Voting Q",
            question_description: "Desc",
            username: "Tester",
            answers: [fakeAnswer]
        };

        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ json: async () => fakeQuestion })
            .mockResolvedValueOnce({ json: async () => ({ answers: [{ ...fakeAnswer, vote: { upvote: [1], downvote: [] } }] }) })
            .mockResolvedValueOnce({ json: async () => ({ answers: [{ ...fakeAnswer, vote: { upvote: [], downvote: [1] } }] }) })
            .mockResolvedValueOnce({ json: async () => ({ answers: [{ ...fakeAnswer, vote: { upvote: [], downvote: [] } }] }) });
        globalThis.fetch = fetchMock;

        render(
            <MemoryRouter initialEntries={['/answer/8']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("answer-text-1")).toHaveTextContent("Answer to vote on");
        });

        let upvoteButton = screen.getByText("Upvote");
        expect(upvoteButton).toHaveClass("btn-light");

        fireEvent.click(upvoteButton);

        await waitFor(() => {
            upvoteButton = screen.getByText("Upvote");
            expect(upvoteButton).toHaveClass("btn-primary");
        });

        let downvoteButton = screen.getByText("Downvote");
        expect(downvoteButton).toHaveClass("btn-light");
        fireEvent.click(downvoteButton);

        await waitFor(() => {
            upvoteButton = screen.getByText("Upvote");
            expect(upvoteButton).toHaveClass("btn-light");
            downvoteButton = screen.getByText("Downvote");
            expect(downvoteButton).toHaveClass("btn-primary");
        });

        fireEvent.click(downvoteButton);

        await waitFor(() => {
            downvoteButton = screen.getByText("Downvote");
            expect(downvoteButton).toHaveClass("btn-light");
        });
    });

    test('allows editing and updating an answer', async () => {
        localStorage.setItem('user', '1');
        localStorage.setItem('username', 'TestUser');

        const fakeAnswer = {
            id: 1,
            answer: "Original Answer",
            vote: { upvote: [], downvote: [] },
            username: "Answerer"
        };

        const fakeQuestion = {
            question_title: "Edit Answer Q",
            question_description: "Desc",
            username: "Tester",
            answers: [fakeAnswer]
        };

        const updatedAnswer = {
            id: 1,
            answer: "Updated Answer",
            vote: { upvote: [], downvote: [] },
            username: "TestUser"
        };

        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ json: async () => fakeQuestion })
            .mockResolvedValueOnce({ json: async () => ({ answers: [updatedAnswer] }) });
        globalThis.fetch = fetchMock;

        render(
            <MemoryRouter initialEntries={['/answer/9']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("answer-text-1")).toHaveTextContent("Original Answer");
        });

        const editButton = screen.getByText("Edit");
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByTestId("edit-section-1")).toBeInTheDocument();
        });

        const editSection = screen.getByTestId("edit-section-1");
        const editTextarea = editSection.querySelector("textarea");
        fireEvent.change(editTextarea, { target: { value: "Updated Answer" } });

        const updateButton = screen.getByText("Update");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(screen.getByTestId("answer-text-1")).toHaveTextContent("Updated Answer");
        });
    });

    test('allows canceling edit mode', async () => {
        localStorage.setItem('user', '1');
        localStorage.setItem('username', 'TestUser');

        const fakeAnswer = {
            id: 1,
            answer: "Answer to edit",
            vote: { upvote: [], downvote: [] },
            username: "Answerer"
        };

        const fakeQuestion = {
            question_title: "Cancel Edit Q",
            question_description: "Desc",
            username: "Tester",
            answers: [fakeAnswer]
        };

        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ json: async () => fakeQuestion });
        globalThis.fetch = fetchMock;

        render(
            <MemoryRouter initialEntries={['/answer/10']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("answer-text-1")).toHaveTextContent("Answer to edit");
        });

        const editButton = screen.getByText("Edit");
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByTestId("edit-section-1")).toBeInTheDocument();
        });

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByTestId("edit-section-1")).toBeNull();
        });
    });

    test('deletes an answer', async () => {
        localStorage.setItem('user', '1');
        localStorage.setItem('username', 'TestUser');

        const fakeAnswer = {
            id: 1,
            answer: "Answer to delete",
            vote: { upvote: [], downvote: [] },
            username: "Answerer"
        };

        const fakeQuestion = {
            question_title: "Delete Answer Q",
            question_description: "Desc",
            username: "Tester",
            answers: [fakeAnswer]
        };

        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ json: async () => fakeQuestion })
            .mockResolvedValueOnce({ json: async () => ({ answers: [] }) });
        globalThis.fetch = fetchMock;

        render(
            <MemoryRouter initialEntries={['/answer/11']}>
                <Routes>
                    <Route path="/answer/:id" element={<Answer />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("answer-card-1")).toBeInTheDocument();
        });

        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByTestId("answer-card-1")).toBeNull();
        });
    });

});
