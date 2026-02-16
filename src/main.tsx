import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes/routes.tsx";
import { RouterProvider } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
//import { Amplify } from "aws-amplify";
//import outputs from "../amplify_outputs.json"; // Import JSON directly

//Amplify.configure(outputs);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator.Provider>
      <RouterProvider router={router} />
    </Authenticator.Provider>
  </StrictMode>,
);
