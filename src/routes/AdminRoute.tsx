import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ReactNode, useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export function AdminRoute({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { authStatus } = useAuthenticator((ctx) => [ctx.authStatus]);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.idToken?.payload[
          "cognito:groups"
        ] as string[];
        setIsAdmin(groups?.includes("ADMINS") ?? false);
      } catch (err) {
        setIsAdmin(false);
      }
    }

    if (authStatus === "authenticated") {
      checkAdminStatus();
    } else if (authStatus === "unauthenticated") {
      setIsAdmin(false);
    }
  }, [authStatus]);

  // Prevent flicker while checking session
  if (authStatus === "configuring" || isAdmin === null) return null;

  if (authStatus !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
