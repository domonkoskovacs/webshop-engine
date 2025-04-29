import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "@/components/storefront/forms/LoginForm.component";
import * as useAuthModule from "@/hooks/useAuth";
import {MemoryRouter} from "react-router-dom";

describe("LoginForm", () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
            login: mockLogin,
            logout: vi.fn(),
            role: null,
            loggedIn: false,
            loading: false,
        });
    });

    it("renders form fields", () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
    });

    it("calls login with email and password", async () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText(/password/i), "password123");
        await user.click(screen.getByRole('button', {name: /login/i}));

        expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });

    it("shows validation error if email or password missing", async () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );        const user = userEvent.setup();

        await user.click(screen.getByRole('button', {name: /login/i}));

        expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
        expect(await screen.findByText(/please add your password/i)).toBeInTheDocument();
    });
});
