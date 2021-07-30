import React from 'react';
import MuiAlert, { Color } from '@material-ui/lab/Alert';
import { Children } from 'interfaces/util-interfaces';

interface AlertProps extends Children {
  onClose?: (e: React.SyntheticEvent) => void;
  severity?: Color;
}

const Alert = ({ onClose, severity, children }: AlertProps) => (
  <MuiAlert
    elevation={6}
    variant="filled"
    onClose={onClose}
    severity={severity}
  >
    {children}
  </MuiAlert>
);

Alert.defaultProps = {
  onClose: undefined,
  severity: undefined,
};

export default Alert;
