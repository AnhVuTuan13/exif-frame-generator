<template>
  <div class="field">
    <label>Chọn ảnh</label>
    <div class="file-drop" :class="{ 'has-file': hasFile }">
      {{ hasFile ? 'Đã chọn ảnh — bấm để đổi' : 'Bấm hoặc kéo ảnh vào đây' }}
      <input type="file" accept="image/*" @change="onChange">
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasFile: { type: Boolean, default: false }
});

const emit = defineEmits(['file-selected']);

function onChange(e) {
  const file = e.target.files[0];
  if (file) emit('file-selected', file);
}
</script>
