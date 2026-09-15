<template>
  <div class="preview-col">
    <div class="preview-container">
      <canvas ref="canvasEl"></canvas>
    </div>
    <div class="hint">Xem trước theo thời gian thực — kéo thả hoặc đổi mẫu để so sánh.</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const canvasEl = ref(null);

// Expose the raw canvas element so the parent's renderer composable
// (which owns canvasRef) can bind to it.
defineExpose({ canvasEl });
</script>
