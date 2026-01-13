<script setup lang="ts">
import { ref } from "vue";

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

const handleFill = (): void => {
  props.onFill(password.value);
};

const handleCopy = async (): Promise<void> => {
  const success = await copyToClipboard(password.value);
  if (success) {
    copyFeedback.value = true;
    setTimeout(() => {
      copyFeedback.value = false;
    }, COPY_FEEDBACK_DURATION_MS);
  }
};

const handleRegenerate = (): void => {
  regenerate();
};
</script>

<template>
  <div
    class="pg:w-72 pg:rounded-lg pg:border pg:border-border pg:bg-background pg:p-4 pg:shadow-xl pg:font-sans"
  >
    <!-- Header -->
    <div class="pg:mb-3 pg:flex pg:items-center pg:justify-between">
      <h3 class="pg:text-sm pg:font-semibold pg:text-foreground">PassGen</h3>
      <button
        type="button"
        class="pg:rounded pg:p-1 pg:text-muted-foreground pg:transition-colors hover:pg:bg-muted hover:pg:text-foreground"
        @click="props.onClose"
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
    <div
      class="pg:mb-3 pg:rounded-md pg:border pg:border-border pg:bg-muted pg:p-3 pg:font-mono pg:text-sm pg:text-foreground pg:break-all"
    >
      {{ password }}
    </div>

    <!-- Strength Indicator -->
    <div class="pg:mb-4">
      <StrengthIndicator :strength="strength" />
    </div>

    <!-- Actions -->
    <div class="pg:flex pg:gap-2">
      <button
        type="button"
        class="pg:flex-1 pg:rounded-md pg:bg-primary pg:px-3 pg:py-2 pg:text-sm pg:font-medium pg:text-primary-foreground pg:transition-colors hover:pg:bg-primary/90"
        @click="handleFill"
      >
        Fill
      </button>
      <button
        type="button"
        class="pg:flex-1 pg:rounded-md pg:border pg:border-border pg:bg-secondary pg:px-3 pg:py-2 pg:text-sm pg:font-medium pg:text-secondary-foreground pg:transition-colors hover:pg:bg-secondary/80"
        @click="handleCopy"
      >
        {{ copyFeedback ? "Copied!" : "Copy" }}
      </button>
      <button
        type="button"
        class="pg:rounded-md pg:border pg:border-border pg:bg-secondary pg:p-2 pg:text-secondary-foreground pg:transition-colors hover:pg:bg-secondary/80"
        title="Regenerate"
        @click="handleRegenerate"
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
