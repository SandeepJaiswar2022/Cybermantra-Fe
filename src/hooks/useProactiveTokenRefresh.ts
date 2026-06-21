import { API_BASE_URL } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { AuthResponse } from "@/types";
import axios from "axios";
import { useEffect } from "react";

export function useProactiveTokenRefresh() {
    const { expiresAt, isAuthenticated, setAccessToken } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || !expiresAt) {
            console.debug('[ProactiveRefresh] Skipped — not authenticated or no expiresAt');
            return;
        }

        const msUntilExpiry = expiresAt - Date.now();
        const msUntilRefresh = msUntilExpiry - 60_000;

        console.debug('[ProactiveRefresh] Token expires in:', Math.round(msUntilExpiry / 1000), 's');
        console.debug('[ProactiveRefresh] Refresh scheduled in:', Math.round(msUntilRefresh / 1000), 's');

        if (msUntilRefresh <= 0) {
            console.debug('[ProactiveRefresh] Too close to expiry — letting interceptor handle it');
            return;
        }

        const timerId = setTimeout(async () => {
            console.debug('[ProactiveRefresh] Firing proactive refresh...');
            try {
                const response = await axios.post<AuthResponse>(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                const { accessToken, expiresIn } = response.data.data;
                console.debug('[ProactiveRefresh] Success — new token expires in:', expiresIn, 's');
                setAccessToken(accessToken, expiresIn);
            } catch (error) {
                console.warn('[ProactiveRefresh] Failed — interceptor will handle on next API call:', error);
            }
        }, msUntilRefresh);

        return () => {
            console.debug('[ProactiveRefresh] Cleanup — clearing scheduled refresh');
            clearTimeout(timerId);
        };
    }, [expiresAt, isAuthenticated]);
}