import { Link } from "react-router";
import { useAwsAuth } from "./AwsAuth";
import { useAuthModal } from "./AuthModal";
import logoLight from "../sum-of-us-logo.svg";
import mobileLogo from "../images/mobileLogo.svg";
import { styles } from "../styles";
import { useState } from "react";

export function NavBar() {
  const auth = useAwsAuth();
  const { openAuthModal } = useAuthModal();
  const displayName = auth.user?.name ?? auth.user?.email;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`${styles.nav.shell} site-nav ${isOpen ? "menu-open" : ""}`}>
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex justify-between items-center h-16 nav-header-row">
          
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
          >
            <span />
            <span />
            <span />
          </button>

          <div className="hidden md:flex space-x-8">
            <Link to="/about" className={styles.nav.link}>About</Link>
            <Link to="/classes" className={styles.nav.link}>Classes</Link>
            <Link to="/faqs" className={styles.nav.link}>FAQs</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {auth.isLoading ? null : auth.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {displayName ? (
                  <span className={styles.nav.user}>{displayName}</span>
                ) : null}
                <button
                  onClick={() => void auth.signOut()}
                  className={styles.nav.link}
                >
                  Logout
                </button>
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
            {auth.isLoading ? null : auth.isAuthenticated ? (
              <div className="flex flex-col space-y-3 w-full">
                {displayName ? (
                  <span className={`${styles.nav.user} text-sm opacity-70`}>{displayName}</span>
                ) : null}
                <button
                  onClick={() => {
                    void auth.signOut();
                    setIsOpen(false);
                  }}
                  className={`${styles.nav.link} w-full text-center py-2`}
                >
                  Logout
                </button>
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
      </div>
    </nav>
  );
}

function Logo({isOpen}: {isOpen: boolean}) {
  return (
    <div className="nav-header-row">
      <picture>
        {/* If viewport width is less than 48rem (768px), display the small mobile logo */}
        {!isOpen && <source srcSet={mobileLogo} media="(max-width: 47.99rem)" />}
        {/* Fallback baseline: displays the full desktop logo on larger screens */}
        <img 
          src={logoLight} 
          alt="Sum Of Us Logo" 
          className="site-nav-logo" 
          width={isOpen ? "175rem" : "auto"} 
        />
      </picture>
    </div>
  );
}