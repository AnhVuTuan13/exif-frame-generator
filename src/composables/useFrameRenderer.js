import { ref } from 'vue';
import { TEMPLATES } from '../templates/index.js';
import { BRAND_LOGOS, BRAND_OPTIONS } from './useExif.js';

/**
 * Encapsulates the raw <img>, canvas ref, and render/download logic so
 * components stay free of canvas plumbing.
 */
export function useFrameRenderer() {
  const canvasRef = ref(null);
  const imageLoaded = ref(false);
  let rawImage = new Image();

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        rawImage = new Image();
        rawImage.onload = () => {
          imageLoaded.value = true;
          resolve();
        };
        rawImage.onerror = reject;
        rawImage.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function render({ templateId, selectedBrand, modelText, paramsText, subText }) {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const template = TEMPLATES[templateId] || TEMPLATES.classic;
    const imgW = rawImage.width || 1200;
    const imgH = rawImage.height || 1600;
    const { W, H } = template.layout(imgW, imgH);

    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    const brandLabel = selectedBrand === 'custom'
      ? ''
      : (BRAND_OPTIONS.find(b => b.value === selectedBrand) || {}).label || '';

    await template.draw(ctx, W, H, {
      rawImage,
      imageLoaded: imageLoaded.value,
      selectedBrand,
      modelText,
      paramsText,
      subText,
      brandLabel,
      BRAND_LOGOS
    });
  }

  function download(filenameHint) {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `exif-frame-${filenameHint || 'photo'}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }

  return { canvasRef, imageLoaded, loadImageFromFile, render, download };
}
