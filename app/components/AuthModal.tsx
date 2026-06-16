import {
  createContext,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { cx, styles } from "../styles";

type AuthMode = "login" | "signup";

type AuthModalContextValue = {
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }

  return context;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isOpen, setIsOpen] = useState(false);

  const openAuthModal = (nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  };

  const closeAuthModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAuthModal();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeAuthModal]);

  const value = useMemo(
    () => ({
      openAuthModal,
      closeAuthModal,
    }),
    [closeAuthModal],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {isOpen ? (
        <AuthModal
          mode={mode}
          onClose={closeAuthModal}
          onModeChange={setMode}
        />
      ) : null}
    </AuthModalContext.Provider>
  );
}

type AuthModalProps = {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
};

function AuthModal({ mode, onClose, onModeChange }: AuthModalProps) {
  const titleId = useId();

  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();
  const isLoaded = signInLoaded && signUpLoaded;

  const [over16, setOver16] = useState(false);
  const [accessRequirements, setAccessRequirements] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [surname, setSurname] = useState("");

  const isSignup = mode === "signup";

  useEffect(() => {
    setFormError(undefined);
    setNeedsConfirmation(false);
    setConfirmationCode("");
    setPasswordVisible(false);
  }, [mode]);

  const handleOAuth = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple",
  ) => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: window.location.origin,
      });
    } catch (caught) {
      setFormError(
        caught instanceof Error ? caught.message : "OAuth sign in failed.",
      );
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded || !signIn || !signUp) return;

    setFormError(undefined);
    setIsLoading(true);

    try {
      // Step 2 of signup: verify the email code
      if (needsConfirmation) {
        const result = await signUp.attemptEmailAddressVerification({
          code: confirmationCode,
        });

        if (result.status === "complete") {
          // TODO: Hook into DB on successful user signup to add the details to the DB too
          await setSignUpActive({ session: result.createdSessionId });
          onClose();
        } else {
          setFormError("Verification incomplete — please try again.");
        }

        return;
      }

      // Step 1 of signup: create account and send verification email
      if (isSignup) {
        if (password !== passwordConfirmation) {
          setFormError("Passwords do not match.");
          return;
        }

        await signUp.create({
          emailAddress: email,
          password,
          firstName: name,
          lastName: surname,
          // TODO: Custom club fields stored as metadata; sync to DB 
          unsafeMetadata: { accessRequirements, over16 },
        });

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setNeedsConfirmation(true);
        return;
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        onClose();
      } else {
        setFormError("Sign in incomplete — please try again.");
      }
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!signIn) return;
    if (!email) {
      setFormError("Enter your email above first.");
      return;
    }

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      // TODO: Implement a password reset confirmation step (similar to needsConfirmation)
      alert("Password reset email sent — check your inbox.");
    } catch (caught) {
      setFormError(
        caught instanceof Error ? caught.message : "Failed to send reset email.",
      );
    }
  };

  return (
    <div
      className={styles.auth.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.auth.dialog}
        role="dialog"
      >
        <button
          aria-label="Close"
          className={styles.auth.closeButton}
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <h2 className={styles.auth.title} id={titleId}>
          {needsConfirmation
            ? "Confirm signup"
            : isSignup
              ? "Get started"
              : "Hello there 👀"}
        </h2>
        <p className={styles.auth.intro}>
          {needsConfirmation
            ? "Enter the confirmation code we emailed you to finish creating your account."
            : isSignup
              ? "Please enter your details"
              : "Enter your details below to access your account, book classes and review membership options."}
        </p>

        {/* OAuth buttons — hidden during email confirmation step */}
        {!needsConfirmation && (
          <>
            <div className={styles.auth.oauthButtons}>
              <button
                className={styles.auth.oauthButton}
                onClick={() => handleOAuth("oauth_google")}
                type="button"
              >
                <GoogleIcon />
                Login with <br/>Google
              </button>
              <button
                className={styles.auth.oauthButton}
                onClick={() => handleOAuth("oauth_facebook")}
                type="button"
              >
                <FacebookIcon />
                Login with <br/>Facebook
              </button>
            </div>
            <div className={styles.auth.divider}>
              <span className={styles.auth.dividerText}>or</span>
            </div>
          </>
        )}

        <form className={styles.auth.form} onSubmit={submit}>
          {needsConfirmation ? (
            <AuthInput
              autoComplete="one-time-code"
              label="Confirmation code"
              onChange={setConfirmationCode}
              required
              value={confirmationCode}
            />
          ) : isSignup ? (
            <>
              <AuthInput
                label="Name"
                onChange={setName}
                required
                value={name}
              />
              <AuthInput
                label="Surname"
                onChange={setSurname}
                required
                value={surname}
              />
            </>
          ) : null}

          {needsConfirmation ? null : (
            <>
              <AuthInput
                autoComplete="email"
                label="Email"
                onChange={setEmail}
                required
                type="email"
                value={email}
              />
              <AuthInput
                autoComplete={isSignup ? "new-password" : "current-password"}
                label="Password"
                onChange={setPassword}
                required
                type={passwordVisible ? "text" : "password"}
                value={password}
                visibilityButton={
                  <PasswordVisibilityButton
                    isVisible={passwordVisible}
                    onToggle={() => setPasswordVisible((current) => !current)}
                  />
                }
              />
            </>
          )}

          {!needsConfirmation && isSignup ? (
            <>
              <AuthInput
                autoComplete="new-password"
                label="Confirm password"
                onChange={setPasswordConfirmation}
                required
                type={passwordVisible ? "text" : "password"}
                value={passwordConfirmation}
                visibilityButton={
                  <PasswordVisibilityButton
                    isVisible={passwordVisible}
                    onToggle={() => setPasswordVisible((current) => !current)}
                  />
                }
              />
              <label className={styles.auth.accessLabel}>
                <span className={styles.auth.accessCopy}>
                  Do you have any access requirements or medical needs we need
                  to be aware of?
                </span>
                <input
                  className={styles.auth.accessInput}
                  onChange={(event) =>
                    setAccessRequirements(event.target.value)
                  }
                  placeholder="Let us know"
                  type="text"
                  value={accessRequirements}
                />
              </label>
              <div className={styles.auth.fieldControl}>
                <label className={styles.auth.ageLabel}>
                  <input
                    className={styles.auth.ageInput}
                    required
                    onChange={(e) => setOver16(e.target.checked)}
                    type="checkbox"
                    checked={over16}
                  />
                  <span className={styles.auth.ageCopy}>
                    I&apos;m 16+ years old.
                  </span>
                  <span
                    aria-hidden="true"
                    className={cx(
                      styles.auth.requiredMark,
                      styles.auth.requiredAtEnd,
                    )}
                  >
                    *
                  </span>
                </label>
              </div>
            </>
          ) : needsConfirmation ? null : (
            <button
              className={styles.auth.forgotLink}
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot password
            </button>
          )}

          {formError ? (
            <p className={styles.auth.error}>{formError}</p>
          ) : null}

          <button
            className={styles.auth.submit}
            disabled={!isLoaded || isLoading}
            type="submit"
          >
            {isLoading
              ? "Please wait"
              : needsConfirmation
                ? "Confirm"
                : isSignup
                  ? "Sign up"
                  : "Login"}
          </button>
        </form>

        {isSignup || needsConfirmation ? null : (
          <p className={styles.auth.footer}>
            Don&apos;t have an account?{" "}
            <button
              className={styles.auth.footerButton}
              onClick={() => onModeChange("signup")}
              type="button"
            >
              Sign up
            </button>{" "}
            for free.
          </p>
        )}
      </section>
    </div>
  );
}

type AuthInputProps = {
  autoComplete?: string;
  label: string;
  onChange?: (value: string) => void;
  required?: boolean;
  type?: string;
  value?: string;
  visibilityButton?: ReactNode;
};

function AuthInput({
  autoComplete,
  label,
  onChange,
  required = false,
  type = "text",
  value,
  visibilityButton,
}: AuthInputProps) {
  const inputId = useId();

  return (
    <label className={styles.auth.field} htmlFor={inputId}>
      <span className="sr-only">{label}</span>
      <div className={styles.auth.fieldControl}>
        <input
          autoComplete={autoComplete}
          className={cx(
            styles.auth.input,
            visibilityButton
              ? styles.auth.inputWithAction
              : required
                ? styles.auth.inputRequired
                : "",
          )}
          id={inputId}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={label}
          required={required}
          type={type}
          value={value}
        />
        {visibilityButton}
        {required ? (
          <span
            aria-hidden="true"
            className={cx(
              styles.auth.requiredMark,
              visibilityButton
                ? styles.auth.requiredWithAction
                : styles.auth.requiredAtEnd,
            )}
          >
            *
          </span>
        ) : null}
      </div>
    </label>
  );
}

type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  onToggle: () => void;
};

function PasswordVisibilityButton({
  isVisible,
  onToggle,
}: PasswordVisibilityButtonProps) {
  return (
    <button
      aria-label={isVisible ? "Hide password" : "Show password"}
      className={styles.auth.passwordToggle}
      onClick={onToggle}
      type="button"
    >
      {isVisible ? "Hide" : "Show"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18">
      <path
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
        fill="#1877F2"
      />
    </svg>
  );
}
