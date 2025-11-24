import { FormData } from '../types/form';

const STORAGE_KEY = 'ai-agent-config-form';
const AUTOSAVE_TIMESTAMP_KEY = 'ai-agent-config-autosave-timestamp';

export const saveToLocalStorage = (data: Partial<FormData>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(AUTOSAVE_TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): Partial<FormData> | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTOSAVE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const getLastSaveTimestamp = (): string | null => {
  return localStorage.getItem(AUTOSAVE_TIMESTAMP_KEY);
};
