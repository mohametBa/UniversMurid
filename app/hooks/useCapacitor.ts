import { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Preferences } from '@capacitor/preferences';

export function useCapacitor() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Détecter si nous sommes dans un environnement natif
    const checkDevice = async () => {
      try {
        const info = await Device.getInfo();
        setDeviceInfo(info);
        setIsNative(info.platform !== 'web');
        
        // Configurer la barre de statut si nous sommes en environnement natif
        if (info.platform === 'android' || info.platform === 'ios') {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#1F2937' });
        }
      } catch (error) {
        console.log('Device info non disponible:', error);
        setIsNative(false);
      }
    };

    checkDevice();
  }, []);

  return {
    deviceInfo,
    isNative,
    // Méthodes utilitaires
    getPreference: async (key: string) => {
      try {
        const { value } = await Preferences.get({ key });
        return value;
      } catch (error) {
        console.log('Erreur lors de la récupération de la préférence:', error);
        return null;
      }
    },
    setPreference: async (key: string, value: string) => {
      try {
        await Preferences.set({ key, value });
      } catch (error) {
        console.log('Erreur lors de la sauvegarde de la préférence:', error);
      }
    },
  };
}