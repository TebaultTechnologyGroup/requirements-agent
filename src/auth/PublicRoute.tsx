import { Navigate } from "react-router";
import { useAuthenticator } from "./AuthContext.tsx";
import { ReactNode } from "react";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { route } = useAuthenticator();

  if (route === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
