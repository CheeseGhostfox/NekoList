import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise(resolve => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  // Scale down to 256x256
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    256,
    256
  );

  return canvas.toDataURL('image/jpeg', 0.9);
};

const AvatarCropper = ({ onCropDone, onCancel }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      setImageSrc(imageDataUrl);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedImageBase64);
    } catch (e) {
      console.error(e);
    }
  };

  if (!imageSrc) {
    return (
      <div className="flex-col items-center justify-center gap-4" style={{ padding: 20 }}>
        <p className="text-hint">Select a 1:1 Avatar</p>
        <label className="tg-btn" style={{ cursor: 'pointer', textAlign: 'center' }}>
          Choose File
          <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
        </label>
        <button className="tg-btn tg-btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: '#000' }}>
      <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 80px)' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex-row justify-between" style={{ padding: 16, height: 80, backgroundColor: '#111' }}>
        <button className="tg-btn tg-btn-secondary" style={{ width: '45%' }} onClick={onCancel}>Cancel</button>
        <button className="tg-btn" style={{ width: '45%' }} onClick={handleDone}>Done</button>
      </div>
    </div>
  );
};

export default AvatarCropper;
