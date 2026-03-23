import React, { createContext, useContext, useState, useMemo } from 'react';
import { Snackbar } from 'react-native-paper';
import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { SnackbarContextType, SnackbarMessage } from '@/types/snackbar';

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const showSnackbar = (msg: SnackbarMessage) => {
    setSnackbar(msg);
  };

  const hideSnackbar = () => {
    setSnackbar(null);
  };

  const value = useMemo(() => ({ showSnackbar }), []);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {snackbar && (
        <Snackbar
          visible={!!snackbar}
          onDismiss={hideSnackbar}
          duration={snackbar.duration ?? 3000}
          action={
            snackbar.actionLabel
              ? {
                  label: snackbar.actionLabel,
                  onPress: () => {
                    snackbar.onActionPress?.();
                    hideSnackbar();
                  },
                }
              : undefined
          }
          style={{
            margin: 16,
            borderRadius: 8,
            backgroundColor:
              snackbar.type === 'error'
                ? '#B00020'
                : snackbar.type === 'success'
                  ? '#000000'
                  : '#121212',
          }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
            {snackbar.message}
            {snackbar.description ? `\n${snackbar.description}` : ''}
          </Text>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
}
