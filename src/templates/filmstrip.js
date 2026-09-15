// Black frame with sprocket holes top & bottom, monospace caption.
export const filmstrip = {
  id: 'filmstrip',
  label: 'Filmstrip',
  swatch: '#111',

  layout(imgW, imgH) {
    const sprocketBand = Math.round(imgW * 0.05);
    const sidePad = Math.round(imgW * 0.03);
    const bottom = Math.round(imgW * 0.14);
    return {
      W: imgW + sidePad * 2,
      H: sprocketBand * 2 + imgH + bottom,
      sprocketBand,
      sidePad,
      bottom
    };
  },

  async draw(ctx, W, H, d) {
    const imgW = d.rawImage.width || 1200;
    const imgH = d.rawImage.height || 1600;
    const { sprocketBand, sidePad, bottom } = this.layout(imgW, imgH);

    ctx.fillStyle = '#0b0b0b';
    ctx.fillRect(0, 0, W, H);

    const holeW = sprocketBand * 0.34;
    const holeH = sprocketBand * 0.44;
    const gap = holeW * 1.4;

    for (const bandY of [sprocketBand / 2, sprocketBand + imgH + sprocketBand / 2]) {
      let x = sidePad * 0.6;
      while (x < W - sidePad * 0.6) {
        ctx.save();
        ctx.beginPath();
        const r = Math.min(holeW, holeH) * 0.28;
        if (ctx.roundRect) {
          ctx.roundRect(x, bandY - holeH / 2, holeW, holeH, r);
        } else {
          ctx.rect(x, bandY - holeH / 2, holeW, holeH);
        }
        ctx.fillStyle = '#3a3a3a';
        ctx.fill();
        ctx.restore();
        x += holeW + gap;
      }
    }

    if (d.imageLoaded) {
      ctx.drawImage(d.rawImage, sidePad, sprocketBand, imgW, imgH);
    } else {
      ctx.fillStyle = '#222';
      ctx.fillRect(sidePad, sprocketBand, imgW, imgH);
    }

    const centerY = sprocketBand + imgH + sprocketBand + bottom / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e8641f';
    ctx.font = `700 ${Math.round(bottom * 0.22)}px 'Courier New', monospace`;
    const title = [d.brandLabel, d.modelText].filter(Boolean).join(' · ');
    ctx.fillText(title || 'FILM', W / 2, centerY - bottom * 0.18);

    ctx.fillStyle = '#c9c9c9';
    ctx.font = `${Math.round(bottom * 0.15)}px 'Courier New', monospace`;
    ctx.fillText([d.paramsText, d.subText].filter(Boolean).join('   '), W / 2, centerY + bottom * 0.2);
  }
};
