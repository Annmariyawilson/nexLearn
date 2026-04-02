"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { getAccessToken, getRefreshToken, TOKEN_KEYS } from "@/lib/storage";
import { setAuthTokens } from "@/store/features/authSlice";

/**
 * CLIENT-SIDE HYDRATION / AUTH PROVIDER
 * This component handles syncing tokens from localStorage back into 
 * the Redux state upon initial application boot.
 */
function AuthHydrator({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 1. Recover tokens from storage
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const mobile = localStorage.getItem(TOKEN_KEYS.mobile);

    // 2. Hydrate Redux state if tokens exist
    if (mobile) {
      store.dispatch(setAuthTokens({
        accessToken: accessToken || "",
        refreshToken: refreshToken || ""
      }));
      store.dispatch({ type: 'auth/setMobile', payload: mobile }); // direct or via setMobile
    } else if (accessToken || refreshToken) {
      store.dispatch(
        setAuthTokens({
          accessToken: accessToken || "",
          refreshToken: refreshToken || "",
        })
      );
    }

    setHydrated(true);
  }, []);

  // Prevent flicker during initial token recovery
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf2f5]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
