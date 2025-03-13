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
});
