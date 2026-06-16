import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import "./app.css";
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

// TODO : extract CLERK CSS

const clerkAppearance = {
  variables: {
    colorPrimary: '#1d4ed8', // still set your tokens
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    // Remove all of Clerk's own modal/card chrome
    rootBox: 'w-full',
    card: 'shadow-none border-0 p-0 m-0 bg-transparent w-full',
    cardBox: 'shadow-none w-full',
    // Hide the logo — your modal header will handle this
    logoBox: 'hidden',
    logoImage: 'hidden',
  },
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" appearance={clerkAppearance} >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
