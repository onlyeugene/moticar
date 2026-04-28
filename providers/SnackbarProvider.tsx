import React, { createContext, useContext, useState, useMemo } from 'react';
import { Snackbar } from 'react-native-paper';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SnackbarContextType, SnackbarMessage } from '@/types/snackbar';
import { Ionicons } from '@expo/vector-icons';

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
            borderRadius: 16,
            backgroundColor: '#002E35',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View 
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 16, 
                backgroundColor: 
                  snackbar.type === 'error' ? '#FF6B6B20' : 
                  snackbar.type === 'success' ? '#4ADE8020' : '#29D7DE20',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* <Ionicons 
                name={
                  snackbar.type === 'error' ? 'alert-circle' : 
                  snackbar.type === 'success' ? 'checkmark-circle' : 'information-circle'
                } 
                size={20} 
                color={
                  snackbar.type === 'error' ? '#FF6B6B' : 
                  snackbar.type === 'success' ? '#4ADE80' : '#29D7DE'
                } 
              /> */}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
                {snackbar.message}
              </Text>
              {snackbar.description && (
                <Text style={{ color: '#9BBABB', fontWeight: '400', fontSize: 12, marginTop: 2 }}>
                  {snackbar.description}
                </Text>
              )}
            </View>
          </View>
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
