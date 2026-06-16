import { useRef, useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { styles } from "../styles";

export function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n![0].toUpperCase())
    .join("") || user?.primaryEmailAddress?.emailAddress?.[0].toUpperCase() || "?";

  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress;

  return (
    <div className={styles.user.menu} ref={menuRef}>
      {/* Avatar trigger */}
      <button
        className={styles.user.menuTrigger}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName ?? ""}
            className={styles.user.menuAvatar}
          />
        ) : (
          <span className={styles.user.menuInitials}>{initials}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.user.menuDropdown} role="menu">
          {/* User info header */}
          <div className={styles.user.menuInfo}>
            <p className={styles.user.menuInfoName}>{displayName}</p>
            <p className={styles.user.menuInfoEmail}>
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <div className={styles.user.menuDivider} />

          {/* Manage account → members page */}
          <button
            className={styles.user.menuItem}
            role="menuitem"
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/members");
            }}
          >
            <ManageIcon />
            Manage account
          </button>

          <div className={styles.user.menuDivider} />

          {/* Sign out */}
          <button
        //   no sign out style yet maybe?? missing user-menu-item--signout
            className={styles.user.menuItem}
            role="menuitem"
            type="button"
            onClick={() => void signOut()}
          >
            <SignOutIcon />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function ManageIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}