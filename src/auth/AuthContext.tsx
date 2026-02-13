import { createContext, useContext, useState, ReactNode } from "react";

type AuthRoute = "authenticated" | "unauthenticated";

interface SignInInput {
  username: string;
  password?: string;
}

interface SignUpInput {
  username: string;
  password: string;
  options?: {
    userAttributes?: Record<string, string>;
  };
}
interface ConfirmSignUpInput {
  username: string;
  confirmationCode: string;
}

interface ResetPasswordInput {
  username: string;
}

interface ConfirmResetPasswordInput {
  username: string;
  confirmationCode: string;
  newPassword: string;
}

interface AuthContextType {
  route: AuthRoute;
  setRoute: (route: AuthRoute) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store the setRoute function so standalone functions can access it
let globalSetRoute: ((route: AuthRoute) => void) | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<AuthRoute>("unauthenticated");

  globalSetRoute = setRoute;

  return (
    <AuthContext.Provider value={{ route, setRoute }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthenticator(): {
  user: any;
  signOut: any;
  route: string;
  setRoute: any;
} {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthenticator must be used within AuthProvider");
  }

  // Mock user and signOut for demonstration
  const user = { id: 1, email: "mark@gmail.com" }; // Replace with actual user object if available
  return {
    user: user,
    signOut: signOut,
    route: context.route,
    setRoute: context.setRoute,
  };
}

// Standalone functions that mimic AWS Amplify
export async function signIn({ username, password }: SignInInput) {
  // Mock authentication - in real app, validate credentials
  console.log("Signing in:", username, password);

  // Set route to authenticated
  if (globalSetRoute) {
    globalSetRoute("authenticated");
  }

  return Promise.resolve({
    isSignedIn: true,
    nextStep: { signInStep: "DONE" },
  });
}

export async function signUp({ username, password, options }: SignUpInput) {
  console.log("Signing up:", username, options);
  // You would typically make an API call here
  console.log("Signup", username, password, options);
  return Promise.resolve({
    user: { username },
    nextStep: { signUpStep: "CONFIRM_SIGN_UP_WITH_CODE" },
  });
}

export async function confirmSignUp({
  username,
  confirmationCode,
}: ConfirmSignUpInput) {
  console.log("Confirming sign up:", username, confirmationCode);
  // You would typically make an API call here
  return Promise.resolve();
}

export async function signOut() {
  console.log("Signing out");
  // Set route to authenticated
  if (globalSetRoute) {
    globalSetRoute("unauthenticated");
  }
  return Promise.resolve();
}

export async function resetPassword({ username }: ResetPasswordInput) {
  console.log("Resetting password for:", username);
  return Promise.resolve({
    isPasswordReset: false,
    nextStep: { resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE" },
  });
}

export async function confirmResetPassword({
  username,
  confirmationCode,
  newPassword,
}: ConfirmResetPasswordInput) {
  console.log(
    "Confirming password reset:",
    username,
    confirmationCode,
    newPassword,
  );
  return Promise.resolve();
}
