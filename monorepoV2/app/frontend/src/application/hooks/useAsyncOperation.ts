import { useCallback } from 'react';
import { useLoading } from '../context/LoadingContext';

export const useAsyncOperation = () => {
  const { showLoading, hideLoading } = useLoading();

  const executeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T | null> => {
    try {
      showLoading(loadingMessage);
      const result = await operation();
      return result;
    } catch (error) {
      console.error('Error en operación asíncrona:', error);
      throw error;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return { executeAsync };
}; 