<template>
  <div class="panel">
    <ImageDropzone :has-file="imageLoaded" @file-selected="$emit('file-selected', $event)" />

    <TemplatePicker
      :templates="templates"
      :model-value="selectedTemplate"
      @update:model-value="$emit('update:selectedTemplate', $event)"
    />

    <div class="field">
      <label>Hãng máy ảnh</label>
      <select
        class="brand-select"
        :value="selectedBrand"
        @change="$emit('update:selectedBrand', $event.target.value)"
      >
        <option v-for="b in brandOptions" :key="b.value" :value="b.value">{{ b.label }}</option>
      </select>
    </div>

    <div class="field">
      <label>Tên / Dòng máy</label>
      <input
        type="text"
        :value="modelText"
        placeholder="VD: D850 hoặc Z6 II"
        @input="$emit('update:modelText', $event.target.value)"
      >
    </div>

    <div class="field">
      <label>Thông số kỹ thuật</label>
      <input
        type="text"
        :value="paramsText"
        placeholder="VD: 56mm f/4.5 1/640s ISO100"
        @input="$emit('update:paramsText', $event.target.value)"
      >
    </div>

    <div class="field">
      <label>Địa điểm & Ngày tháng</label>
      <input
        type="text"
        :value="subText"
        placeholder="VD: Hanoi, Vietnam 2026.09.14"
        @input="$emit('update:subText', $event.target.value)"
      >
    </div>

    <button class="btn-primary" :disabled="!imageLoaded" @click="$emit('download')">
      Tải Ảnh Chất Lượng Cao
    </button>
  </div>
</template>

<script setup>
import ImageDropzone from './ImageDropzone.vue';
import TemplatePicker from './TemplatePicker.vue';

defineProps({
  imageLoaded: { type: Boolean, default: false },
  templates: { type: Array, required: true },
  selectedTemplate: { type: String, required: true },
  brandOptions: { type: Array, required: true },
  selectedBrand: { type: String, required: true },
  modelText: { type: String, default: '' },
  paramsText: { type: String, default: '' },
  subText: { type: String, default: '' }
});

defineEmits([
  'file-selected',
  'update:selectedTemplate',
  'update:selectedBrand',
  'update:modelText',
  'update:paramsText',
  'update:subText',
  'download'
]);
</script>
