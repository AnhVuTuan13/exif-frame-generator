import { drawBlurredBackground, drawRoundedImage, loadTintedLogo } from './shared.js';

// Blurred background, rounded photo, bottom info bar with brand logo.
export const classic = {
  id: 'classic',
  label: 'Classic',
  swatch: 'linear-gradient(180deg,#3a3a3a 65%, #111 65%)',

  layout(imgW, imgH) {
    const padding = Math.round(imgW * 0.04);
    const bar = Math.round(imgW * 0.18);
    return { W: imgW + padding * 2, H: imgH + padding + bar, padding, bar };
  },

  async draw(ctx, W, H, d) {
    const imgW = d.rawImage.width || 1200;
    const imgH = d.rawImage.height || 1600;
    const { padding, bar } = this.layout(imgW, imgH);

    drawBlurredBackground(ctx, d.rawImage, W, H, d.imageLoaded);

    if (d.imageLoaded) {
      const radius = Math.round((imgW / 480) * 12);
      drawRoundedImage(ctx, d.rawImage, padding, padding, imgW, imgH, radius, {
        color: 'rgba(0,0,0,0.5)',
        blur: Math.round(imgW * 0.025)
      });
    }

    const centerY = imgH + padding + bar / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const logo = d.selectedBrand !== 'custom'
      ? await loadTintedLogo(d.selectedBrand, '#ffffff', d.BRAND_LOGOS)
      : null;

    if (logo) {
      const logoH = Math.round(bar * 0.22);
      const logoW = (logo.width / logo.height) * logoH;
      if (d.modelText) {
        ctx.font = `bold ${Math.round(bar * 0.18)}px sans-serif`;
        const textWidth = ctx.measureText(d.modelText).width;
        const totalWidth = logoW + 12 + textWidth;
        const startX = (W / 2) - (totalWidth / 2);
        ctx.drawImage(logo, startX, centerY - (bar * 0.28) - (logoH / 2), logoW, logoH);
        ctx.textAlign = 'left';
        ctx.fillText(d.modelText, startX + logoW + 12, centerY - (bar * 0.28));
      } else {
        ctx.drawImage(logo, (W / 2) - (logoW / 2), centerY - (bar * 0.28) - (logoH / 2), logoW, logoH);
      }
    } else {
      ctx.font = `800 ${Math.round(bar * 0.2)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(d.modelText || d.brandLabel || 'CAMERA', W / 2, centerY - (bar * 0.28));
    }

    ctx.textAlign = 'center';
    ctx.font = `italic 600 ${Math.round(bar * 0.14)}px sans-serif`;
    ctx.fillText(d.paramsText, W / 2, centerY + (bar * 0.05));

    ctx.font = `${Math.round(bar * 0.11)}px sans-serif`;
    ctx.fillStyle = '#D0D0D0';
    ctx.fillText(d.subText, W / 2, centerY + (bar * 0.26));
  }
};
