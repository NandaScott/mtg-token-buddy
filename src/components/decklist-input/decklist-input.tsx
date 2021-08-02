import React, { useRef } from 'react';
import { Box, makeStyles, TextField, useTheme } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { v4 as uuidv4 } from 'uuid';
import { validateInput } from 'utils/utils';

interface DecklistInputProps {
  currentValues: Record<string, string>;
  errors: Record<string, string>;
  success?: boolean;
  handleInput: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  addInput: () => void;
  addError: (id: string, message: string) => void;
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
  const name = useRef(uuidv4());
  const {
    currentValues,
    handleInput,
    addInput,
    addError,
    errors,
    success,
    className,
  } = props;

  const handleAdornment = () => {
    if (errors[name.current]) {
      return <ErrorIcon color="error" />;
    }
    if (success) {
      return <CheckCircleIcon htmlColor={theme.palette.success.main} />;
    }

    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      addInput();
      const isValid = validateInput(currentValues[name.current]);
      if (!isValid) {
        addError(name.current, 'Entry is not a valid format');
      }
    }
  };

  return (
    <Box flexGrow={1} className={className}>
      <TextField
        autoFocus
        error={!!errors[name.current]}
        onKeyDown={handleKeyDown}
        name={name.current}
        variant="outlined"
        onChange={handleInput}
        value={currentValues[name.current]}
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
  success: false,
  className: '',
};
