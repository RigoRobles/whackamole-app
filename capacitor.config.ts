import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teacherrigo.whackamole',
  appName: "Teacher Rigo's Whack-a-Mole",
  webDir: 'dist',
  android: {
    backgroundColor: '#0f172a',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
