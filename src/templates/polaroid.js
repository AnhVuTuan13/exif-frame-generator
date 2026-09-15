// Thick off-white border, serif caption in the bottom strip.
export const polaroid = {
  id: 'polaroid',
  label: 'Polaroid',
  swatch: 'linear-gradient(180deg,#eee 78%, #fff 78%)',

  layout(imgW, imgH) {
    const border = Math.round(imgW * 0.05);
    const bottom = Math.round(imgW * 0.22);
    return { W: imgW + border * 2, H: imgH + border + bottom, border, bottom };
  },

  async draw(ctx, W, H, d) {
    const imgW = d.rawImage.width || 1200;
    const imgH = d.rawImage.height || 1600;
    const { border, bottom } = this.layout(imgW, imgH);

    ctx.fillStyle = '#F7F5F0';
    ctx.fillRect(0, 0, W, H);

    if (d.imageLoaded) {
      ctx.drawImage(d.rawImage, border, border, imgW, imgH);
    } else {
      ctx.fillStyle = '#ddd';
      ctx.fillRect(border, border, imgW, imgH);
    }

    const centerY = imgH + border + bottom / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#232323';

    const nameLine = [d.brandLabel, d.modelText].filter(Boolean).join(' ');
    ctx.font = `italic 500 ${Math.round(bottom * 0.16)}px Georgia, 'Times New Roman', serif`;
    ctx.fillText(nameLine || 'Untitled', W / 2, centerY - bottom * 0.12);

    ctx.fillStyle = '#7a746a';
    ctx.font = `${Math.round(bottom * 0.105)}px Georgia, serif`;
    const meta = [d.paramsText, d.subText].filter(Boolean).join('   ·   ');
    ctx.fillText(meta, W / 2, centerY + bottom * 0.18);
  }
};
