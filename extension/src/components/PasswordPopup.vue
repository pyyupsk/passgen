<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

import type { PasswordField } from "@/types/PasswordField";

import StrengthIndicator from "@/components/StrengthIndicator.vue";
import { usePasswordGenerator } from "@/composables/usePasswordGenerator";
import { COPY_FEEDBACK_DURATION_MS } from "@/constants";
import { copyToClipboard } from "@/utils/clipboard";

const props = defineProps<{
  onClose: () => void;
  onFill: (_password: string) => void;
  targetField: PasswordField;
}>();

const { password, regenerate, strength } = usePasswordGenerator();
const copyFeedback = ref(false);
const primaryHover = ref(false);
const secondaryHover = ref(false);
const iconHover = ref(false);
const closeHover = ref(false);
let copyTimeoutId: null | ReturnType<typeof setTimeout> = null;

const handleFill = (): void => {
  props.onFill(password.value);
};

const handleCopy = async (): Promise<void> => {
  const success = await copyToClipboard(password.value);
  if (success) {
    if (copyTimeoutId !== null) {
      clearTimeout(copyTimeoutId);
    }
    copyFeedback.value = true;
    copyTimeoutId = setTimeout(() => {
      copyFeedback.value = false;
      copyTimeoutId = null;
    }, COPY_FEEDBACK_DURATION_MS);
  }
};

onBeforeUnmount(() => {
  if (copyTimeoutId !== null) {
    clearTimeout(copyTimeoutId);
  }
});

const handleRegenerate = (): void => {
  regenerate();
};

// Inline styles
const styles = {
  actions: {
    display: "flex",
    gap: "8px",
  },
  btnBase: {
    alignItems: "center",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: "500",
    justifyContent: "center",
    padding: "8px 16px",
    transition: "all 0.15s ease",
  },
  btnIcon: {
    background: "#27272a",
    border: "1px solid #3f3f46",
    color: "#a1a1aa",
    height: "36px",
    padding: "0",
    width: "36px",
  },
  btnIconHover: {
    background: "#3f3f46",
    color: "#fafafa",
  },
  btnPrimary: {
    background: "#fafafa",
    color: "#09090b",
    flex: "1",
  },
  btnPrimaryHover: {
    background: "#e4e4e7",
  },
  btnSecondary: {
    background: "#27272a",
    border: "1px solid #3f3f46",
    color: "#fafafa",
    flex: "1",
  },
  btnSecondaryHover: {
    background: "#3f3f46",
  },
  closeBtn: {
    alignItems: "center",
    background: "transparent",
    border: "none",
    borderRadius: "6px",
    color: "#71717a",
    cursor: "pointer",
    display: "flex",
    height: "28px",
    justifyContent: "center",
    padding: "0",
    transition: "all 0.15s ease",
    width: "28px",
  },
  closeBtnHover: {
    background: "#27272a",
    color: "#fafafa",
  },
  container: {
    background: "#0a0a0a",
    border: "1px solid #27272a",
    borderRadius: "12px",
    boxShadow:
      "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    color: "#fafafa",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "16px",
    width: "280px",
  },
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  passwordDisplay: {
    background: "#18181b",
    border: "1px solid #27272a",
    borderRadius: "8px",
    color: "#fafafa",
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: "13px",
    lineHeight: "1.5",
    marginBottom: "12px",
    padding: "12px",
    wordBreak: "break-all" as const,
  },
  strengthSection: {
    marginBottom: "16px",
  },
  title: {
    color: "#fafafa",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
  },
};
</script>

<template>
  <div :style="styles.container">
    <!-- Header -->
    <div :style="styles.header">
      <h3 :style="styles.title">PassGen</h3>
      <button
        type="button"
        aria-label="Close"
        :style="{
          ...styles.closeBtn,
          ...(closeHover ? styles.closeBtnHover : {}),
        }"
        @click="props.onClose"
        @mouseenter="closeHover = true"
        @mouseleave="closeHover = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>

    <!-- Password Display -->
    <div :style="styles.passwordDisplay">
      {{ password }}
    </div>

    <!-- Strength Indicator -->
    <div :style="styles.strengthSection">
      <StrengthIndicator :strength="strength" />
    </div>

    <!-- Actions -->
    <div :style="styles.actions">
      <button
        type="button"
        :style="{
          ...styles.btnBase,
          ...styles.btnPrimary,
          ...(primaryHover ? styles.btnPrimaryHover : {}),
        }"
        @click="handleFill"
        @mouseenter="primaryHover = true"
        @mouseleave="primaryHover = false"
      >
        Fill
      </button>
      <button
        type="button"
        :style="{
          ...styles.btnBase,
          ...styles.btnSecondary,
          ...(secondaryHover ? styles.btnSecondaryHover : {}),
        }"
        @click="handleCopy"
        @mouseenter="secondaryHover = true"
        @mouseleave="secondaryHover = false"
      >
        {{ copyFeedback ? "Copied!" : "Copy" }}
      </button>
      <button
        type="button"
        aria-label="Regenerate password"
        :style="{
          ...styles.btnBase,
          ...styles.btnIcon,
          ...(iconHover ? styles.btnIconHover : {}),
        }"
        title="Regenerate"
        @click="handleRegenerate"
        @mouseenter="iconHover = true"
        @mouseleave="iconHover = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
        </svg>
      </button>
    </div>
  </div>
</template>
