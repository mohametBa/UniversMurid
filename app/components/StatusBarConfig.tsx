'use client'

import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export default function StatusBarConfig() {
  useEffect(() => {
    // Vérifier si on est sur mobile
    if (Capacitor.isNativePlatform()) {
      const setupStatusBar = async () => {
        await StatusBar.setStyle({ style: Style.Dark }); // ou Style.Dark
        await StatusBar.setBackgroundColor({ color: '#ffffff' }); // Votre couleur
        await StatusBar.setOverlaysWebView({ overlay: false });
      };
      
      setupStatusBar();
    }
  }, []);

  return null;
}