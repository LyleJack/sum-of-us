import {
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { cx, styles } from "../styles";
import { useAwsAuth } from "./AwsAuth";

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

// TODO: Hook into DB add on successful user signup to add the details to the DB too 

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isOpen, setIsOpen] = useState(false);

  const openAuthModal = (nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  };

  const closeAuthModal = () => setIsOpen(false);

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
  }, [isOpen]);

  const value = useMemo(
    () => ({
      openAuthModal,
      closeAuthModal,
    }),
    [],
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
  const auth = useAwsAuth();
  const titleId = useId();
  const [over16, setOver16] = useState(false);
  const [accessRequirements, setAccessRequirements] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pendingConfirmationUsername, setPendingConfirmationUsername] =
    useState("");
  const [surname, setSurname] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const isSignup = mode === "signup";

  useEffect(() => {
    setFormError(undefined);
    setNeedsConfirmation(false);
    setConfirmationCode("");
    setPasswordVisible(false);
    setPendingConfirmationUsername("");
  }, [mode]);


  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);

    try {
      if (needsConfirmation) {
        await auth.confirmSignUp(
          pendingConfirmationUsername,
          confirmationCode,
          password,
          email,
        );
        onClose();
        return;
      }

      if (isSignup) {
        if (password !== passwordConfirmation) {
          setFormError("Passwords do not match.");
          return;
        }

        const result = await auth.signUp({
          accessRequirements,
          email,
          name,
          password,
          surname,
        });

        if (result.needsConfirmation) {
          setPendingConfirmationUsername(result.confirmationUsername);
          setNeedsConfirmation(true);
          return;
        }

        await auth.signIn(email, password);
        onClose();
        return;
      }

      await auth.signIn(email, password);
      onClose();
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
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

        <h2
          className={styles.auth.title}
          id={titleId}
        >
          {needsConfirmation
            ? "Confirm signup"
            : isSignup
              ? "Get started"
              : "Hello there 👀"}
        </h2>
        <p className={styles.auth.intro}>
          {needsConfirmation
            ? "Enter the confirmation code sent by Cognito to finish creating your account."
            : isSignup
              ? "Please enter your details"
              : "Enter your details below to access your account book classes and review membership options."}
        </p>

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
                  onChange={(event) => setAccessRequirements(event.target.value)}
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
                  <span className={styles.auth.ageCopy}>I'm 16+ years old.</span>
                   <span
            aria-hidden="true"
            className={cx(styles.auth.requiredMark, styles.auth.requiredAtEnd)}
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
              onClick={() => {alert("Great job 👍")}}
            >
              Forgot password
            </button>
          )}

          {formError || auth.error ? (
            <p className={styles.auth.error}>
              {formError ?? auth.error}
            </p>
          ) : null}

          <button
            className={styles.auth.submit}
            disabled={auth.isLoading}
            type="submit"
          >
            {auth.isLoading
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
