<script setup lang="ts">
import { computed } from 'vue'

import type { Strength } from '@/types/Strength'

const props = defineProps<{
  strength: Strength
}>()

// Memoized strength color calculation
const getStrengthColor = computed(() => {
  switch (props.strength.score) {
    case 0:
      return 'text-red-500'
    case 1:
      return 'text-amber-500'
    case 2:
      return 'text-yellow-500'
    case 3:
      return 'text-lime-500'
    case 4:
      return 'text-emerald-500'
    default:
      return 'text-red-500'
  }
})
</script>

<template>
  <div class="space-y-1.5">
    <div class="space-y-3">
      <label for="strength" class="label flex justify-between">
        <span>Password Strength</span>
        <span class="text-sm font-medium">{{ props.strength.rating }}</span>
      </label>
      <progress
        id="strength"
        class="progress"
        :class="getStrengthColor"
        :value="props.strength.percentage"
        max="100"
      />
    </div>
    <div class="text-sm">
      <span class="font-medium">Estimated cracking time: </span>
      <span class="capitalize">{{ props.strength.cracktime }}</span>
    </div>
  </div>
</template>
