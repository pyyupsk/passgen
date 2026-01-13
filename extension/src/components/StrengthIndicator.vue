<script setup lang="ts">
import type { Strength } from "@/types/Strength";

defineProps<{
  strength: null | Strength;
}>();

const getStrengthColor = (score: number): string => {
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
  return colors[score] ?? colors[0];
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  crackTime: {
    color: "#71717a",
    fontSize: "11px",
  },
  header: {
    alignItems: "center",
    display: "flex",
    fontSize: "11px",
    justifyContent: "space-between",
  },
  label: {
    color: "#71717a",
  },
  progressBar: {
    borderRadius: "9999px",
    height: "100%",
    transition: "all 0.3s ease",
  },
  progressTrack: {
    background: "#27272a",
    borderRadius: "9999px",
    height: "6px",
    overflow: "hidden",
    width: "100%",
  },
  rating: {
    fontWeight: "500",
  },
};
</script>

<template>
  <div v-if="strength" :style="styles.container">
    <div :style="styles.header">
      <span :style="styles.label">Strength</span>
      <span
        :style="{ ...styles.rating, color: getStrengthColor(strength.score) }"
      >
        {{ strength.rating }}
      </span>
    </div>
    <div :style="styles.progressTrack">
      <div
        :style="{
          ...styles.progressBar,
          width: `${strength.percentage}%`,
          backgroundColor: getStrengthColor(strength.score),
        }"
      />
    </div>
    <div :style="styles.crackTime">Crack time: {{ strength.cracktime }}</div>
  </div>
</template>
