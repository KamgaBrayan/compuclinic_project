import React, { createContext, useState, useContext, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null); // { message: '', severity: 'success' | 'error' | 'warning' | 'info' }

  const showNotification = useCallback((message, severity = 'success', duration = 6000) => {
    setNotification({ message, severity, duration, key: new Date().getTime() }); // key pour forcer le re-render si messages identiques successifs
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Snackbar
          key={notification.key}
          open={Boolean(notification)}
          autoHideDuration={notification.duration}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position du toast
          // Tu peux ajouter une transition si tu le souhaites
          // TransitionComponent={Slide} 
        >
          <Alert
            onClose={handleClose}
            severity={notification.severity}
            variant="filled" // Pour un look plus prononcé
            sx={{ width: '100%' }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};