import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx, styles } from "../styles";

type PageProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  fullHeight?: boolean;
};

export function Page({
  children,
  className,
  fullHeight = false,
  ...props
}: PageProps) {
  return (
    <main
      className={cx(
        fullHeight ? styles.layout.pageFull : styles.layout.page,
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}

export function PageStack({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.layout.pageStack, className)} {...props}>
      {children}
    </div>
  );
}

type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "nav" | "section";
};

export function Panel({
  as: Component = "section",
  children,
  className,
  ...props
}: PanelProps) {
  return (
    <Component className={cx(styles.panel.bordered, className)} {...props}>
      {children}
    </Component>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(styles.button.primary, className)} {...props}>
      {children}
    </button>
  );
}
