import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f69db72248a74c2cb0503bbebe039a35',
  appName: 'vr-cybergaurd',
  webDir: 'dist',
  server: {
    url: 'https://f69db722-48a7-4c2c-b050-3bbebe039a35.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false
    }
  }
};

export default config;