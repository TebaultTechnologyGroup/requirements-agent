import { Navigate } from "react-router";
//import { useAuthenticator } from "./AuthContext.tsx";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus !== "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
