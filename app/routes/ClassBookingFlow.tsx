import { useState, useMemo, useCallback } from "react";
import { styles } from "../styles";

export interface ClassBookingFlowProps {
  activeMembership?: boolean;
  freeTrial?: boolean;
  excludedDates?: Record<string, boolean>; // expected format: { "2026-06-17": false }
}

type Screen         = "select" | "payment";
type Tab            = "byClass" | "monthly";
type ConfirmVariant = "class" | "monthly" | "freeTrial" | "member";

const MONTHS = [
  "January", "February", "March",     "April",   "May",      "June",
  "July",    "August",   "September", "October", "November", "December",
];

function toKey(d: Date): string {
  const y  = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${dd}`;
}

function getClassDates(
  excluded: Record<string, boolean> = {},
  max = 6,
): Date[] {
  const classDates: Date[] = [];
  const day = new Date();
  day.setHours(0, 0, 0, 0);

  while (classDates.length < max) {
    const dow = day.getDay(); // 2 = Tuesday, 4 = Thursday
    if ((dow === 2 || dow === 4) && excluded[toKey(day)] !== false) {
      classDates.push(new Date(day));
    }
    day.setDate(day.getDate() + 1);
  }
  return classDates;
}


/**  
  ||| PLACEHOLDER CODE |||
 TODO: check if Stripe handles this and then remove it later if so 
 Format raw digits as "1234 5678 9012 3456" */
const fmtCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

/** Format raw digits as "MM / YY" */
const fmtExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

export function ClassBookingFlow({
  activeMembership = false,
  freeTrial        = false,
  excludedDates    = {},
}: ClassBookingFlowProps) {

  // ── State ────────────────────────────────────────────────────────

  const showTabs = !activeMembership && !freeTrial;

  const [tab,      setTab]      = useState<Tab>("byClass");
  const [screen,   setScreen]   = useState<Screen>("select");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm,  setConfirm]  = useState<ConfirmVariant | null>(null);

  // Card form fields (Stripe placeholder — swap body of handlePay for real integration)
  const [cardName,   setCardName]   = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc,    setCardCvc]    = useState("");


  const dates       = useMemo(() => getClassDates(excludedDates), []);
  const isMonthly   = tab === "monthly";
  const datesLocked = activeMembership || isMonthly;

  const canContinue =
    activeMembership || freeTrial || isMonthly || selected.size > 0;

  const ctaLabel =
    freeTrial ? "Book your trial class" : activeMembership ? "Continue" : "Continue to payment";

  const selectHeading =
    activeMembership ? "No Booking Required"
    : isMonthly      ? "All Classes, One Monthly Fee"
    :                  "Select your class";

  const selectSubtext =
    activeMembership
      ? "Feel free to drop into any class — your active membership has you covered, no booking needed."
    : isMonthly
      ? "With a monthly membership, every Tuesday and Thursday class is open to you."
    :   "Click to select your preferred date";

  const toggleDate = useCallback(
    (key: string) => {
      if (datesLocked) return;
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          if (freeTrial) next.clear();
          next.add(key);
        }
        return next;
      });
    },
    [datesLocked, freeTrial],
  );

  const handleContinue = () => {
    if (freeTrial)          setConfirm("freeTrial");
    else if (activeMembership) setConfirm("member");
    else                    setScreen("payment");
  };

  const handlePay = () => {
    // TODO: swap for real Stripe call — e.g. stripe.confirmPayment(...)
    setConfirm(isMonthly ? "monthly" : "class");
  };

  const handleConfirmOk = () => {
    setConfirm(null);
    // TODO: navigate to membership screen
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setScreen("select");
    setSelected(new Set());
  };

  return (
    <div className={styles.booking.shell}>
      {showTabs && (
        <nav className={styles.booking.tabs.nav} aria-label="Payment type">
          {(["byClass", "monthly"] as Tab[]).map((t) => (
            <button
              key={t}
              className={tab === t ? styles.booking.tabs.tabOn : styles.booking.tabs.tab}
              onClick={() => switchTab(t)}
              aria-current={tab === t ? "page" : undefined}
            >
              {t === "byClass" ? "Pay by Class" : "Pay Monthly"}
            </button>
          ))}
        </nav>
      )}
      {screen === "select" && (
        <>
          <h1 className={styles.booking.heading}>{selectHeading}</h1>
          <p  className={styles.booking.sub}>{selectSubtext}</p>

          <div
            className={datesLocked ? styles.booking.grid.locked : styles.booking.grid.normal}
            role="group"
            aria-label="Available class dates"
          >
            {dates.map((date) => {
              const key = toKey(date);
              const isOn = selected.has(key);

              return (
                <button
                  key={key}
                  className={
                    datesLocked ? styles.booking.card.locked
                    : isOn      ? styles.booking.card.selected
                    :             styles.booking.card.normal
                  }
                  onClick={() => toggleDate(key)}
                  aria-pressed={!datesLocked ? isOn : undefined}
                  tabIndex={datesLocked ? -1 : 0}
                >
                  <span className={styles.booking.card.mo}>{MONTHS[date.getMonth()]}</span>
                  <span className={styles.booking.card.day}>{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          <button
            className={canContinue ? styles.booking.cta.base : styles.booking.cta.dim}
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {ctaLabel}
          </button>
          
        </>
      )}


      {/* TODO: || TO BE REPLACED BY STRIPE || */}
      {screen === "payment" && (
        <>
          <h1 className={styles.booking.heading}>Payment options</h1>
          <p  className={styles.booking.sub}>
            {isMonthly
              ? "Set up your monthly recurring membership"
              : "Select how you want to pay"}
          </p>

          <div className={styles.booking.payment.divider} />
          <span className={styles.booking.payment.sectionLabel}>Pay with card</span>

          {/* Stripe placeholder — replace inputs with <Elements> from @stripe/react-stripe-js */}
          <div className={styles.booking.payment.form}>
            <input
              className={styles.booking.payment.inp}
              placeholder="Name on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              autoComplete="cc-name"
            />
            <div className={styles.booking.payment.inpRow}>
              <input
                className={styles.booking.payment.inpWithGrow}
                placeholder="Card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(fmtCard(e.target.value))}
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={19}
              />
              <input
                className={styles.booking.payment.inpCvc}
                placeholder="CVC"
                value={cardCvc}
                onChange={(e) =>
                  setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
              />
            </div>
            <input
              className={styles.booking.payment.inp}
              placeholder="MM / YY"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(fmtExpiry(e.target.value))}
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={7}
            />

            <button className={styles.booking.cta.withGap} onClick={handlePay}>
              {isMonthly ? "Subscribe monthly" : "Pay with card (CONTINUE)"}
            </button>
          </div>

          <div className={styles.booking.payment.divider} />
          <span className={styles.booking.payment.sectionLabel}>Or checkout with</span>

          <div className={styles.booking.payment.wallets}>
            <button
              className={styles.booking.payment.wallet}
              onClick={handlePay}
              aria-label="Pay with Google Pay"
            >
              <GooglePayLogo />
            </button>
            <button
              className={styles.booking.payment.wallet}
              onClick={handlePay}
              aria-label="Pay with Apple Pay"
            >
              <ApplePayLogo />
            </button>
          </div>

          {isMonthly && (
            <p className={styles.booking.payment.fine}>
              Billed monthly. Cancel anytime in your account settings.
            </p>
          )}
        </>
      )}

      {confirm && (
        <div
          className={styles.booking.modal.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-confirm-heading"
        >
          <div className={styles.booking.modal.dialog}>
            <div className={styles.booking.modal.check} aria-hidden="true">✓</div>

            <h2 className={styles.booking.modal.heading} id="booking-confirm-heading">
              {confirm === "freeTrial" ? "You're In!"
                : confirm === "member"  ? "See You There!"
                : confirm === "monthly" ? "Membership Confirmed!"
                :                        "Booking Confirmed!"}
            </h2>

            <p className={styles.booking.modal.body}>
              {confirm === "freeTrial"
                ? "Your free trial class is all set. Expect a confirmation email shortly."
                : confirm === "member"
                ? "Just show up — no booking needed with your active membership."
                : confirm === "monthly"
                ? "Welcome! Your monthly membership is now active. Check your email for details."
                : "Your class is booked. You'll receive a confirmation email soon."}
            </p>

            <button className={styles.booking.modal.ok} onClick={handleConfirmOk}>
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}



/* TODO: replace logos properly/see if stripe provides them */
function GooglePayLogo() {
  return (
    <svg
      width="76" height="20" viewBox="0 0 76 20"
      fill="none" aria-hidden="true"
    >
      {/* Multicolour G mark */}
      <path d="M9.62 8.64H5.82v1.56h2.19c-.21 1.05-1.12 1.7-2.19 1.7-1.3 0-2.35-1.05-2.35-2.35 0-1.3 1.05-2.35 2.35-2.35.57 0 1.1.21 1.5.55l1.11-1.1A3.85 3.85 0 005.83 5.5 4.05 4.05 0 001.78 9.55a4.05 4.05 0 004.05 4.05 3.72 3.72 0 003.84-3.84c0-.38-.04-.73-.05-1.12z" fill="#4285F4"/>
      <path d="M2.78 7.6 1.54 6.7A4.02 4.02 0 000 9.55c0 1.04.38 1.98 1 2.7l1.24-.96a2.5 2.5 0 01-.46-1.74c0-.67.22-1.3.58-1.95z" fill="#FBBC05"/>
      <path d="M5.83 13.6c1.0 0 1.87-.33 2.5-.9L7.1 11.6c-.36.25-.82.4-1.27.4-1.05 0-1.96-.7-2.26-1.66L2.24 11.4a4.05 4.05 0 003.59 2.2z" fill="#34A853"/>
      <path d="M9.62 8.64c0-.38-.04-.73-.1-1.07l-3.69.01v1.56h2.19c-.1.37-.3.7-.57.97l1.23 1.1a3.69 3.69 0 00.94-2.57z" fill="#EA4335"/>
      {/* "Pay" wordmark */}
      <text x="14" y="14.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
        fontSize="13" fontWeight="500" fill="white" letterSpacing="0.2">
        Pay
      </text>
    </svg>
  );
}

function ApplePayLogo() {
  return (
    <svg
      width="72" height="20" viewBox="0 0 72 20"
      fill="white" aria-hidden="true"
    >
      {/* Apple mark */}
      <path d="M7.7 4.1c.44-.54.74-1.28.66-2.04-.64.06-1.42.43-1.88.97-.41.47-.77 1.22-.67 1.94.71.05 1.44-.36 1.89-.87zm.62.89C7.22 4.9 6.42 5.5 5.9 5.5c-.5 0-1.3-.55-2.07-.53-1.06.02-2.04.62-2.58 1.57-1.1 1.9-.28 4.72.78 6.27.52.77 1.14 1.62 1.96 1.59.78-.03 1.08-.5 2.01-.5.93 0 1.2.5 2.03.48.85-.02 1.38-.77 1.9-1.54.6-.88.84-1.74.86-1.79 0 0-1.65-.64-1.67-2.52-.02-1.57 1.28-2.32 1.34-2.37-.74-1.08-1.88-1.2-2.28-1.23l.04.03z"/>
      {/* "Pay" wordmark */}
      <text x="14" y="14.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
        fontSize="13" fontWeight="400" fill="white" letterSpacing="0.2">
        Pay
      </text>
    </svg>
  );
}


// ═══════════════════════════════════════════════════════════════════
// Demo wrapper  (default export — dev / Storybook preview only)
// ═══════════════════════════════════════════════════════════════════

const DEMO_CSS = `
  .booking-demo {
    min-height: 100vh;
    background: #1A1815;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    gap: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  }
  .booking-demo-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .booking-demo-toggle {
    background: #2B2826;
    border: 1.5px solid #3A3733;
    border-radius: 50px;
    color: #70706D;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: border-color 0.15s, color 0.15s;
    font-family: inherit;
  }
  .booking-demo-toggle[data-on="true"] {
    border-color: #D4F046;
    color: #D4F046;
  }
  .booking-demo-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }
  .booking-demo-hint {
    font-size: 11px;
    color: white;
    letter-spacing: 0.04em;
  }
`;

export default function Demo() {
  const [activeMembership, setActiveMembership] = useState(false);
  const [freeTrial,        setFreeTrial]        = useState(false);

  const toggleMember = () => {
    setActiveMembership((v) => !v);
    setFreeTrial(false);
  };

  const toggleTrial = () => {
    setFreeTrial((v) => !v);
    setActiveMembership(false);
  };

  return (
    <>
      <style>{DEMO_CSS}</style>
            <ClassBookingFlow
          key={`${activeMembership}-${freeTrial}`}
          activeMembership={activeMembership}
          freeTrial={freeTrial}
        />

        <div className="booking-demo-controls">
          <button
            className="booking-demo-toggle"
            data-on={String(activeMembership)}
            onClick={toggleMember}
          >
            <span className="booking-demo-dot" />
            activeMembership
          </button>
          <button
            className="booking-demo-toggle"
            data-on={String(freeTrial)}
            onClick={toggleTrial}
          >
            <span className="booking-demo-dot" />
            freeTrial
          </button>
        </div>
        <p className="booking-demo-hint">
          For Demo Purposes only toggle props above · select dates · walk through the full flow
        </p>
      {/* </div> */}
    </>
  );
}
