import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import BadgeReputation from '../components/BadgeReputation';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import { AppContext } from '../components/AppContext';

describe('BadgeReputation Component', () => {
    
    test('renders user welcome message', async () => {
        const fakeUser = { username: "JohnDoe" };
        render(
            <AppContext.Provider value={{ user: fakeUser, questions: [] }}>
                <MemoryRouter>
                    <BadgeReputation />
                </MemoryRouter>
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-welcome")).toHaveTextContent("Welcome, JohnDoe");
        });
    });

    test('displays correct badge based on upvotes', async () => {
        const fakeUser = { username: "JohnDoe" };
        const fakeQuestions = [
            {
                answers: [
                    { username: "JohnDoe", vote: { upvote: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } }
                ]
            }
        ];
        
        render(
            <AppContext.Provider value={{ user: fakeUser, questions: fakeQuestions }}>
                <MemoryRouter>
                    <BadgeReputation />
                </MemoryRouter>
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-badge")).toHaveTextContent("🥉 Bronze");
        });
    });

    test('displays correct total upvotes', async () => {
        const fakeUser = { username: "JohnDoe" };
        const fakeQuestions = [
            {
                answers: [
                    { username: "JohnDoe", vote: { upvote: [1, 2, 3, 4] } },
                    { username: "JohnDoe", vote: { upvote: [5, 6] } }
                ]
            }
        ];

        render(
            <AppContext.Provider value={{ user: fakeUser, questions: fakeQuestions }}>
                <MemoryRouter>
                    <BadgeReputation />
                </MemoryRouter>
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-upvotes")).toHaveTextContent("Total Upvotes: 6");
        });
    });

    test('renders default guest message when user is not logged in', async () => {
        render(
            <AppContext.Provider value={{ user: null, questions: [] }}>
                <MemoryRouter>
                    <BadgeReputation />
                </MemoryRouter>
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-welcome")).toHaveTextContent("Welcome, Guest");
        });
    });

});
