import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { ClerkProvider } from "@clerk/react-router";
import "./index.css";
import LoginPage from "./pages/login-page.tsx";
import { esMX } from "@clerk/localizations";
import SignUpPage from "./pages/signup-page.tsx";
import VerifyEmailPage from "./pages/verify-email.tsx";
import Home from "./pages/home.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import ProfilePage from "./pages/profile.tsx";
import { dark } from "@clerk/themes";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        localization={esMX}
        appearance={{ baseTheme: dark }}
      >
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route
              path="/sign-up/verify-email-address"
              element={<VerifyEmailPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </ThemeProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
