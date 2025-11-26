import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.khassida.app',
  appName: 'Khassida',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1F2937",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    },
   StatusBar: {
      style: 'DARK', // ou 'DARK'
      backgroundColor: '#ffffff',
      overlaysWebView: false // Important !
    }
  }
};

export default config;
