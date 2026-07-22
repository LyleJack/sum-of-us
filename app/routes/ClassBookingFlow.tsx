import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router";
import { FeedbackDialog, type FeedbackTone } from "../components/FeedbackDialog";
import { useAuthModal } from "../components/AuthModal";
import { styles } from "../styles";

export interface ClassBookingFlowProps {
  activeMembership?: boolean;
  freeTrial?: boolean;
  excludedDates?: Record<string, boolean>;
}

type Tab = "byClass" | "monthly";
type CheckoutConfirmation = { status: "confirmed"; purchaseType: "class" | "monthly"; classCount?: number; months?: number };
type BookingContext = { activeMembership: boolean; freeTrial: boolean; excludedDates: Record<string, boolean> };
type Feedback = { tone: FeedbackTone; title: string; body: string; actionLabel?: string; onAction?: () => void; dismissible?: boolean };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getClassDates(excluded: Record<string, boolean> = {}, max = 6): Date[] {
  const dates: Date[] = [];
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  while (dates.length < max) {
    if ((day.getDay() === 2 || day.getDay() === 4) && excluded[toKey(day)] !== false) dates.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  return dates;
}

export async function bookingApi(path: string, token: string | null, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? "We couldn't complete your booking. Please try again.");
  }
  return response.json();
}

export function ClassBookingFlow({ activeMembership: activeMembershipOverride, freeTrial: freeTrialOverride, excludedDates: excludedDatesOverride }: ClassBookingFlowProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("byClass");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [bookingContext, setBookingContext] = useState<BookingContext>({ activeMembership: false, freeTrial: false, excludedDates: {} });

  const activeMembership = activeMembershipOverride ?? bookingContext.activeMembership;
  const freeTrial = freeTrialOverride ?? bookingContext.freeTrial;
  const excludedDates = excludedDatesOverride ?? bookingContext.excludedDates;
  const isMonthly = tab === "monthly";
  const datesLocked = activeMembership || isMonthly;
  const dates = useMemo(() => getClassDates(excludedDates), [excludedDates]);
  const canContinue = activeMembership || freeTrial || isMonthly || selected.size > 0;

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        const result = await bookingApi("/api/booking-context", await getToken()) as Partial<BookingContext>;
        if (!cancelled) setBookingContext({ activeMembership: result.activeMembership ?? false, freeTrial: result.freeTrial ?? false, excludedDates: result.excludedDates ?? {} });
      } catch {
        // The public UI remains usable until the documented booking-context endpoint is deployed.
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, isLoaded, isSignedIn]);

  // TODO: double check this against stripe docs
  const verifyCheckout = useCallback(async (sessionId: string) => {
    setFeedback({ tone: "loading", title: "Confirming your payment", body: "We’re checking your secure payment with Stripe. Please keep this window open." });
    try {
      const result = await bookingApi(`/api/checkout-sessions/${encodeURIComponent(sessionId)}`, await getToken()) as CheckoutConfirmation;
      if (result.status !== "confirmed") throw new Error("Your payment is still being confirmed. Please try again shortly.");
      const quantity = result.purchaseType === "monthly" ? result.months ?? 1 : result.classCount ?? 1;
      const unit = result.purchaseType === "monthly" ? "month" : "class";
      const label = quantity === 1 ? unit : result.purchaseType === "monthly" ? "months" : "classes";
      setFeedback({ tone: "success", title: "You’re booked!", body: `You are now booked for ${quantity} ${label}.`, actionLabel: "Continue", onAction: () => navigate("/members") });
      setSearchParams({}, { replace: true });
    } catch (error) {
      setFeedback({ tone: "error", title: "We couldn’t confirm your payment", body: error instanceof Error ? error.message : "Please try again.", actionLabel: "Try again", onAction: () => void verifyCheckout(sessionId), dismissible: true });
    }
  }, [getToken, navigate, setSearchParams]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");
    if (!checkout) return;
    if (checkout === "cancel") {
      setFeedback({ tone: "neutral", title: "Checkout cancelled", body: "Your selected classes have not been booked.", actionLabel: "Return to booking", onAction: () => { setFeedback(null); setSearchParams({}, { replace: true }); }, dismissible: true });
      return;
    }
    if (checkout !== "success" || !sessionId || !isLoaded) return;
    if (!isSignedIn) {
      openAuthModal("login");
      return;
    }
    void verifyCheckout(sessionId);
  }, [isLoaded, isSignedIn, openAuthModal, searchParams, setSearchParams, verifyCheckout]);

  const toggleDate = useCallback((key: string) => {
    if (datesLocked) return;
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else { if (freeTrial) next.clear(); next.add(key); }
      return next;
    });
  }, [datesLocked, freeTrial]);

  const requireSignedIn = () => {
    if (isLoaded && isSignedIn) return true;
    openAuthModal("login");
    return false;
  };

  // TOOD: double check against stripe documentation once we have a backend
  const startCheckout = async () => {
    if (!canContinue || !requireSignedIn()) return;
    setIsStartingCheckout(true);
    setFeedback({ tone: "loading", title: "Opening secure checkout", body: "You’ll be redirected to Stripe to enter payment details." });
    try {
      const payload = isMonthly ? { kind: "monthly" } : { kind: "class", classDates: [...selected] };
      // Backend required: validate date availability and Clerk identity, then return Stripe's hosted Checkout URL.
      const result = await bookingApi("/api/checkout-sessions", await getToken(), { method: "POST", body: JSON.stringify(payload) }) as { url?: string };
      if (!result.url) throw new Error("Checkout could not be started. Please try again.");
      window.location.assign(result.url);
    } catch (error) {
      setIsStartingCheckout(false);
      setFeedback({ tone: "error", title: "Checkout couldn’t start", body: error instanceof Error ? error.message : "Please try again.", actionLabel: "Try again", onAction: () => void startCheckout(), dismissible: true });
    }
  };

  const bookWithoutPayment = async () => {
    if (!requireSignedIn()) return;
    setFeedback({ tone: "loading", title: "Saving your booking", body: "Please keep this window open." });
    try {
      const token = await getToken();
      if (freeTrial) {
        await bookingApi("/api/bookings/free-trial", token, { method: "POST", body: JSON.stringify({ classDate: [...selected][0] }) });
        setFeedback({ tone: "success", title: "You’re booked!", body: "Your free trial class is all set.", actionLabel: "Continue", onAction: () => navigate("/members") });
      } else {
        await bookingApi("/api/bookings/member-drop-in", token, { method: "POST", body: JSON.stringify({}) });
        setFeedback({ tone: "success", title: "You’re booked!", body: "Your active membership has you covered.", actionLabel: "Continue", onAction: () => navigate("/members") });
      }
    } catch (error) {
      setFeedback({ tone: "error", title: "We couldn’t save your booking", body: error instanceof Error ? error.message : "Please try again.", actionLabel: "Try again", onAction: () => void bookWithoutPayment(), dismissible: true });
    }
  };

  const onContinue = () => { if (freeTrial || activeMembership) void bookWithoutPayment(); else void startCheckout(); };
  const switchTab = (nextTab: Tab) => { setTab(nextTab); setSelected(new Set()); };

  return <div className={styles.booking.shell} aria-busy={isStartingCheckout || feedback?.tone === "loading"}>
    {!activeMembership && !freeTrial && <nav className={styles.booking.tabs.nav} aria-label="Payment type">
      {(["byClass", "monthly"] as Tab[]).map((value) => <button key={value} className={tab === value ? styles.booking.tabs.tabOn : styles.booking.tabs.tab} onClick={() => switchTab(value)} aria-current={tab === value ? "page" : undefined} disabled={isStartingCheckout}>{value === "byClass" ? "Pay by Class" : "Pay Monthly"}</button>)}
    </nav>}
    <h1 className={styles.booking.heading}>{activeMembership ? "No Booking Required" : isMonthly ? "All Classes, One Monthly Fee" : "Select your class"}</h1>
    <p className={styles.booking.sub}>{activeMembership ? "Feel free to drop into any class — your active membership has you covered, no booking needed." : isMonthly ? "With a monthly membership, every Tuesday and Thursday class is open to you." : "Click to select your preferred date"}</p>
    <div className={datesLocked ? styles.booking.grid.locked : styles.booking.grid.normal} role="group" aria-label="Available class dates">
      {dates.map((date) => { const key = toKey(date); const isOn = selected.has(key); return <button key={key} className={datesLocked ? styles.booking.card.locked : isOn ? styles.booking.card.selected : styles.booking.card.normal} onClick={() => toggleDate(key)} aria-pressed={!datesLocked ? isOn : undefined} tabIndex={datesLocked ? -1 : 0} disabled={isStartingCheckout}><span className={styles.booking.card.mo}>{MONTHS[date.getMonth()]}</span><span className={styles.booking.card.day}>{date.getDate()}</span></button>; })}
    </div>
    <button className={canContinue ? styles.booking.cta.base : styles.booking.cta.dim} onClick={onContinue} disabled={!canContinue || isStartingCheckout || feedback?.tone === "loading"}>{isStartingCheckout ? "Opening secure checkout…" : freeTrial ? "Book your trial class" : activeMembership ? "Continue" : "Continue to payment"}</button>
    {feedback && <FeedbackDialog title={feedback.title} body={feedback.body} tone={feedback.tone} actionLabel={feedback.actionLabel} onAction={feedback.onAction} onClose={feedback.dismissible ? () => setFeedback(null) : undefined} />}
  </div>;
}
