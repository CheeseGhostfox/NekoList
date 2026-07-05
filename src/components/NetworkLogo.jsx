import React from 'react';
import { getNetworkInfo } from '../utils/logoUtils';

const NetworkLogo = ({ network, size = 32 }) => {
  const info = getNetworkInfo(network);
  
  if (info.icon) {
    return <img src={info.icon} alt={info.name} style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />;
  }

  return (
    <div 
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: info.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: size * 0.35,
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        flexShrink: 0
      }}
    >
      {info.short}
    </div>
  );
};

export default NetworkLogo;
