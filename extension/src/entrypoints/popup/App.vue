<script lang="ts" setup>
const openRepo = () => {
  window.open("https://github.com/pyyupsk/passgen", "_blank");
};
</script>

<template>
  <div class="popup">
    <h1>PassGen</h1>
    <p>Generate strong passwords for registration forms.</p>
    <p class="hint">Click on any password field to get started.</p>
    <button class="star-btn" @click="openRepo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        />
      </svg>
      Star on GitHub
    </button>
  </div>
</template>

<style scoped>
.popup {
  min-width: 220px;
  padding: 16px;
  font-family: "Inter", system-ui, sans-serif;
  background: #0a0a0a;
  color: #fafafa;
  text-align: center;
}

h1 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

p {
  margin: 0 0 8px;
  font-size: 13px;
  color: #a1a1a1;
}

.hint {
  font-size: 12px;
  color: #737373;
  margin-bottom: 12px;
}

.star-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: #fafafa;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.star-btn:hover {
  background: #3f3f46;
}

.star-btn svg {
  color: #facc15;
}
</style>
