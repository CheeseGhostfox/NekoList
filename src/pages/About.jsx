import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page-transition">
      <header className="app-header">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--tg-theme-link-color)' }}>
          <ArrowLeft size={24} />
        </button>
        <span className="app-header-title">{t('about') || 'About'}</span>
        <div style={{ width: 24 }} /> {/* placeholder to center title */}
      </header>

      <div className="content-area">
        <div className="flex-col items-center justify-center gap-4" style={{ margin: '40px 0', padding: '0 20px' }}>
          <img src="/favicon.png" alt="NekoList Logo" style={{ width: 100, height: 100, borderRadius: 20 }} />
          <h2 style={{ fontSize: 24, margin: 0, fontWeight: 'bold' }}>NekoList</h2>
          <p className="text-hint text-center" style={{ fontSize: 14 }}>A full local web3 crypto address yellow pages app</p>
        </div>

        <h3 style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginLeft: 8, marginBottom: 8 }}>{t('developerInfo') || 'Developer Info'}</h3>
        <div className="tg-card flex-col gap-3" style={{ padding: '8px 16px' }}>
          <a href="https://x.com/Cheese_Ghostfox" target="_blank" rel="noreferrer" className="flex-row items-center gap-3" style={{ padding: '12px 0', borderBottom: '1px solid var(--tg-border-color)', textDecoration: 'none', color: 'var(--tg-theme-text-color)' }}>
            <img src="/src/assets/logos/x.svg" alt="X" className="icon-invert" style={{ width: 24, height: 24 }} />
            <div className="flex-col flex-1">
              <span className="text-bold">X (Twitter)</span>
              <span className="text-hint" style={{ fontSize: 13 }}>@Cheese_Ghostfox</span>
            </div>
          </a>

          <a href="mailto:cheese_ghostfox2025@outlook.com" className="flex-row items-center gap-3" style={{ padding: '12px 0', borderBottom: '1px solid var(--tg-border-color)', textDecoration: 'none', color: 'var(--tg-theme-text-color)' }}>
            <Mail size={24} color="var(--tg-theme-hint-color)" />
            <div className="flex-col flex-1">
              <span className="text-bold">Email</span>
              <span className="text-hint" style={{ fontSize: 13 }}>cheese_ghostfox2025@outlook.com</span>
            </div>
          </a>

          <a href="https://github.com/CheeseGhostfox/NekoList" target="_blank" rel="noreferrer" className="flex-row items-center gap-3" style={{ padding: '12px 0', textDecoration: 'none', color: 'var(--tg-theme-text-color)' }}>
            <img src="/src/assets/logos/github.svg" alt="GitHub" className="icon-invert" style={{ width: 24, height: 24 }} />
            <div className="flex-col flex-1">
              <span className="text-bold">GitHub</span>
              <span className="text-hint" style={{ fontSize: 13 }}>CheeseGhostfox/NekoList</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
