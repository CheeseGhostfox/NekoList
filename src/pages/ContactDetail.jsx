import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import NetworkLogo from '../components/NetworkLogo';
import { Copy, Check, Share2, Trash2, ArrowLeft, MoreHorizontal, ExternalLink, Download } from 'lucide-react';
import { generatePushCard } from '../utils/pushCardEngine';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Media } from '@capacitor-community/media';
import telegramLogo from '../assets/logos/telegram.svg';
import xLogo from '../assets/logos/x.svg';
import discordLogo from '../assets/logos/discord.svg';
import elementLogo from '../assets/logos/element.svg';
import binanceLogo from '../assets/logos/binance.png';
import bitgetLogo from '../assets/logos/bitget.png';

// Utility to get the right icon for social links
const getSocialIcon = (url) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram')) {
    return <img src={telegramLogo} alt="Telegram" style={{ width: 24, height: 24 }} />;
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return <img src={xLogo} alt="X" className="icon-invert" style={{ width: 24, height: 24 }} />;
  }
  if (lowerUrl.includes('discord')) {
    return <img src={discordLogo} alt="Discord" style={{ width: 24, height: 24 }} />;
  }
  if (lowerUrl.includes('element')) {
    return <img src={elementLogo} alt="Element" style={{ width: 24, height: 24 }} />;
  }
  return <ExternalLink size={24} color="var(--tg-theme-hint-color)" />;
};

const ContactDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, deleteContact } = useContacts();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showMore, setShowMore] = useState(false);
  
  const contact = contacts.find(c => c.id === id);

  if (!contact) {
    return (
      <div className="page-transition flex-col items-center justify-center" style={{height: '100vh'}}>
        <p>{t('noFound') || 'Contact not found'}</p>
        <button className="tg-btn" style={{width: 150, marginTop: 20}} onClick={() => navigate('/')}>Back</button>
      </div>
    );
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async () => {
    try {
      const dataUrl = await generatePushCard(contact);
      
      if (Capacitor.isNativePlatform()) {
        const base64Data = dataUrl.split(',')[1];
        const fileName = `PushCard_${contact.name}_${Date.now()}.jpg`;
        
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache
        });
        
        await Share.share({
          title: `PushCard - ${contact.name}`,
          text: `Check out ${contact.name}'s NekoList PushCard!`,
          url: savedFile.uri,
          dialogTitle: 'Share PushCard'
        });
      } else {
        const link = document.createElement('a');
        link.download = `PushCard_${contact.name}.jpg`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to generate PushCard');
    }
  };

  const handleSaveToGallery = async () => {
    try {
      const dataUrl = await generatePushCard(contact);
      
      if (Capacitor.isNativePlatform()) {
        const base64Data = dataUrl.split(',')[1];
        const fileName = `PushCard_Temp_${Date.now()}.jpg`;
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache
        });
        
        await Media.savePhoto({ path: savedFile.uri });
        alert(t('save') + ' OK!');
      } else {
        const link = document.createElement('a');
        link.download = `PushCard_${contact.name}.jpg`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save PushCard: ' + e.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('deleteConfirm') || 'Delete this contact?')) {
      await deleteContact(id);
      navigate('/');
    }
  };

  return (
    <div className="page-transition">
      <header className="app-header">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-link-color)' }}>
          <ArrowLeft size={24} />
        </button>
        <span className="app-header-title">{contact.name}</span>
        <div className="flex-row gap-3 items-center">
          <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-destructive-text-color)' }}>
            <Trash2 size={24} />
          </button>
        </div>
      </header>

      <div className="content-area pb-10">
        {/* Profile Header */}
        <div className="flex-col items-center gap-3" style={{ margin: '20px 0 30px' }}>
          {contact.avatar ? (
            <img src={contact.avatar} alt="Avatar" className="avatar" style={{ width: 100, height: 100 }} />
          ) : (
            <div className="avatar" style={{ width: 100, height: 100, fontSize: 40 }}>
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 style={{ fontSize: 24, margin: 0, textAlign: 'center' }}>{contact.name}</h2>
          {contact.bio && (
            <p className="text-hint" style={{ 
              whiteSpace: 'pre-wrap', 
              display: '-webkit-box', 
              WebkitLineClamp: 8, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              textAlign: 'center',
              padding: '0 20px'
            }}>
              {contact.bio}
            </p>
          )}
          
          <div className="flex-row gap-2 w-full" style={{ marginTop: 10, width: '100%', padding: '0 20px' }}>
            <button className="tg-btn flex-row items-center justify-center gap-1" style={{ flex: 1, padding: '8px 12px', borderRadius: 20 }} onClick={handleSaveToGallery}>
              <Download size={18} /> {t('save') || 'Save'}
            </button>
            <button className="tg-btn flex-row items-center justify-center gap-1" style={{ width: 'auto', padding: '8px 12px', borderRadius: 20, backgroundColor: 'transparent', border: '1px solid var(--tg-theme-button-color)', color: 'var(--tg-theme-button-color)' }} onClick={handleShare}>
              <Share2 size={18} />
            </button>
            <button className="tg-btn flex-row items-center justify-center gap-1" style={{ width: 'auto', padding: '8px 12px', borderRadius: 20, backgroundColor: 'transparent', border: '1px solid var(--tg-theme-button-color)', color: 'var(--tg-theme-button-color)' }} onClick={() => navigate(`/edit/${id}`)}>
              {t('edit') || 'Edit'}
            </button>
            <button className="tg-btn flex-row items-center justify-center gap-1" style={{ width: 'auto', padding: '8px 12px', borderRadius: 20, backgroundColor: 'var(--tg-theme-secondary-bg-color)', color: 'var(--tg-theme-text-color)' }} onClick={() => setShowMore(!showMore)}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* More Info Section */}
        {showMore && (
          <div className="tg-card" style={{ marginBottom: 20, animation: 'fadeIn 0.2s ease-in-out' }}>
            <h3 style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginBottom: 8 }}>{t('socialLinks')}</h3>
            {contact.socials && contact.socials.length > 0 ? (
              <div className="flex-col gap-2 mb-4">
                {contact.socials.map((social, idx) => (
                  <a key={idx} href={social.startsWith('http') ? social : `https://${social}`} target="_blank" rel="noreferrer" className="flex-row items-center gap-3" style={{ padding: '8px 0', textDecoration: 'none', color: 'var(--tg-theme-text-color)' }}>
                    {getSocialIcon(social)}
                    <span style={{ fontSize: 14, wordBreak: 'break-all' }}>{social}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-hint" style={{ fontSize: 13, marginBottom: 16 }}>{t('noSocials')}</p>
            )}

            <h3 style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginBottom: 8 }}>{t('exchanges')}</h3>
            {contact.exchanges && contact.exchanges.length > 0 ? (
              <div className="flex-col gap-2">
                {contact.exchanges.map((exch, idx) => (
                  <div key={idx} className="flex-row items-center gap-3" style={{ padding: '8px 0' }} onClick={() => handleCopy(exch.uid, `exch-${idx}`)}>
                    {exch.platform === 'Binance' ? (
                      <img src={binanceLogo} alt="Binance" style={{ width: 24, height: 24 }} />
                    ) : (
                      <img src={bitgetLogo} alt="Bitget" style={{ width: 24, height: 24 }} />
                    )}
                    <div className="flex-col flex-1" style={{ overflow: 'hidden' }}>
                      <span className="text-bold">{exch.platform}</span>
                      <span className="text-hint" style={{ fontSize: 13 }}>UID: {exch.uid}</span>
                    </div>
                    <div>
                      {copiedIndex === `exch-${idx}` ? (
                        <Check size={20} color="#14F195" />
                      ) : (
                        <Copy size={20} color="var(--tg-theme-hint-color)" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-hint" style={{ fontSize: 13 }}>{t('noExchanges')}</p>
            )}
          </div>
        )}

        {/* Addresses */}
        <h3 style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginLeft: 8, marginBottom: 8 }}>{t('addresses')}</h3>
        <div className="list-group">
          {contact.addresses && contact.addresses.length > 0 ? (
            contact.addresses.map((addr, idx) => (
              <div key={idx} className="list-item gap-3" onClick={() => handleCopy(addr.address, `addr-${idx}`)}>
                <NetworkLogo network={addr.network} />
                <div className="flex-col flex-1" style={{ overflow: 'hidden' }}>
                  <span className="text-bold">{addr.network}</span>
                  <span className="text-hint" style={{ fontSize: 13, wordBreak: 'break-all' }}>{addr.address}</span>
                </div>
                <div>
                  {copiedIndex === `addr-${idx}` ? (
                    <Check size={20} color="#14F195" />
                  ) : (
                    <Copy size={20} color="var(--tg-theme-hint-color)" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="list-item justify-center"><p className="text-hint">{t('noAddresses')}</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
