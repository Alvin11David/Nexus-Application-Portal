import { useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
};

/**
 * Placeholder auth hook.
 *
 * The legacy auth provider was removed along with the rest of the old stack.
 * This keeps the previous call signature until the Spring Boot identity module
 * (/api/v1/auth/**) provides JWT-based authentication.
 */
export function useAuth() {
  const [user] = useState<AuthUser | null>(null);
  const [session] = useState<null>(null);
  const [loading] = useState(false);
  const [isAdmin] = useState(false);

  const signOut = async () => {
    // No-op until the new backend's logout endpoint exists.
  };

  return { user, session, loading, isAdmin, signOut };
}
