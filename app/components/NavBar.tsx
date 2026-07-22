import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import classicLogo from "../sum-of-us-logo.svg";
import mobileLogo from "../images/mobileLogo.svg";
import { useAuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";
import { styles } from "../styles";

export function NavBar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [isOpen, setIsOpen] = useState(false);
  const firstDrawerLink = useRef<HTMLAnchorElement>(null);
  const closeDrawer = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    firstDrawerLink.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <header className={styles.nav.shell}>
      <div className={styles.nav.header}>
        {!isOpen && <Link to="/" className={styles.nav.brand} onClick={closeDrawer} aria-label="Sum Of Us home">
          <img src={mobileLogo} alt="" className={styles.nav.compactLogo} />
          <img src={classicLogo} alt="Sum Of Us" className={styles.nav.fullLogo} />
        </Link>}

        <nav className={styles.nav.desktopLinks} aria-label="Primary navigation">
          <Link to="/about" className={styles.nav.link}>About</Link>
          <Link to="/classes" className={styles.nav.link}>Classes</Link>
          <Link to="/faqs" className={styles.nav.link}>FAQs</Link>
        </nav>

        <div className={styles.nav.desktopActions}>
          {isLoaded && (isSignedIn ? <UserMenu /> : <button type="button" onClick={() => openAuthModal("login")} className={styles.nav.link}>Login</button>)}
          <Link to="/booking" className={styles.button.primarySmall}>Book Now</Link>
        </div>

        <button type="button" className={styles.nav.menuButton} onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" />
      </div>

      {isOpen && <>
        <button type="button" className={styles.nav.backdrop} aria-label="Close navigation menu" onClick={closeDrawer} />
        <aside className={styles.nav.drawer} id="mobile-navigation" aria-label="Mobile navigation">
          <Link to="/" onClick={closeDrawer} aria-label="Sum Of Us home">
            <img src={classicLogo} alt="Sum Of Us" className={styles.nav.drawerLogo} />
          </Link>
          <nav className={styles.nav.drawerLinks} aria-label="Primary navigation">
            <Link ref={firstDrawerLink} to="/about" className={styles.nav.link} onClick={closeDrawer}>About</Link>
            <Link to="/classes" className={styles.nav.link} onClick={closeDrawer}>Classes</Link>
            <Link to="/faqs" className={styles.nav.link} onClick={closeDrawer}>FAQs</Link>
          </nav>
          <div className={styles.nav.drawerActions}>
            {isLoaded && (isSignedIn ? <UserMenu setNavBarShoudBeOpen={setIsOpen} /> : <button type="button" onClick={() => { openAuthModal("login"); closeDrawer(); }} className={styles.nav.link}>Login</button>)}
            <Link to="/booking" className={styles.button.primarySmall} onClick={closeDrawer}>Book Now</Link>
          </div>
        </aside>
      </>}
    </header>
  );
}
