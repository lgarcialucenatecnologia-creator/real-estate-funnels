"use client";

import { useSyncExternalStore } from "react";

import {
  ADMIN_SESSION_KEY,
  subscribeToAdminSession,
} from "./admin-session";

const getSnapshot = () => window.sessionStorage.getItem(ADMIN_SESSION_KEY);
const getServerSnapshot = () => null;

const subscribeToHydration = () => () => undefined;

export interface UseAdminSessionResult {
  token: string | null;
  /** En el primer render (servidor e hidratación) todavía no se puede leer sessionStorage. */
  isReady: boolean;
}

export function useAdminSession(): UseAdminSessionResult {
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const token = useSyncExternalStore(
    subscribeToAdminSession,
    getSnapshot,
    getServerSnapshot,
  );

  return { token, isReady };
}
