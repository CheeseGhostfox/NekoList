import { Preferences } from '@capacitor/preferences';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Capacitor } from '@capacitor/core';
import { encryptData, decryptData } from '../utils/encryption';
import { DEFAULT_CONTACT } from '../utils/defaultContact';
import i18n from '../i18n';

const STORAGE_KEY = 'crypto_contacts_data';
const MOCK_SECRET = 'vibecode_mock_secret_123';

let activeSecret = null;

export const authenticateAndGetSecret = async () => {
  if (activeSecret) return activeSecret;

  if (Capacitor.isNativePlatform()) {
    try {
      const info = await BiometricAuth.checkBiometry();
      if (info.isAvailable) {
        // Authenticate user
        await BiometricAuth.authenticate({
          reason: i18n.t('authReason'),
          cancelTitle: i18n.t('cancel'),
        });
        
        // After successful authentication, retrieve or generate the master secret
        // In a real production app, use BiometricAuth's setCredential/getCredential
        // Here we simulate secure retrieval using Preferences for the demo
        const { value: storedSecret } = await Preferences.get({ key: 'master_secret' });
        if (storedSecret) {
          activeSecret = storedSecret;
        } else {
          activeSecret = Math.random().toString(36).substring(2) + Date.now().toString(36);
          await Preferences.set({ key: 'master_secret', value: activeSecret });
        }
        return activeSecret;
      } else {
        // Fallback for native without biometrics
        activeSecret = 'fallback_secret_no_biometrics';
        return activeSecret;
      }
    } catch (e) {
      console.error("Biometric error", e);
      throw new Error("Authentication failed");
    }
  } else {
    // Web mock
    activeSecret = MOCK_SECRET;
    return activeSecret;
  }
};

export const loadContacts = async () => {
  const secret = await authenticateAndGetSecret();
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  if (!value) {
    const encrypted = encryptData([DEFAULT_CONTACT], secret);
    await Preferences.set({ key: STORAGE_KEY, value: encrypted });
    return [DEFAULT_CONTACT];
  }
  
  const decrypted = decryptData(value, secret);
  return decrypted || [];
};

export const saveContacts = async (contacts) => {
  const secret = await authenticateAndGetSecret();
  const encrypted = encryptData(contacts, secret);
  await Preferences.set({ key: STORAGE_KEY, value: encrypted });
};
