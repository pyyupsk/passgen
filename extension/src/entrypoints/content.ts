import { createApp } from "vue";

import type { PasswordField } from "@/types/PasswordField";

import PasswordPopup from "@/components/PasswordPopup.vue";
import { linkPairedFields } from "@/utils/detection/paired-field";
import { detectPasswordFields } from "@/utils/detection/password-field";

let detectedFields: PasswordField[] = [];
let activePopup: null | { container: HTMLElement; unmount: () => void } = null;
let activeField: null | PasswordField = null;

const showPopup = (field: PasswordField): void => {
  // Don't reopen if already showing for this field
  if (activeField === field && activePopup) return;

  // Close existing popup
  closePopup();

  activeField = field;
  const inputRect = field.element.getBoundingClientRect();

  // Create popup container
  const container = document.createElement("div");
  container.id = "passgen-popup-container";

  // Create shadow root for style isolation
  const shadow = container.attachShadow({ mode: "open" });

  // Add styles to shadow root
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

    :host {
      all: initial;
      font-family: 'Inter', system-ui, sans-serif;
    }
  `;
  shadow.appendChild(style);

  // Create mount point
  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  // Position popup relative to input
  const popupHeight = 220;
  const popupWidth = 280;
  const margin = 8;

  // Check if popup fits below the input
  const spaceBelow = window.innerHeight - inputRect.bottom - margin;
  const spaceAbove = inputRect.top - margin;
  const openAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow;

  // Calculate horizontal position (align with input left edge)
  const leftPos = inputRect.left;
  const wouldOverflowRight = leftPos + popupWidth > window.innerWidth - margin;

  let horizontalStyle: string;
  if (wouldOverflowRight) {
    horizontalStyle = `right: ${margin}px;`;
  } else {
    horizontalStyle = `left: ${Math.max(margin, leftPos)}px;`;
  }

  container.style.cssText = `
    position: fixed;
    ${openAbove ? `bottom: ${window.innerHeight - inputRect.top + margin}px;` : `top: ${inputRect.bottom + margin}px;`}
    ${horizontalStyle}
    z-index: 2147483647;
  `;

  document.body.appendChild(container);

  // Mount Vue app
  const app = createApp(PasswordPopup, {
    onClose: closePopup,
    onFill: (password: string) => fillPassword(field, password),
    targetField: field,
  });

  app.mount(mountPoint);

  activePopup = {
    container,
    unmount: () => app.unmount(),
  };

  // Add click outside listener
  setTimeout(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, 0);
};

const closePopup = (): void => {
  if (activePopup) {
    activePopup.unmount();
    activePopup.container.remove();
    activePopup = null;
    activeField = null;
    document.removeEventListener("mousedown", handleClickOutside);
  }
};

const handleClickOutside = (e: MouseEvent): void => {
  const target = e.target as Node;
  const popupContainer = document.getElementById("passgen-popup-container");

  // Check if click is inside popup
  if (popupContainer?.contains(target)) return;

  // Check if click is on a detected password field
  const isFieldClick = detectedFields.some((field) =>
    field.element.contains(target),
  );
  if (isFieldClick) return;

  closePopup();
};

const fillPassword = (field: PasswordField, password: string): void => {
  // Fill main field
  setInputValue(field.element, password);

  // Fill paired field if exists
  if (field.pairedField) {
    setInputValue(field.pairedField, password);
  }

  closePopup();
};

const setInputValue = (input: HTMLInputElement, value: string): void => {
  // Set value
  input.value = value;

  // Dispatch events to trigger form validation
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
};

const attachFieldListener = (field: PasswordField): void => {
  const input = field.element;

  // Mark as processed to avoid duplicate listeners
  if (input.dataset.passgenAttached) return;
  input.dataset.passgenAttached = "true";

  input.addEventListener("focus", () => {
    showPopup(field);
  });
};

const scanAndAttachListeners = (): void => {
  detectedFields = detectPasswordFields();
  linkPairedFields(detectedFields);

  for (const field of detectedFields) {
    attachFieldListener(field);
  }
};

const hasPasswordField = (node: Node): boolean => {
  if (!(node instanceof HTMLElement)) return false;
  return (
    node.tagName === "INPUT" || !!node.querySelector('input[type="password"]')
  );
};

const setupMutationObserver = (): void => {
  const observer = new MutationObserver((mutations) => {
    const shouldRescan = mutations.some(
      (mutation) =>
        mutation.type === "childList" &&
        Array.from(mutation.addedNodes).some(hasPasswordField),
    );

    if (shouldRescan) {
      setTimeout(scanAndAttachListeners, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

export default defineContentScript({
  cssInjectionMode: "ui",
  main() {
    // Initial scan
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        scanAndAttachListeners();
        setupMutationObserver();
      });
    } else {
      scanAndAttachListeners();
      setupMutationObserver();
    }
  },
  matches: ["<all_urls>"],
});
