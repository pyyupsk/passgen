import type {
  PasswordField,
  PasswordFieldContext,
} from "@/types/PasswordField";

const SIGNUP_KEYWORDS = [
  "signup",
  "sign-up",
  "sign_up",
  "register",
  "registration",
  "create",
  "new",
  "join",
];

const CONFIRM_KEYWORDS = [
  "confirm",
  "repeat",
  "verify",
  "retype",
  "re-type",
  "re_type",
];

const isVisible = (element: HTMLInputElement): boolean => {
  const style = globalThis.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
};

const getContext = (element: HTMLInputElement): PasswordFieldContext => {
  const autocomplete = element.getAttribute("autocomplete")?.toLowerCase();
  const name = element.name?.toLowerCase() || "";
  const id = element.id?.toLowerCase() || "";
  const placeholder = element.placeholder?.toLowerCase() || "";

  // Check for confirm password patterns first (even if autocomplete="new-password")
  if (
    CONFIRM_KEYWORDS.some(
      (kw) => name.includes(kw) || id.includes(kw) || placeholder.includes(kw),
    )
  ) {
    return "confirm";
  }

  // Explicit new-password
  if (autocomplete === "new-password") {
    return "new-password";
  }

  // Explicit current-password - exclude login forms
  if (autocomplete === "current-password") {
    return "unknown";
  }

  // Check form context for signup patterns
  const form = element.closest("form");
  if (form) {
    const formAction = form.action?.toLowerCase() || "";
    const formId = form.id?.toLowerCase() || "";
    const formClass = form.className?.toLowerCase() || "";
    const formText = form.textContent?.toLowerCase() || "";

    if (
      SIGNUP_KEYWORDS.some(
        (kw) =>
          formAction.includes(kw) ||
          formId.includes(kw) ||
          formClass.includes(kw) ||
          formText.includes(kw),
      )
    ) {
      return "signup";
    }
  }

  // Check field name/id for signup patterns
  if (SIGNUP_KEYWORDS.some((kw) => name.includes(kw) || id.includes(kw))) {
    return "signup";
  }

  return "unknown";
};

export const detectPasswordFields = (): PasswordField[] => {
  const passwordInputs = document.querySelectorAll<HTMLInputElement>(
    'input[type="password"]',
  );
  const fields: PasswordField[] = [];

  passwordInputs.forEach((element) => {
    if (!isVisible(element)) return;

    const autocomplete = element.getAttribute("autocomplete");
    const context = getContext(element);

    // Skip login forms (current-password)
    if (autocomplete?.toLowerCase() === "current-password") return;

    // Only include if we have some context or it's explicitly new-password
    if (
      context === "unknown" &&
      autocomplete?.toLowerCase() !== "new-password"
    ) {
      // Allow unknown context but not if it looks like a login form
      const form = element.closest("form");
      const formText = form?.textContent?.toLowerCase() || "";
      if (
        formText.includes("login") ||
        formText.includes("sign in") ||
        formText.includes("signin")
      ) {
        return;
      }
    }

    fields.push({
      autocomplete,
      context,
      element,
      pairedField: null,
    });
  });

  return fields;
};

export const isNewPasswordField = (field: PasswordField): boolean => {
  return field.context === "new-password" || field.context === "signup";
};
