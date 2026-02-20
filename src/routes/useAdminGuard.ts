import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";

export function useAdminGuard() {
    const { authStatus } = useAuthenticator((ctx) => [ctx.authStatus]);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function verifyAdmin() {
            if (authStatus === "unauthenticated") {
                navigate("/login", { replace: true });
                return;
            }

            if (authStatus === "authenticated") {
                const session = await fetchAuthSession();
                const groups = session.tokens?.idToken?.payload["cognito:groups"] as string[];
                const hasAdminGroup = groups?.includes("ADMINS") ?? false;

                setIsAdmin(hasAdminGroup);

                if (!hasAdminGroup) {
                    navigate("/dashboard", { replace: true });
                }
            }
        }

        verifyAdmin();
    }, [authStatus, navigate]);

    return { authStatus, isAdmin };
}