<template>
  <div class="app">
    <AppHeader />

    <ControlsPanel
      :image-loaded="imageLoaded"
      :templates="templateList"
      :selected-template="selectedTemplate"
      :brand-options="brandOptions"
      :selected-brand="selectedBrand"
      :model-text="modelText"
      :params-text="paramsText"
      :sub-text="subText"
      @file-selected="onFileSelected"
      @update:selected-template="selectedTemplate = $event; rerender()"
      @update:selected-brand="selectedBrand = $event; rerender()"
      @update:model-text="modelText = $event; rerender()"
      @update:params-text="paramsText = $event; rerender()"
      @update:sub-text="subText = $event; rerender()"
      @download="download(selectedTemplate)"
    />

    <CanvasPreview ref="previewRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ControlsPanel from './components/ControlsPanel.vue';
import CanvasPreview from './components/CanvasPreview.vue';
import { TEMPLATE_LIST } from './templates/index.js';
import { BRAND_OPTIONS, readExif } from './composables/useExif.js';
import { useFrameRenderer } from './composables/useFrameRenderer.js';

const templateList = TEMPLATE_LIST;
const brandOptions = BRAND_OPTIONS;

const selectedTemplate = ref('classic');
const selectedBrand = ref('nikon');
const modelText = ref('Z6 II');
const paramsText = ref('85mm  f/1.8  1/1000s  ISO100');
const subText = ref('2026.09.14');

const previewRef = ref(null);
const { canvasRef, imageLoaded, loadImageFromFile, render, download } = useFrameRenderer();

function rerender() {
  render({
    templateId: selectedTemplate.value,
    selectedBrand: selectedBrand.value,
    modelText: modelText.value,
    paramsText: paramsText.value,
    subText: subText.value
  });
}

async function onFileSelected(file) {
  await loadImageFromFile(file);

  const exif = await readExif(file);
  if (exif.brandKey) selectedBrand.value = exif.brandKey;
  if (exif.modelText) modelText.value = exif.modelText;
  if (exif.paramsText) paramsText.value = exif.paramsText;
  if (exif.subText) subText.value = exif.subText;

  rerender();
}

onMounted(() => {
  // Bind the renderer's canvas ref to the actual <canvas> exposed by CanvasPreview.
  canvasRef.value = previewRef.value.canvasEl;
  rerender();
});
</script>
