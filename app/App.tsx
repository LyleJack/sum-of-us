import { Navigate, Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import { NavBar } from "./components/NavBar";
import About from "./routes/About";
import Classes from "./routes/Classes";
import FAQs from "./routes/FAQs";
import Footer from "./components/Footer";
import { Welcome } from "./routes/Welcome";

export function App() {
  return (
    <>
      <NavBar />
      <div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
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
