import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Favorites from '../components/Favorites';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../components/AppContext';
import { describe, test, expect, vi } from 'vitest';

describe('Favorites Component', () => {
    const mockUserWithFavorites = {
        username: "testUser",
        favorite: [1, 2]
    };

    const mockQuestions = [
        {
            id: 1,
            question_title: "How to integrate React with JSON server?",
            question_description: "I need help setting up JSON server in React.",
        },
        {
            id: 2,
            question_title: "Best practices for unit testing?",
            question_description: "What are the recommended approaches for testing React components?",
        },
        {
            id: 3,
            question_title: "React performance optimization?",
            question_description: "How do I optimize my React app?",
        }
    ];

    const mockToggleFavorite = vi.fn();

    test('renders login message when user is not logged in', () => {
        render(
            <MemoryRouter>
                <AppContext.Provider value={{ user: null, questions: mockQuestions, toggleFavorite: mockToggleFavorite }}>
                    <Favorites />
                </AppContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByTestId("login-message")).toBeInTheDocument();
    });

    test('renders "No bookmarked questions" when user has no favorites', () => {
        render(
            <MemoryRouter>
                <AppContext.Provider value={{ user: { username: "testUser", favorite: [] }, questions: mockQuestions, toggleFavorite: mockToggleFavorite }}>
                    <Favorites />
                </AppContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByTestId("no-favorites-message")).toBeInTheDocument();
    });

    test('displays favorited questions correctly', () => {
        render(
            <MemoryRouter>
                <AppContext.Provider value={{ user: mockUserWithFavorites, questions: mockQuestions, toggleFavorite: mockToggleFavorite }}>
                    <Favorites />
                </AppContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByTestId("favorite-question-1")).toBeInTheDocument();
        expect(screen.getByTestId("favorite-question-2")).toBeInTheDocument();
    });

    test('calls toggleFavorite when "Unfavorite" button is clicked', async () => {
        render(
            <MemoryRouter>
                <AppContext.Provider value={{ user: mockUserWithFavorites, questions: mockQuestions, toggleFavorite: mockToggleFavorite }}>
                    <Favorites />
                </AppContext.Provider>
            </MemoryRouter>
        );

        const unfavoriteButton = screen.getByTestId("unfavorite-button-1");
        fireEvent.click(unfavoriteButton);

        await waitFor(() => {
            expect(mockToggleFavorite).toHaveBeenCalledWith(1);
        });
    });
});
