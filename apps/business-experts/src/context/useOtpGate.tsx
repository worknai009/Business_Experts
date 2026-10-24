import { useCallback, useRef, useState } from "react";
import OtpVerifyModal from "../components/OtpVerifyModal";

/**
 * Gates an action behind email OTP verification. Call `verify(email)` — it
 * resolves with a fresh otpToken once the user completes the modal, or
 * rejects (never resolves further) if they cancel it.
 */
export function useOtpGate() {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const resolverRef = useRef<((token: string | null) => void) | null>(null);

  const verify = useCallback((email: string) => {
    setPendingEmail(email);
    return new Promise<string | null>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  function handleVerified(token: string) {
    resolverRef.current?.(token);
    resolverRef.current = null;
    setPendingEmail(null);
  }

  function handleClose() {
    resolverRef.current?.(null);
    resolverRef.current = null;
    setPendingEmail(null);
  }

  const modal = pendingEmail ? (
    <OtpVerifyModal email={pendingEmail} onVerified={handleVerified} onClose={handleClose} />
  ) : null;

  return { verify, otpModal: modal };
}
