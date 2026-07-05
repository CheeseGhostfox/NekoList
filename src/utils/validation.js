export const validateAddress = (network, address) => {
  if (!address) return false;
  const net = network.toUpperCase();
  
  if (['ETH', 'BNB', 'ARBITRUM'].includes(net)) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  if (net === 'TRON') {
    return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
  }
  if (net === 'SOL') {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
  if (net === 'BTC') {
    // simplified BTC validation
    return /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || /^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/.test(address);
  }
  // For custom networks, we don't strictly validate
  return true;
};
