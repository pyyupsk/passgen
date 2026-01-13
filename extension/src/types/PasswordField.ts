export type PasswordField = {
  autocomplete: null | string;
  context: PasswordFieldContext;
  element: HTMLInputElement;
  iconElement: HTMLElement | null;
  pairedField: HTMLInputElement | null;
};

export type PasswordFieldContext =
  | "confirm"
  | "new-password"
  | "signup"
  | "unknown";
