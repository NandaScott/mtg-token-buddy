import React from 'react';
import { Snackbar, SnackbarCloseReason } from '@material-ui/core';
import Alert from './alert';

interface CustomSnackbarsProps {
  open: boolean;
  message: string;
  snackbarControl: React.Dispatch<
    React.SetStateAction<{
      in: boolean;
      message: string;
    }>
  >;
}

export default function CustomSnackbars(props: CustomSnackbarsProps) {
  const { open, message, snackbarControl } = props;

  const handleClose = (
    event: React.SyntheticEvent,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    snackbarControl({ in: false, message: '' });
  };

  const alertClose = (e: React.SyntheticEvent) =>
    snackbarControl({ in: false, message: '' });

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Alert onClose={alertClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
