import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface ThemeSettings {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export async function getThemeSettings(storeId: string): Promise<ThemeSettings> {
  const snap = await getDoc(doc(db, 'stores', storeId));
  if (!snap.exists()) throw new Error('Store theme not found');
  return snap.data().theme as ThemeSettings;
}

export async function updateThemeSettings(storeId: string, theme: ThemeSettings) {
  await setDoc(doc(db, 'stores', storeId), { theme }, { merge: true });
}
