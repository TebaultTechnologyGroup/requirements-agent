import { Navigate } from "react-router";
import { useAuthenticator } from "./AuthContext.tsx";
import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { route } = useAuthenticator();

  if (route !== "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
