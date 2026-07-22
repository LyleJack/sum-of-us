import { useEffect, useRef } from "react";
import { styles } from "../styles";

export type FeedbackTone = "success" | "error" | "loading" | "neutral";

type FeedbackDialogProps = {
  title: string;
  body: string;
  tone?: FeedbackTone;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
};

export function FeedbackDialog({
  title,
  body,
  tone = "neutral",
  actionLabel,
  onAction,
  onClose,
}: FeedbackDialogProps) {
  const actionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    actionRef.current?.focus();
    if (!onClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.feedback.overlay} onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose?.();
    }}>
      <section className={styles.feedback.dialog} role="dialog" aria-modal="true" aria-labelledby="feedback-title" aria-describedby="feedback-body">
        <span className={`${styles.feedback.icon} feedback-icon--${tone}`} aria-hidden="true">
          {tone === "success" ? "✓" : tone === "error" ? "!" : tone === "loading" ? "…" : "i"}
        </span>
        <h2 className={styles.feedback.heading} id="feedback-title">{title}</h2>
        <p className={styles.feedback.body} id="feedback-body">{body}</p>
        <div className={styles.feedback.actions}>
          {onClose && <button type="button" className={styles.feedback.close} onClick={onClose}>Close</button>}
          {actionLabel && onAction && <button ref={actionRef} type="button" className={styles.feedback.action} onClick={onAction}>{actionLabel}</button>}
        </div>
      </section>
    </div>
  );
}
