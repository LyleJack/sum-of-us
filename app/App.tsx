import { Navigate, Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import { AuthModalProvider } from "./components/AuthModal";
import { NavBar } from "./components/NavBar";
import About from "./routes/about";
import AuthCallback from "./routes/auth-callback";
import Booking from "./routes/booking";
import Classes from "./routes/classes";
import FAQs from "./routes/faqs";
import Home from "./routes/home";
import MembersPage from "./routes/members";
import SSOCallback from "./routes/SSOCallback";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

export function App() {
  return (
    <AuthModalProvider>
      <NavBar />
      <div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/sso-callback" element={<SSOCallback />} />
          <Route path="/members" element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </AuthModalProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly resets view to coordinates 0,0 when path string alters
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component serves strictly as an operational listener hook
}