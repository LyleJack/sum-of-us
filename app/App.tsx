import { Navigate, Route, Routes } from "react-router";
import { AuthModalProvider } from "./components/AuthModal";
import { NavBar } from "./components/NavBar";
import About from "./routes/about";
import AuthCallback from "./routes/auth-callback";
import Booking from "./routes/booking";
import Classes from "./routes/classes";
import FAQs from "./routes/faqs";
import Home from "./routes/home";

export function App() {
  return (
    <AuthModalProvider>
      <NavBar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthModalProvider>
  );
}
