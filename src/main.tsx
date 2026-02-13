import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes/routes.tsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
