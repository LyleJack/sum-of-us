import { Link } from "react-router";
import { useAwsAuth } from "./AwsAuth";
import { useAuthModal } from "./AuthModal";
import logoDark from "../sum-of-us-logo.svg";
import logoLight from "../sum-of-us-logo.svg";
import { styles } from "../styles";
import {
  colorSchemeNames,
  type ColorSchemeName,
  useColorScheme,
} from "../theme";

export function NavBar() {
  const auth = useAwsAuth();
  const { openAuthModal } = useAuthModal();
  const { schemeName, setSchemeName } = useColorScheme();
  const displayName = auth.user?.name ?? auth.user?.email;

  return (
    <nav className={styles.nav.shell}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Icon */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src={schemeName === "dark" ? logoLight : logoDark}
                alt="Sum Of Us Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/about"
              className={styles.nav.link}
            >
              About
            </Link>
            <Link
              to="/classes"
              className={styles.nav.link}
            >
              Classes
            </Link>
            <Link
              to="/faqs"
              className={styles.nav.link}
            >
              FAQs
            </Link>
          </div>

          {/* Right: Book Now, Login/Logout and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              to="/booking"
              className={styles.button.primarySmall}
            >
              Book Now
            </Link>
            {auth.isLoading ? null : auth.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {displayName ? (
                  <span className={styles.nav.user}>
                    {displayName}
                  </span>
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
            {/* <select
              aria-label="Color scheme"
              className={styles.nav.schemeSelect}
              onChange={(event) =>
                setSchemeName(event.target.value as ColorSchemeName)
              }
              value={schemeName}
            >
              {colorSchemeNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))} 
            </select>*/}
          </div>
        </div>
      </div>
    </nav>
  );
}
