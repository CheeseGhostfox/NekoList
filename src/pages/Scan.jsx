import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { useContacts } from '../hooks/useContacts';
import { ImagePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LZString from 'lz-string';

const Scan = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { addContact } = useContacts();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            let data;
            if (code.data.startsWith('neko://')) {
               const compressed = code.data.substring(7);
               data = JSON.parse(LZString.decompressFromEncodedURIComponent(compressed));
            } else {
               data = JSON.parse(code.data); // fallback for older cards
            }
            
            const avatarCanvas = document.createElement('canvas');
            avatarCanvas.width = 256;
            avatarCanvas.height = 256;
            const aCtx = avatarCanvas.getContext('2d');
            
            const sx = (200 / 1920) * img.width;
            const sy = (200 / 1080) * img.height;
            const sw = (300 / 1920) * img.width;
            const sh = (300 / 1080) * img.height;

            aCtx.drawImage(img, sx, sy, sw, sh, 0, 0, 256, 256);
            const avatarBase64 = avatarCanvas.toDataURL('image/jpeg', 0.9);

            const newContact = {
              name: data.n,
              bio: data.b,
              addresses: data.a || [],
              socials: data.s || [],
              exchanges: data.e || [],
              avatar: avatarBase64
            };

            await addContact(newContact);
            alert(`Successfully imported contact: ${newContact.name}`);
            navigate('/');
          } catch (err) {
            console.error("Failed to parse QR data", err);
            alert("Invalid PushCard format.");
          }
        } else {
          alert("No QR code found in the image.");
        }
        setLoading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-transition">
      <header className="app-header">
        <span className="app-header-title">{t('importPushCard') || 'Scan'}</span>
      </header>
      <div className="content-area">
        <div className="tg-card flex-col items-center justify-center gap-4" style={{minHeight: 300}}>
          <ImagePlus size={64} color="var(--tg-theme-hint-color)" />
          <p className="text-hint text-center">
            {(t('scanHint') || 'Select Image').split('\\').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{display: 'none'}} 
          />
          <button 
            className="tg-btn" 
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            {loading ? (t('processing') || 'Processing') : (t('selectImage') || 'Select Image')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scan;
