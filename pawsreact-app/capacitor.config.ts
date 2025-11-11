import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Paws At Route',
  webDir: 'dist',

  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      splashFullScreen: true,
      splashImmersive: true,
      launchShowDuration: 2000
    }
  }
};

export default config;
