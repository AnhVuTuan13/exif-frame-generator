// Helpers shared by every frame template.

const logoCache = {};

/**
 * Fetch a brand's SVG logo, recolor it to a solid hex color, and cache the
 * resulting <img>. Returns null if the brand has no logo or the fetch fails
 * (templates should fall back to text in that case).
 */
export async function loadTintedLogo(brandKey, hexColor, BRAND_LOGOS) {
  const url = BRAND_LOGOS[brandKey];
  if (!url) return null;

  const cacheKey = `${brandKey}::${hexColor}`;
  if (logoCache[cacheKey]) return logoCache[cacheKey];

  try {
    const response = await fetch(url);
    const svgText = await response.text();
    const tinted = svgText
      .replace(/<svg/i, `<svg fill="${hexColor}" `)
      .replace(/fill="[^"]*"/gi, `fill="${hexColor}"`);
    const blob = new Blob([tinted], { type: 'image/svg+xml' });
    const objUrl = URL.createObjectURL(blob);

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = objUrl;
    });
    URL.revokeObjectURL(objUrl);

    logoCache[cacheKey] = img;
    return img;
  } catch (e) {
    return null;
  }
}

/** Draw an image clipped to a rounded-rect path, with an optional drop shadow. */
export function drawRoundedImage(ctx, img, x, y, w, h, radius, shadow) {
  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
  if (shadow) {
    ctx.save();
    ctx.shadowColor = shadow.color || 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = shadow.blur || 20;
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();
  }
  ctx.clip();
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();
}

/** Fill the canvas with a heavily blurred, darkened copy of the source image. */
export function drawBlurredBackground(ctx, img, W, H, loaded) {
  ctx.save();
  ctx.filter = 'blur(40px) brightness(0.5)';
  if (loaded) {
    ctx.drawImage(img, -50, -50, W + 100, H + 100);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
