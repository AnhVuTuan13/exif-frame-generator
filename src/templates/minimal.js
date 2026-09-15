// No border. A small watermark caption inset over the bottom-left of the photo.
export const minimal = {
  id: 'minimal',
  label: 'Minimal',
  swatch: 'linear-gradient(0deg,#000 22%, #444 22%)',

  layout(imgW, imgH) {
    return { W: imgW, H: imgH };
  },

  async draw(ctx, W, H, d) {
    if (d.imageLoaded) {
      ctx.drawImage(d.rawImage, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, W, H);
    }

    const pad = Math.round(W * 0.035);
    const lineH = Math.round(W * 0.024);

    const grad = ctx.createLinearGradient(0, H - lineH * 5, 0, H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H - lineH * 5, W, lineH * 5);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';

    const title = [d.brandLabel, d.modelText].filter(Boolean).join(' ');
    ctx.font = `600 ${Math.round(lineH * 0.95)}px sans-serif`;
    ctx.fillText(title, pad, H - pad - lineH * 1.2);

    ctx.font = `${Math.round(lineH * 0.7)}px sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText([d.paramsText, d.subText].filter(Boolean).join('  ·  '), pad, H - pad);
  }
};
