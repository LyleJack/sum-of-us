import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

const cognitoRegion = getRequiredEnv("VITE_COGNITO_REGION");
const cognitoClientId = getRequiredEnv("VITE_COGNITO_CLIENT_ID");
const authStorageKey = "sumOfUs.auth";

const cognito = new CognitoIdentityProviderClient({
  region: cognitoRegion,
});

type StoredAuth = {
  accessToken?: string;
  email?: string;
  expiresAt?: number;
  idToken?: string;
  name?: string;
  refreshToken?: string;
  sub?: string;
};

type SignUpDetails = {
  accessRequirements?: string;
  email: string;
  name: string;
  password: string;
  surname: string;
};

type AwsAuthContextValue = {
  error?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (
    details: SignUpDetails,
  ) => Promise<{ confirmationUsername: string; needsConfirmation: boolean }>;
  confirmSignUp: (
    username: string,
    confirmationCode: string,
    password: string,
    email: string,
  ) => Promise<void>;
  user?: StoredAuth;
};

const AwsAuthContext = createContext<AwsAuthContextValue | null>(null);

export function AwsAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredAuth | undefined>(() => loadStoredAuth());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const storeSession = (
    authResult: AuthenticationResultType | undefined,
    fallbackEmail: string,
  ) => {
    if (!authResult?.AccessToken || !authResult.IdToken) {
      throw new Error("Cognito did not return a complete session.");
    }

    const profile = decodeJwtPayload(authResult.IdToken);
    const nextUser: StoredAuth = {
      accessToken: authResult.AccessToken,
      email: stringClaim(profile.email) ?? fallbackEmail,
      expiresAt: authResult.ExpiresIn
        ? Date.now() + authResult.ExpiresIn * 1000
        : undefined,
      idToken: authResult.IdToken,
      name: stringClaim(profile.name),
      refreshToken: authResult.RefreshToken,
      sub: stringClaim(profile.sub),
    };

    localStorage.setItem(authStorageKey, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await cognito.send(
        new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: cognitoClientId,
          AuthParameters: {
            PASSWORD: password,
            USERNAME: email,
          },
        }),
      );

      if (response.ChallengeName) {
        throw new Error(
          `Cognito returned ${response.ChallengeName}. This flow is not implemented yet.`,
        );
      }

      storeSession(response.AuthenticationResult, email);
    } catch (caught) {
      const message = getCognitoMessage(caught);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (details: SignUpDetails) => {
    setIsLoading(true);
    setError(undefined);
    const username = createCognitoUsername();

    try {
      const response = await cognito.send(
        new SignUpCommand({
          ClientId: cognitoClientId,
          Password: details.password,
          Username: username,
          UserAttributes: [
            { Name: "email", Value: details.email },
            { Name: "name", Value: details.name },
            { Name: "family_name", Value: details.surname },
          ],
        }),
      );

      // TODO: Persist signup profile details, including access requirements,
      // to the membership table after the Cognito user has been created.
      void details.accessRequirements;

      return {
        confirmationUsername: username,
        needsConfirmation: !response.UserConfirmed,
      };
    } catch (caught) {
      const message = getCognitoMessage(caught);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUp = async (
    username: string,
    confirmationCode: string,
    password: string,
    email: string,
  ) => {
    setIsLoading(true);
    setError(undefined);

    try {
      await cognito.send(
        new ConfirmSignUpCommand({
          ClientId: cognitoClientId,
          ConfirmationCode: confirmationCode,
          Username: username,
        }),
      );

      await signIn(email, password);
    } catch (caught) {
      const message = getCognitoMessage(caught);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    const accessToken = user?.accessToken;
    setIsLoading(true);
    setError(undefined);

    try {
      if (accessToken) {
        await cognito.send(
          new GlobalSignOutCommand({
            AccessToken: accessToken,
          }),
        );
      }
    } catch {
      // Local sign-out still clears the browser session if the token is expired.
    } finally {
      localStorage.removeItem(authStorageKey);
      setUser(undefined);
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      error,
      isAuthenticated: Boolean(user?.accessToken),
      isLoading,
      signIn,
      signOut,
      signUp,
      confirmSignUp,
      user,
    }),
    [error, isLoading, user],
  );

  return (
    <AwsAuthContext.Provider value={value}>{children}</AwsAuthContext.Provider>
  );
}

export function useAwsAuth() {
  const context = useContext(AwsAuthContext);

  if (!context) {
    throw new Error("useAwsAuth must be used within AwsAuthProvider");
  }

  return context;
}

function loadStoredAuth() {
  try {
    const stored = localStorage.getItem(authStorageKey);

    if (!stored) {
      return undefined;
    }

    const parsed = JSON.parse(stored) as StoredAuth;

    if (parsed.expiresAt && parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(authStorageKey);
      return undefined;
    }

    return parsed;
  } catch {
    localStorage.removeItem(authStorageKey);
    return undefined;
  }
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split(".");

  if (!payload) {
    return {};
  }

  try {
    return JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as Record<
      string,
      unknown
    >;
  } catch {
    return {};
  }
}

function stringClaim(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function getRequiredEnv(key: string) {
  const value = import.meta.env[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function createCognitoUsername() {
  const browserCrypto = globalThis.crypto;

  if (browserCrypto.randomUUID) {
    return `user_${browserCrypto.randomUUID().replaceAll("-", "")}`;
  }

  const bytes = browserCrypto.getRandomValues(new Uint8Array(16));
  const suffix = Array.from(bytes, (byte: number) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `user_${suffix}`;
}

function getCognitoMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
