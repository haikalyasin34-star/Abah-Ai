import { UserProfile, ChatSession } from '../types';

const PROFILE_KEY = 'abah_ai_profile_v1.00.1';
const PROFILE_KEY_LEGACY = 'abah_ai_profile_v1.00.0';
const SESSIONS_KEY = 'abah_ai_sessions_v1.00.1';
const SESSIONS_KEY_LEGACY = 'abah_ai_sessions_v1.00.0';
const CURRENT_SESSION_ID_KEY = 'abah_ai_current_session_id';
const SETTINGS_KEY = 'abah_ai_settings_v1.00.1';

export interface AppSettings {
  ambientSoundEnabled: boolean;
  language: 'id' | 'en';
}

export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY) || localStorage.getItem(PROFILE_KEY_LEGACY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load profile:', e);
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (e) {
    console.error('Failed to clear profile:', e);
  }
}

export function loadChatSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY) || localStorage.getItem(SESSIONS_KEY_LEGACY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load chat sessions:', e);
    return [];
  }
}

export function saveChatSessions(sessions: ChatSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save chat sessions:', e);
  }
}

export function loadCurrentSessionId(): string | null {
  try {
    return localStorage.getItem(CURRENT_SESSION_ID_KEY);
  } catch {
    return null;
  }
}

export function saveCurrentSessionId(id: string): void {
  try {
    localStorage.setItem(CURRENT_SESSION_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        ambientSoundEnabled: false,
        language: 'id',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      ambientSoundEnabled: false,
      language: 'id',
    };
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
