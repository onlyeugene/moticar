export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarMessage {
  type: SnackbarType;
  message: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  duration?: number;
}

export interface SnackbarContextType {
  showSnackbar: (msg: SnackbarMessage) => void;
}
