import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

/**
 * Clerk redirects here after Google / Facebook / Apple OAuth.
 * It handles the token exchange automatically, then sends the
 * user to redirectUrlComplete (set to "/" in handleOAuth).
 *
 * Add this as a route in your router:
 *   <Route path="/sso-callback" element={<SSOCallback />} />
 */

export default function SSOCallback() {
  return (
    <AuthenticateWithRedirectCallback />
  );
}
