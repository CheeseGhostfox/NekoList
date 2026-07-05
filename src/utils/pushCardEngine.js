import QRCode from 'qrcode';
import { getNetworkInfo } from './logoUtils';
import LZString from 'lz-string';

const drawRoundedImage = (ctx, img, x, y, width, height, radius) => {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x, y, width, height);
  ctx.restore();
};

const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 8) => {
  const paragraphs = text.split(/\r?\n/);
  let displayLines = [];
  
  for (let pLine of paragraphs) {
    let currentLine = '';
    for (let i = 0; i < pLine.length; i++) {
      let testLine = currentLine + pLine[i];
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        displayLines.push(currentLine);
        currentLine = pLine[i];
      } else {
        currentLine = testLine;
      }
    }
    displayLines.push(currentLine);
  }
  
  if (displayLines.length > maxLines) {
     displayLines = displayLines.slice(0, maxLines);
     displayLines[maxLines - 1] += '...';
  }
  
  displayLines.forEach((line, index) => {
    ctx.fillText(line, x, y + (index * lineHeight));
  });
};

const drawAutoSizedText = (ctx, text, x, y, maxWidth, initialFontSize) => {
  let fontSize = initialFontSize;
  ctx.font = `bold ${fontSize}px sans-serif`;
  while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px sans-serif`;
  }
  ctx.fillText(text, x, y);
};

export const generatePushCard = async (contact) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2c2c2c'; // Dark gray
  ctx.fillRect(0, 0, 1920, 1080);

  if (contact.avatar) {
    const avatarImg = new Image();
    await new Promise(r => {
      avatarImg.onload = r;
      avatarImg.src = contact.avatar;
    });
    drawRoundedImage(ctx, avatarImg, 200, 200, 300, 300, 150);
  }

  ctx.fillStyle = '#ffffff';
  drawAutoSizedText(ctx, contact.name || 'Unknown', 550, 300, 700, 80);

  ctx.fillStyle = '#cccccc';
  ctx.font = '40px sans-serif';
  wrapText(ctx, contact.bio || 'NekoList', 550, 380, 700, 50, 8);

  // Draw Supported Networks Logos
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText('Supported Networks:', 200, 800);
  
  const uniqueNetworks = [...new Set((contact.addresses || []).map(a => a.network))];
  
  let startX = 200;
  for (const net of uniqueNetworks) {
    const info = getNetworkInfo(net);
    const size = 80;
    const y = 850;
    
    if (info.icon) {
      const netImg = new Image();
      await new Promise(r => {
        netImg.onload = r;
        netImg.src = info.icon;
      });
      ctx.drawImage(netImg, startX, y, size, size);
    } else {
      ctx.save();
      ctx.fillStyle = info.color;
      ctx.beginPath();
      ctx.arc(startX + size/2, y + size/2, size/2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${size*0.35}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(info.short, startX + size/2, y + size/2 + 2); // slight offset adjustment
      ctx.restore();
    }
    startX += size + 20;
  }

  // Compress Data using lz-string
  const payloadData = JSON.stringify({
    n: contact.name,
    b: contact.bio,
    a: contact.addresses,
    s: contact.socials,
    e: contact.exchanges
  });
  const compressedPayload = LZString.compressToEncodedURIComponent(payloadData);
  const finalPayload = 'neko://' + compressedPayload;
  
  const qrDataUrl = await QRCode.toDataURL(finalPayload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 400,
    color: { dark: '#000000ff', light: '#ffffffff' }
  });

  const qrImg = new Image();
  await new Promise(r => {
    qrImg.onload = r;
    qrImg.src = qrDataUrl;
  });
  ctx.drawImage(qrImg, 1300, 200, 400, 400);

  ctx.fillStyle = '#ffffff';
  ctx.font = '30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Scan to Import', 1500, 650);

  // Add Github URL at bottom right
  ctx.fillStyle = '#ff9800'; // Orange
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('https://github.com/CheeseGhostfox/NekoList', 1850, 1030);

  return canvas.toDataURL('image/jpeg', 0.95);
};
