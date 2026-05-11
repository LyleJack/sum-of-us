import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import "./app.css";
import { AwsAuthProvider } from "./components/AwsAuth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AwsAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AwsAuthProvider>
  </StrictMode>
);
