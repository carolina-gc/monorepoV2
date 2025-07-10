import React from 'react';
import { useLoading } from '../../application/context/LoadingContext';
import { LoadingOverlay } from './LoadingOverlay.component';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <>
      {children}
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </>
  );
}; 