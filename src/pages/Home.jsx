import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { Search, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const { contacts, loading } = useContacts();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-transition">
      <header className="app-header">
        <span className="app-header-title">{t('appTitle')}</span>
        <button onClick={() => navigate('/about')} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-link-color)' }}>
          <Info size={24} />
        </button>
      </header>
      
      <div className="content-area">
        <div className="flex-row items-center gap-2" style={{ marginBottom: 16, backgroundColor: 'var(--tg-theme-bg-color)', padding: '8px 12px', borderRadius: 10 }}>
          <Search size={20} color="var(--tg-theme-hint-color)" />
          <input 
            className="tg-input" 
            style={{ backgroundColor: 'transparent', padding: 0, border: 'none' }} 
            placeholder={t('searchContacts')} 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-hint text-center" style={{ marginTop: 40 }}>{t('loading')}</p>
        ) : filtered.length === 0 ? (
          <p className="text-hint text-center" style={{ marginTop: 40 }}>{search ? t('noFound') : t('noContacts')}</p>
        ) : (
          <div className="list-group">
            {filtered.map(contact => (
              <div key={contact.id} className="list-item gap-3" onClick={() => navigate(`/contact/${contact.id}`)}>
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.name} className="avatar" />
                ) : (
                  <div className="avatar">{contact.name.charAt(0).toUpperCase()}</div>
                )}
                <div className="flex-col flex-1" style={{ overflow: 'hidden' }}>
                  <span className="text-bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.name}</span>
                  {contact.bio && <span className="text-hint" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.bio}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
