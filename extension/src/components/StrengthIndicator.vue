<script setup lang="ts">
import type { Strength } from "@/types/Strength";

defineProps<{
  strength: null | Strength;
}>();

const getStrengthColor = (score: number): string => {
  const colors = [
    "var(--color-strength-weak)",
    "var(--color-strength-fair)",
    "var(--color-strength-good)",
    "var(--color-strength-strong)",
    "var(--color-strength-very-strong)",
  ];
  return colors[score] ?? colors[0];
};
</script>

<template>
  <div v-if="strength" class="pg:flex pg:flex-col pg:gap-1.5">
    <div class="pg:flex pg:items-center pg:justify-between pg:text-xs">
      <span class="pg:text-muted-foreground">Strength</span>
      <span :style="{ color: getStrengthColor(strength.score) }">
        {{ strength.rating }}
      </span>
    </div>
    <div
      class="pg:h-1.5 pg:w-full pg:overflow-hidden pg:rounded-full pg:bg-muted"
    >
      <div
        class="pg:h-full pg:rounded-full pg:transition-all pg:duration-300"
        :style="{
          width: `${strength.percentage}%`,
          backgroundColor: getStrengthColor(strength.score),
        }"
      />
    </div>
    <div class="pg:text-xs pg:text-muted-foreground">
      Crack time: {{ strength.cracktime }}
    </div>
  </div>
</template>
