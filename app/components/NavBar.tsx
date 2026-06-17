import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { useAuthModal } from "./AuthModal";
import classicLogo from "../sum-of-us-logo.svg";
import mobileLogo from "../images/mobileLogo.svg";
import { styles } from "../styles";
import { useState } from "react";
import { UserMenu } from "./UserMenu";

export function NavBar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };



  return (
    <nav className={`${styles.nav.shell} site-nav ${isOpen ? "menu-open" : ""}`}>
      <div className={styles.nav.header}>

        <div className="flex-shrink-0">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <Logo isOpen={isOpen} />
          </Link>
        </div>

        <button
          type="button"
          className="nav-burger-toggle md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        />

        <div className={styles.nav.linkContainer}>
          <Link to="/about" className={styles.nav.link}>About</Link>
          <Link to="/classes" className={styles.nav.link}>Classes</Link>
          <Link to="/faqs" className={styles.nav.link}>FAQs</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!isLoaded ? null : isSignedIn ? (
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className={styles.nav.link}
            >
              Login
            </button>
          )}
          <Link to="/booking" className={styles.button.primarySmall}>
            Book Now
          </Link>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      {isOpen && (
        <div
          className="mobile-nav-backdrop md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`${isOpen ? "flex" : "hidden"} md:hidden flex-col pb-6 pt-2 space-y-6 mobile-menu-content z-index: 20`}>
        <div className="flex flex-col space-y-4 text-center">
          <Link to="/about" className={styles.nav.link} onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/classes" className={styles.nav.link} onClick={() => setIsOpen(false)}>Classes</Link>
          <Link to="/faqs" className={styles.nav.link} onClick={() => setIsOpen(false)}>FAQs</Link>
        </div>

        <div className="border-t border-stone-700/30 pt-6 flex flex-col space-y-4">
          {!isLoaded ? null : isSignedIn ? (
            <div className="flex flex-col space-y-3 w-full">
              <UserMenu setNavBarShoudBeOpen={setIsOpen} />
            </div>
          ) : (
            <button
              onClick={() => {
                openAuthModal("login");
                setIsOpen(false);
              }}
              className={`${styles.nav.link} w-full text-center py-2`}
            >
              Login
            </button>
          )}

          <Link
            to="/booking"
            className={`${styles.button.primarySmall} w-full text-center py-3 block`}
            onClick={() => setIsOpen(false)}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Logo({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="nav-header-row">
      <picture>
        {!isOpen && <source srcSet={mobileLogo} media="(max-width: 47.99rem)" />}
        <img
          src={classicLogo}
          alt="Sum Of Us Logo"
          className="site-nav-logo"
          width={isOpen ? "175px" : "auto"}
        />
      </picture>
    </div>
  );
}