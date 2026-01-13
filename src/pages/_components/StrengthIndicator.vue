<script setup lang="ts">
import { computed } from "vue";

import type { Strength } from "@/pages/_types/Strength";

const props = defineProps<{
  strength: Strength;
}>();

// Memoized strength color calculation
const getStrengthColor = computed(() => {
  switch (props.strength.score) {
    case 0:
      return "bg-red-500";
    case 1:
      return "bg-amber-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-lime-500";
    case 4:
      return "bg-emerald-500";
    default:
      return "bg-red-500";
  }
});

const getTextColor = computed(() => {
  switch (props.strength.score) {
    case 0:
      return "text-red-500";
    case 1:
      return "text-amber-500";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-lime-500";
    case 4:
      return "text-emerald-500";
    default:
      return "text-red-500";
  }
});
</script>

<template>
  <div class="space-y-2">
    <div class="space-y-2">
      <label for="strength" class="flex justify-between text-sm font-medium">
        <span>Password Strength</span>
        <span :class="getTextColor" class="font-medium">{{
          props.strength.rating
        }}</span>
      </label>
      <div class="bg-secondary h-2 w-full overflow-hidden rounded-full">
        <div
          id="strength"
          class="h-full transition-all duration-300"
          :class="getStrengthColor"
          :style="{ width: `${props.strength.percentage}%` }"
        />
      </div>
    </div>
    <div class="text-muted-foreground text-sm">
      <span class="font-medium">Estimated cracking time: </span>
      <span class="capitalize">{{ props.strength.cracktime }}</span>
    </div>
  </div>
</template>
