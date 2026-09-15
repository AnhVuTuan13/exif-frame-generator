<template>
  <div class="field">
    <label>Mẫu khung ({{ templates.length }})</label>
    <div class="template-grid">
      <div
        v-for="tpl in templates"
        :key="tpl.id"
        class="tpl-btn"
        :class="{ active: modelValue === tpl.id }"
        @click="$emit('update:modelValue', tpl.id)"
      >
        <div class="swatch" :style="{ background: tpl.swatch }"></div>
        {{ tpl.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  templates: { type: Array, required: true },
  modelValue: { type: String, required: true }
});
defineEmits(['update:modelValue']);
</script>
