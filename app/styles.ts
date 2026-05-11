export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const styles = {
  layout: {
    page: "page",
    pageFull: "page page-full",
    pageStack: "page-stack",
  },
  text: {
    title: "page-title",
    muted: "text-muted",
    soft: "text-soft",
    danger: "text-danger",
    action: "action-link",
  },
  welcome: {
    header: "welcome-header",
    titleBox: "welcome-title-box",
    actions: "welcome-actions",
    panel: "welcome-panel",
    prompt: "welcome-prompt text-muted",
    icon: "resource-icon",
  },
  button: {
    primary: "primary-button",
    primarySmall: "primary-button primary-button-small",
  },
  nav: {
    shell: "site-nav",
    link: "site-nav-link",
    user: "site-nav-user",
    schemeSelect: "scheme-select",
  },
  panel: {
    bordered: "panel",
  },
  auth: {
    overlay: "auth-overlay",
    dialog: "auth-dialog",
    closeButton: "auth-close-button",
    title: "auth-title",
    intro: "auth-intro",
    form: "auth-form",
    copy: "auth-copy",
    mutedCopy: "auth-copy-muted",
    input: "auth-input",
    inputRequired: "auth-input-required",
    inputWithAction: "auth-input-with-action",
    requiredMark: "auth-required-mark",
    requiredAtEnd: "auth-required-mark-end",
    requiredWithAction: "auth-required-mark-with-action",
    link: "auth-link",
    forgotLink: "auth-forgot-link",
    accessLabel: "auth-access-label",
    accessCopy: "auth-access-copy",
    accessInput: "auth-input auth-access-input",
    error: "auth-error",
    submit: "auth-submit",
    footer: "auth-footer",
    footerButton: "auth-footer-button",
    field: "auth-field",
    fieldControl: "auth-field-control",
    passwordToggle: "auth-password-toggle",
  },
} as const;
