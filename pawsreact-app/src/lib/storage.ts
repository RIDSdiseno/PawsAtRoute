import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const isNative = Capacitor.isNativePlatform();

export const storage = {
  async get(key: string): Promise<string | null> {
    if (!isNative) return localStorage.getItem(key);
    const { value } = await Preferences.get({ key });
    return value ?? null;
  },
  async set(key: string, value: string) {
    if (!isNative) return localStorage.setItem(key, value);
    await Preferences.set({ key, value });
  },
  async remove(key: string) {
    if (!isNative) return localStorage.removeItem(key);
    await Preferences.remove({ key });
  },
  async clear() {
    if (!isNative) return localStorage.clear();
    await Preferences.clear();
  },
};
