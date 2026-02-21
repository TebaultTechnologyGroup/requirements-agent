import { Navigate } from "react-router";
//import { useAuthenticator } from "./AuthContext.tsx";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ReactNode } from "react";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
