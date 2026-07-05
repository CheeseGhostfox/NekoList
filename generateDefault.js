const fs = require('fs');
const path = require('path');

const bioPath = path.join(__dirname, 'Devinfo', 'Bio.md');
const namePath = path.join(__dirname, 'Devinfo', 'Name.md');
const addressPath = path.join(__dirname, 'Devinfo', 'address.md');
const avatarPath = 'C:\\Users\\19547\\Desktop\\图片\\头像GPT_compressed.png';

let bio = fs.existsSync(bioPath) ? fs.readFileSync(bioPath, 'utf8').trim() : '';
let name = fs.existsSync(namePath) ? fs.readFileSync(namePath, 'utf8').trim() : '';
let addressStr = fs.existsSync(addressPath) ? fs.readFileSync(addressPath, 'utf8').trim() : '';

let avatarBase64 = null;
if (fs.existsSync(avatarPath)) {
  const ext = path.extname(avatarPath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  const imgData = fs.readFileSync(avatarPath).toString('base64');
  avatarBase64 = `data:${mime};base64,${imgData}`;
}

if (!name) name = 'CryptoAddressBook 开发者';

const addresses = [];
if (addressStr) {
  const lines = addressStr.split('\n');
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    const parts = line.split(/[:\s]+/);
    if (parts.length >= 2) {
      addresses.push({ network: parts[0].toUpperCase(), address: parts.slice(1).join('') });
    }
  });
} else {
  // Add some fallback dummy addresses if file is empty
  addresses.push({ network: 'ETH', address: '0x0000000000000000000000000000000000000000' });
}

const contact = {
  id: 'dev-sponsor-001',
  name,
  bio,
  avatar: avatarBase64,
  addresses
};

const fileContent = `export const DEFAULT_CONTACT = ${JSON.stringify(contact, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, 'src', 'utils', 'defaultContact.js'), fileContent);
console.log('defaultContact.js generated!');
