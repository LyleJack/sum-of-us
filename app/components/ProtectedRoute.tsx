import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { useAuthModal } from "./AuthModal";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
let navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      openAuthModal("login"); // opens YOUR modal, not Clerk's
    }
  }, [isLoaded, isSignedIn, openAuthModal]);

  if (!isLoaded) return null;

  if (!isSignedIn) return (
    navigate("/dashboard")
  );

  return <>{children}</>;
}