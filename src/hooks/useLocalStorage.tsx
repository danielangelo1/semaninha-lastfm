import { UserRequest } from "../types/userRequest";
import { STORAGE_KEYS, DEFAULT_VALUES } from "../constants";

interface LocalStorageData {
  user: string | null;
  period: string | null;
  limit: string | null;
  showAlbum: string | null;
  showPlays: string | null;
  type: string | null;
}

export default function useLocalStorage() {
  const isLocalStorageAvailable = (): boolean => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const setLocalStorage = (values: UserRequest): boolean => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.USER, values.user);
      localStorage.setItem(STORAGE_KEYS.PERIOD, values.period);
      localStorage.setItem(STORAGE_KEYS.LIMIT, values.limit.toString());
      localStorage.setItem(STORAGE_KEYS.SHOW_ALBUM, values.showAlbum?.toString() || "false");
      localStorage.setItem(STORAGE_KEYS.SHOW_PLAYS, values.showPlays?.toString() || "false");
      localStorage.setItem(STORAGE_KEYS.TYPE, values.type || DEFAULT_VALUES.TYPE);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  };

  const getLocalStorage = (): LocalStorageData => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available, using default values');
      return {
        user: null,
        period: null,
        limit: null,
        showAlbum: null,
        showPlays: null,
        type: null,
      };
    }

    try {
      return {
        user: localStorage.getItem(STORAGE_KEYS.USER),
        period: localStorage.getItem(STORAGE_KEYS.PERIOD),
        limit: localStorage.getItem(STORAGE_KEYS.LIMIT),
        showAlbum: localStorage.getItem(STORAGE_KEYS.SHOW_ALBUM),
        showPlays: localStorage.getItem(STORAGE_KEYS.SHOW_PLAYS),
        type: localStorage.getItem(STORAGE_KEYS.TYPE),
      };
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return {
        user: null,
        period: null,
        limit: null,
        showAlbum: null,
        showPlays: null,
        type: null,
      };
    }
  };

  const clearLocalStorage = (): boolean => {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  };

  return { 
    setLocalStorage, 
    getLocalStorage, 
    clearLocalStorage,
    isLocalStorageAvailable 
  };
}
