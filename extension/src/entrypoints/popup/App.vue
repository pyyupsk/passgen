<script lang="ts" setup>
// PassGen browser extension popup
</script>

<template>
  <div class="popup">
    <h1>PassGen</h1>
    <p>Generate strong passwords for registration forms.</p>
    <p class="hint">Look for the lock icon on password fields.</p>
  </div>
</template>

<style scoped>
.popup {
  min-width: 200px;
  padding: 16px;
  font-family: "Inter", system-ui, sans-serif;
  background: #1a1a1a;
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
}
</style>
