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

const findMainPasswordField = (
  inputs: NodeListOf<HTMLInputElement>,
  excludeElement: HTMLInputElement,
): HTMLInputElement | null => {
  for (const input of inputs) {
    if (input !== excludeElement && !matchesConfirmPattern(input)) {
      return input;
    }
  }
  return null;
};

const findConfirmPasswordField = (
  inputs: NodeListOf<HTMLInputElement>,
  excludeElement: HTMLInputElement,
): HTMLInputElement | null => {
  for (const input of inputs) {
    if (input !== excludeElement && matchesConfirmPattern(input)) {
      return input;
    }
  }
  return null;
};

export const findPairedField = (
  field: PasswordField,
): HTMLInputElement | null => {
  const form = field.element.closest("form");
  if (!form) return null;

  const passwordInputs = form.querySelectorAll<HTMLInputElement>(
    'input[type="password"]',
  );
  if (passwordInputs.length < 2) return null;

  // If the field itself is a confirm field, find the main password field
  if (field.context === "confirm") {
    const mainField = findMainPasswordField(passwordInputs, field.element);
    if (mainField) return mainField;
  }

  // If the field is a main password field, find its confirm field
  const confirmField = findConfirmPasswordField(passwordInputs, field.element);
  if (confirmField) return confirmField;

  // Fallback: if there are exactly 2 password fields, return the other one
  if (passwordInputs.length === 2) {
    return passwordInputs[0] === field.element
      ? passwordInputs[1]
      : passwordInputs[0];
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
