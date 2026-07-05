import btcLogo from '../assets/logos/btc.png';
import ethLogo from '../assets/logos/eth.png';
import bnbLogo from '../assets/logos/bnb.png';
import solLogo from '../assets/logos/sol.png';
import trxLogo from '../assets/logos/trx.png';
import arbLogo from '../assets/logos/arb.png';

export const BUILT_IN_NETWORKS = {
  'ETH': { color: '#627EEA', icon: ethLogo },
  'BTC': { color: '#F7931A', icon: btcLogo },
  'BNB': { color: '#F3BA2F', icon: bnbLogo },
  'SOL': { color: '#14F195', icon: solLogo },
  'TRON': { color: '#FF060A', icon: trxLogo },
  'ARBITRUM': { color: '#28A0F0', icon: arbLogo },
};

const COLORS = [
  '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', 
  '#eb2f96', '#52c41a', '#1890ff', '#faad14'
];

export const getNetworkInfo = (networkName) => {
  const upper = networkName.toUpperCase().trim();
  
  if (BUILT_IN_NETWORKS[upper]) {
    return {
      name: upper,
      short: upper.slice(0, 3),
      color: BUILT_IN_NETWORKS[upper].color,
      icon: BUILT_IN_NETWORKS[upper].icon,
      isCustom: false
    };
  }

  // Generate for custom
  const short = upper.slice(0, 3);
  let hash = 0;
  for (let i = 0; i < short.length; i++) {
    hash = short.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % COLORS.length;
  
  return {
    name: upper,
    short: short,
    color: COLORS[colorIndex],
    isCustom: true
  };
};
