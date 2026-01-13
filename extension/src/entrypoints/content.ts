import { createApp } from "vue";

import type { PasswordField } from "@/types/PasswordField";

import "@/assets/css/content.css";
import PasswordPopup from "@/components/PasswordPopup.vue";
import { linkPairedFields } from "@/utils/detection/paired-field";
import { detectPasswordFields } from "@/utils/detection/password-field";

let detectedFields: PasswordField[] = [];
let activePopup: null | { container: HTMLElement; unmount: () => void } = null;

const createIcon = (): HTMLElement => {
  const icon = document.createElement("div");
  icon.className = "passgen-icon";
  icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `;
  icon.style.cssText = `
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #888;
    background: transparent;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
    z-index: 10000;
  `;
  icon.addEventListener("mouseenter", () => {
    icon.style.color = "#fff";
    icon.style.background = "rgba(255, 255, 255, 0.1)";
  });
  icon.addEventListener("mouseleave", () => {
    icon.style.color = "#888";
    icon.style.background = "transparent";
  });
  return icon;
};

const positionIcon = (icon: HTMLElement, input: HTMLInputElement): void => {
  const rect = input.getBoundingClientRect();
  const parent = input.offsetParent as HTMLElement;

  if (parent && parent !== document.body) {
    const parentRect = parent.getBoundingClientRect();
    icon.style.top = `${rect.top - parentRect.top + rect.height / 2}px`;
    icon.style.right = `${parentRect.right - rect.right + 8}px`;
  }
};

const injectIcon = (field: PasswordField): void => {
  if (field.iconElement) return;

  const input = field.element;
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "position: relative; display: inline-block; width: 100%;";

  // Wrap input if not already wrapped
  if (input.parentElement?.style.position !== "relative") {
    input.parentElement?.insertBefore(wrapper, input);
    wrapper.appendChild(input);
  }

  const icon = createIcon();
  field.iconElement = icon;

  icon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPopup(field, icon);
  });

  // Insert icon after input in the wrapper
  if (input.parentElement) {
    input.parentElement.style.position = "relative";
    input.parentElement.appendChild(icon);
    positionIcon(icon, input);
  }
};

const showPopup = (field: PasswordField, iconElement: HTMLElement): void => {
  // Close existing popup
  closePopup();

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

  // Position popup relative to icon
  const iconRect = iconElement.getBoundingClientRect();
  container.style.cssText = `
    position: fixed;
    top: ${iconRect.bottom + 8}px;
    right: ${window.innerWidth - iconRect.right}px;
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
    document.addEventListener("click", handleClickOutside);
  }, 0);
};

const closePopup = (): void => {
  if (activePopup) {
    activePopup.unmount();
    activePopup.container.remove();
    activePopup = null;
    document.removeEventListener("click", handleClickOutside);
  }
};

const handleClickOutside = (e: MouseEvent): void => {
  const target = e.target as Node;
  const popupContainer = document.getElementById("passgen-popup-container");

  if (popupContainer && !popupContainer.contains(target)) {
    // Check if click is on an icon
    const isIconClick = detectedFields.some((field) =>
      field.iconElement?.contains(target),
    );
    if (!isIconClick) {
      closePopup();
    }
  }
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

const scanAndInjectIcons = (): void => {
  detectedFields = detectPasswordFields();
  linkPairedFields(detectedFields);

  for (const field of detectedFields) {
    injectIcon(field);
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
      setTimeout(scanAndInjectIcons, 100);
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
        scanAndInjectIcons();
        setupMutationObserver();
      });
    } else {
      scanAndInjectIcons();
      setupMutationObserver();
    }
  },
  matches: ["<all_urls>"],
});
