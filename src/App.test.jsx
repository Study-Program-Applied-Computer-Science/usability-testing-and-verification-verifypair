import App from "./App.jsx";
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

const renderWithBrowserRouter = (initialEntries) =>
    render(
        <BrowserRouter initialEntries={initialEntries}>
            <App />
        </BrowserRouter>
    );

describe("App Routes", () => {
    test("should render the App component", () => {
        renderWithBrowserRouter(<App />);

        expect(screen.getByTestId("login_button")).toHaveTextContent("Login");
    });
});
