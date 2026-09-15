// Cream border, brand + model set as a top strip like a postmark, thin rule divider.
export const postcard = {
  id: 'postcard',
  label: 'Postcard',
  swatch: 'linear-gradient(180deg,#e9e2d0 20%, #cfcfcf 20% 84%, #e9e2d0 84%)',

  layout(imgW, imgH) {
    const border = Math.round(imgW * 0.045);
    const topBand = Math.round(imgW * 0.09);
    const bottomBand = Math.round(imgW * 0.12);
    return { W: imgW + border * 2, H: topBand + imgH + bottomBand, border, topBand, bottomBand };
  },

  async draw(ctx, W, H, d) {
    const imgW = d.rawImage.width || 1200;
    const imgH = d.rawImage.height || 1600;
    const { border, topBand, bottomBand } = this.layout(imgW, imgH);

    ctx.fillStyle = '#EFE9DA';
    ctx.fillRect(0, 0, W, H);

    if (d.imageLoaded) {
      ctx.drawImage(d.rawImage, border, topBand, imgW, imgH);
    } else {
      ctx.fillStyle = '#ccc';
      ctx.fillRect(border, topBand, imgW, imgH);
    }

    ctx.strokeStyle = '#B9AF98';
    ctx.lineWidth = Math.max(1, Math.round(imgW * 0.0015));
    ctx.beginPath();
    ctx.moveTo(border, topBand - Math.round(topBand * 0.28));
    ctx.lineTo(W - border, topBand - Math.round(topBand * 0.28));
    ctx.stroke();

    ctx.fillStyle = '#33301f';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.round(topBand * 0.32)}px Georgia, serif`;
    const title = [d.brandLabel, d.modelText].filter(Boolean).join(' ');
    ctx.fillText(title || 'Untitled roll', border, topBand * 0.42);

    const bandCenterY = topBand + imgH + bottomBand / 2;
    ctx.textAlign = 'center';
    ctx.font = `${Math.round(bottomBand * 0.24)}px 'Courier New', monospace`;
    ctx.fillStyle = '#4a4636';
    ctx.fillText(d.paramsText, W / 2, bandCenterY - bottomBand * 0.14);

    ctx.font = `${Math.round(bottomBand * 0.18)}px Georgia, serif`;
    ctx.fillStyle = '#7c7660';
    ctx.fillText(d.subText, W / 2, bandCenterY + bottomBand * 0.2);
  }
};
