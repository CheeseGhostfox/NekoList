import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import AvatarCropper from '../components/AvatarCropper';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { validateAddress } from '../utils/validation';

const BUILT_IN_NETWORKS = ['ETH', 'BTC', 'BNB', 'SOL', 'TRON', 'ARBITRUM'];
const EXCHANGES = ['Binance', 'Bitget'];

const AddContact = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, addContact, updateContact } = useContacts();
  const [showCropper, setShowCropper] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: null,
    addresses: [],
    socials: [],
    exchanges: []
  });

  const [selectedNetwork, setSelectedNetwork] = useState('ETH');
  const [customNetwork, setCustomNetwork] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const [newSocial, setNewSocial] = useState('');
  
  const [selectedExchange, setSelectedExchange] = useState('Binance');
  const [newExchangeId, setNewExchangeId] = useState('');

  useEffect(() => {
    if (id && contacts.length > 0) {
      const existing = contacts.find(c => c.id === id);
      if (existing) {
        setFormData({
          ...existing,
          socials: existing.socials || [],
          exchanges: existing.exchanges || []
        });
      }
    }
  }, [id, contacts]);

  const handleAddAddress = () => {
    const finalNetwork = selectedNetwork === 'Custom' ? customNetwork : selectedNetwork;
    if (!finalNetwork || !newAddress) return;
    
    if (!validateAddress(finalNetwork, newAddress)) {
      alert(t('invalidAddress') || 'Invalid address format for selected network.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), { network: finalNetwork.toUpperCase(), address: newAddress }]
    }));
    setCustomNetwork('');
    setNewAddress('');
  };

  const handleRemoveAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const handleAddSocial = () => {
    if (!newSocial) return;
    setFormData(prev => ({
      ...prev,
      socials: [...(prev.socials || []), newSocial]
    }));
    setNewSocial('');
  };

  const handleRemoveSocial = (index) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };

  const handleAddExchange = () => {
    if (!newExchangeId) return;
    setFormData(prev => ({
      ...prev,
      exchanges: [...(prev.exchanges || []), { platform: selectedExchange, uid: newExchangeId }]
    }));
    setNewExchangeId('');
  };

  const handleRemoveExchange = (index) => {
    setFormData(prev => ({
      ...prev,
      exchanges: prev.exchanges.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!formData.name) return alert(t('nameReq'));
    if (id) {
      await updateContact(id, formData);
    } else {
      await addContact(formData);
    }
    navigate(-1);
  };

  if (showCropper) {
    return (
      <AvatarCropper 
        onCropDone={(base64) => {
          setFormData(prev => ({ ...prev, avatar: base64 }));
          setShowCropper(false);
        }} 
        onCancel={() => setShowCropper(false)}
      />
    );
  }

  return (
    <div className="page-transition">
      <header className="app-header">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-link-color)' }}>
          <X size={24} />
        </button>
        <span className="app-header-title">{id ? t('editContact') : t('newContact')}</span>
        <button className="tg-btn tg-btn-secondary" style={{ width: 'auto', padding: '6px 12px' }} onClick={handleSave}>
          {t('save')}
        </button>
      </header>
      <div className="content-area flex-col gap-4 pb-10">
        
        {/* Avatar Section */}
        <div className="flex-col items-center justify-center gap-2" style={{ margin: '20px 0' }}>
          {formData.avatar ? (
            <img src={formData.avatar} alt="Avatar" className="avatar" style={{ width: 80, height: 80 }} onClick={() => setShowCropper(true)} />
          ) : (
            <div className="avatar" style={{ width: 80, height: 80, backgroundColor: 'var(--tg-theme-secondary-bg-color)', cursor: 'pointer' }} onClick={() => setShowCropper(true)}>
              <ImageIcon size={32} color="var(--tg-theme-hint-color)" />
            </div>
          )}
          <span className="text-hint">{t('setAvatar')}</span>
        </div>

        {/* Basic Info */}
        <div className="tg-card flex-col gap-3">
          <input 
            className="tg-input" 
            placeholder={t('nameReq')} 
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <textarea 
            className="tg-input" 
            placeholder={t('bioOpt')} 
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>

        {/* Addresses */}
        <h3 style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginLeft: 8 }}>{t('addresses')}</h3>
        <div className="tg-card flex-col gap-3">
          {(formData.addresses || []).map((addr, idx) => (
            <div key={idx} className="flex-row items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--tg-border-color)' }}>
              <div className="flex-col">
                <span className="text-bold">{addr.network}</span>
                <span className="text-hint" style={{ fontSize: 12, wordBreak: 'break-all' }}>{addr.address}</span>
              </div>
              <button onClick={() => handleRemoveAddress(idx)} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-destructive-text-color)' }}>
                <X size={20} />
              </button>
            </div>
          ))}
          
          <div className="flex-col gap-2" style={{ marginTop: 8 }}>
            <div className="flex-row gap-2">
              <select 
                className="tg-input" 
                style={{ flex: 1, paddingRight: 10, appearance: 'none', WebkitAppearance: 'none' }}
                value={selectedNetwork}
                onChange={e => setSelectedNetwork(e.target.value)}
              >
                {BUILT_IN_NETWORKS.map(net => <option key={net} value={net}>{net}</option>)}
                <option value="Custom">{t('custom')}</option>
              </select>
              {selectedNetwork === 'Custom' && (
                <input 
                  className="tg-input" 
                  placeholder={t('networkPlaceholder')} 
                  style={{ flex: 1 }}
                  value={customNetwork}
                  onChange={e => setCustomNetwork(e.target.value)}
                />
              )}
            </div>
            <input 
              className="tg-input" 
              placeholder={t('addressPlaceholder')} 
              value={newAddress}
              onChange={e => setNewAddress(e.target.value)}
            />
            <button className="tg-btn tg-btn-secondary flex-row items-center justify-center gap-2" onClick={handleAddAddress}>
              <Plus size={18} /> {t('addAddress')}
            </button>
          </div>
        </div>

        {/* Social Media Links */}
        <h3 style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginLeft: 8 }}>{t('socialLinks')}</h3>
        <div className="tg-card flex-col gap-3">
          {(formData.socials || []).map((social, idx) => (
            <div key={idx} className="flex-row items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--tg-border-color)' }}>
              <div className="flex-col">
                <span className="text-hint" style={{ fontSize: 13, wordBreak: 'break-all' }}>{social}</span>
              </div>
              <button onClick={() => handleRemoveSocial(idx)} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-destructive-text-color)', marginLeft: 10 }}>
                <X size={20} />
              </button>
            </div>
          ))}
          
          <div className="flex-col gap-2" style={{ marginTop: 8 }}>
            <input 
              className="tg-input" 
              placeholder="e.g. https://t.me/username" 
              value={newSocial}
              onChange={e => setNewSocial(e.target.value)}
            />
            <button className="tg-btn tg-btn-secondary flex-row items-center justify-center gap-2" onClick={handleAddSocial}>
              <Plus size={18} /> {t('addSocial')}
            </button>
          </div>
        </div>

        {/* Exchange UIDs */}
        <h3 style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginLeft: 8 }}>{t('exchanges')}</h3>
        <div className="tg-card flex-col gap-3">
          {(formData.exchanges || []).map((exch, idx) => (
            <div key={idx} className="flex-row items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--tg-border-color)' }}>
              <div className="flex-col">
                <span className="text-bold">{exch.platform}</span>
                <span className="text-hint" style={{ fontSize: 12, wordBreak: 'break-all' }}>UID: {exch.uid}</span>
              </div>
              <button onClick={() => handleRemoveExchange(idx)} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-destructive-text-color)' }}>
                <X size={20} />
              </button>
            </div>
          ))}
          
          <div className="flex-col gap-2" style={{ marginTop: 8 }}>
            <div className="flex-row gap-2">
              <select 
                className="tg-input" 
                style={{ flex: 1, paddingRight: 10, appearance: 'none', WebkitAppearance: 'none' }}
                value={selectedExchange}
                onChange={e => setSelectedExchange(e.target.value)}
              >
                {EXCHANGES.map(net => <option key={net} value={net}>{net}</option>)}
              </select>
            </div>
            <input 
              className="tg-input" 
              placeholder="Exchange UID" 
              value={newExchangeId}
              onChange={e => setNewExchangeId(e.target.value)}
            />
            <button className="tg-btn tg-btn-secondary flex-row items-center justify-center gap-2" onClick={handleAddExchange}>
              <Plus size={18} /> {t('addExchange')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddContact;
