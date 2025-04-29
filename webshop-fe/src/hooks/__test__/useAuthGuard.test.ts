import { renderHook } from '@testing-library/react';
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";
import {afterEach, describe, expect, it, vi } from 'vitest';
import * as useAuthModule from '../useAuth.ts';


describe('useAuthGuard', () => {
    const mockUseAuth = (role: string | null, loggedIn: boolean, loading: boolean) => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
            role,
            loggedIn,
            loading,
            login: vi.fn(),
            logout: vi.fn(),
        });
    };

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return isAuthenticated when logged in and not loading', () => {
        mockUseAuth('ROLE_USER', true, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return isAdmin true when user is admin and authenticated', () => {
        mockUseAuth('ROLE_ADMIN', true, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(result.current.isAdmin).toBe(true);
    });

    it('should return isUser true when user is ROLE_USER and authenticated', () => {
        mockUseAuth('ROLE_USER', true, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(result.current.isUser).toBe(true);
    });

    it('should throw when assertAuthenticated is called while unauthenticated', () => {
        mockUseAuth(null, false, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(() => result.current.assertAuthenticated()).toThrow('You must be logged in to perform this action.');
    });

    it('should throw when assertUser is called without user/admin role', () => {
        mockUseAuth('ROLE_GUEST', true, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(() => result.current.assertUser()).toThrow('You must be a user to perform this action.');
    });

    it('should throw when assertAdmin is called without admin role', () => {
        mockUseAuth('ROLE_USER', true, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(() => result.current.assertAdmin()).toThrow('You must be an admin to perform this action.');
    });

    it('should NOT throw when assertUser is called with ROLE_ADMIN', () => {
        mockUseAuth('ROLE_ADMIN', true, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(() => result.current.assertUser()).not.toThrow();
    });

    it('should NOT throw when assertAdmin is called with ROLE_ADMIN', () => {
        mockUseAuth('ROLE_ADMIN', true, false);
        const { result } = renderHook(() => useAuthGuard());
        expect(() => result.current.assertAdmin()).not.toThrow();
    });
});
