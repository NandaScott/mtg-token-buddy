import React, { useState, useEffect } from 'react';
import { Box, makeStyles, TextField, useTheme } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

interface DecklistInputProps {
  currentInput: string;
  error?: boolean;
  success?: boolean;
  handleInput: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  input: {
    borderRadius: '0px',
  },
  success: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: theme.palette.success.main,
  },
  innerInput: {
    padding: theme.spacing(),
  },
}));

export default function DecklistInput(props: DecklistInputProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { currentInput, handleInput, error, success, className } = props;

  const handleAdornment = () => {
    if (error) {
      return <ErrorIcon color="error" />;
    }
    if (success) {
      return <CheckCircleIcon htmlColor={theme.palette.success.main} />;
    }

    return null;
  };

  return (
    <Box flexGrow={1} className={className}>
      <TextField
        variant="outlined"
        onChange={handleInput}
        value={currentInput}
        InputProps={{
          className: classes.input,
          endAdornment: handleAdornment(),
          inputProps: {
            className: classes.innerInput,
          },
        }}
        placeholder="1x Beast Within"
        fullWidth
      />
    </Box>
  );
}

DecklistInput.defaultProps = {
  error: false,
  success: false,
  className: '',
};
