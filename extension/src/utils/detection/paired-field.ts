import type { PasswordField } from "@/types/PasswordField";

const CONFIRM_PATTERNS = [
  "confirm",
  "repeat",
  "verify",
  "retype",
  "re-type",
  "re_type",
  "password2",
  "password_confirm",
  "passwordconfirm",
];

const matchesConfirmPattern = (element: HTMLInputElement): boolean => {
  const name = element.name?.toLowerCase() || "";
  const id = element.id?.toLowerCase() || "";
  const placeholder = element.placeholder?.toLowerCase() || "";

  return CONFIRM_PATTERNS.some(
    (pattern) =>
      name.includes(pattern) ||
      id.includes(pattern) ||
      placeholder.includes(pattern),
  );
};

const isCurrentPassword = (element: HTMLInputElement): boolean => {
  return (
    element.getAttribute("autocomplete")?.toLowerCase() === "current-password"
  );
};

const isNewPassword = (element: HTMLInputElement): boolean => {
  return element.getAttribute("autocomplete")?.toLowerCase() === "new-password";
};

const findMainPasswordField = (
  inputs: NodeListOf<HTMLInputElement>,
  excludeElement: HTMLInputElement,
): HTMLInputElement | null => {
  // First pass: prefer inputs with autocomplete="new-password"
  for (const input of inputs) {
    if (
      input !== excludeElement &&
      !matchesConfirmPattern(input) &&
      !isCurrentPassword(input) &&
      isNewPassword(input)
    ) {
      return input;
    }
  }
  // Second pass: accept any non-current-password, non-confirm input
  for (const input of inputs) {
    if (
      input !== excludeElement &&
      !matchesConfirmPattern(input) &&
      !isCurrentPassword(input)
    ) {
      return input;
    }
  }
  return null;
};

const findConfirmPasswordField = (
  inputs: NodeListOf<HTMLInputElement>,
  excludeElement: HTMLInputElement,
): HTMLInputElement | null => {
  // Skip current-password inputs when searching for confirm field
  for (const input of inputs) {
    if (
      input !== excludeElement &&
      matchesConfirmPattern(input) &&
      !isCurrentPassword(input)
    ) {
      return input;
    }
  }
  return null;
};

export const findPairedField = (
  field: PasswordField,
): HTMLInputElement | null => {
  // Use form property first, then fall back to closest
  const form = field.element.form ?? field.element.closest("form");
  if (!form) return null;

  const passwordInputs = form.querySelectorAll<HTMLInputElement>(
    'input[type="password"]',
  );

  // Filter out current-password inputs for all operations
  const nonCurrentPasswordInputs = Array.from(passwordInputs).filter(
    (input) => !isCurrentPassword(input),
  );

  if (nonCurrentPasswordInputs.length < 2) return null;

  // If the field itself is a confirm field, find the main password field
  if (field.context === "confirm") {
    const mainField = findMainPasswordField(passwordInputs, field.element);
    if (mainField) return mainField;

    // Only attempt fallback if exactly 2 non-current-password inputs exist
    // to avoid confirm-to-confirm pairing
    if (nonCurrentPasswordInputs.length === 2) {
      const other = nonCurrentPasswordInputs.find(
        (input) => input !== field.element,
      );
      return other ?? null;
    }

    return null;
  }

  // If the field is a main password field, find its confirm field
  const confirmField = findConfirmPasswordField(passwordInputs, field.element);
  if (confirmField) return confirmField;

  // Fallback: if there are exactly 2 non-current-password fields, return the other one
  if (nonCurrentPasswordInputs.length === 2) {
    return nonCurrentPasswordInputs[0] === field.element
      ? nonCurrentPasswordInputs[1]
      : nonCurrentPasswordInputs[0];
  }

  return null;
};

export const linkPairedFields = (fields: PasswordField[]): void => {
  for (const field of fields) {
    if (!field.pairedField) {
      field.pairedField = findPairedField(field);
    }
  }
};
