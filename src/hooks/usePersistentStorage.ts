import { useState, useEffect, useCallback } from 'react';
import { get, set, del, createStore } from 'idb-keyval';
import { Model, EditorState } from '../types/models';

const STORE_NAME = 'parameter-editor';
const MODELS_KEY = 'models';
const STATE_KEY = 'editor-state';

export const usePersistentStorage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const customStore = createStore(STORE_NAME, STORE_NAME);

  const saveModels = useCallback(async (models: Model[]) => {
    try {
      await set(MODELS_KEY, models, customStore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save models'));
    }
  }, []);

  const loadModels = useCallback(async (): Promise<Model[]> => {
    try {
      const models = await get<Model[]>(MODELS_KEY, customStore);
      return models || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load models'));
      return [];
    }
  }, []);

  const saveState = useCallback(async (state: Partial<EditorState>) => {
    try {
      await set(STATE_KEY, state, customStore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save state'));
    }
  }, []);

  const loadState = useCallback(async (): Promise<Partial<EditorState>> => {
    try {
      const state = await get<Partial<EditorState>>(STATE_KEY, customStore);
      return state || {};
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load state'));
      return {};
    }
  }, []);

  const clearStorage = useCallback(async () => {
    try {
      await del(MODELS_KEY, customStore);
      await del(STATE_KEY, customStore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear storage'));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await loadModels();
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize storage'));
        setIsLoading(false);
      }
    };

    init();
  }, [loadModels]);

  return {
    isLoading,
    error,
    saveModels,
    loadModels,
    saveState,
    loadState,
    clearStorage
  };
}; 