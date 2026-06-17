import { Navigate, Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import { AuthModalProvider } from "./components/AuthModal";
import { NavBar } from "./components/NavBar";
import About from "./routes/About";
import AuthCallback from "./routes/Auth-Callback";
import Booking from "./routes/Booking";
import Classes from "./routes/Classes";
import FAQs from "./routes/FAQs";
import MembersPage from "./routes/Members";
import SSOCallback from "./routes/SSOCallback";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Welcome } from "./routes/Welcome";

export function App() {
  return (
    <AuthModalProvider>
      <NavBar />
      <div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Welcome />} />
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