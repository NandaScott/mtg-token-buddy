import React from 'react';
import { Box, makeStyles, TextField, useTheme } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import useRenderDebug from 'hooks/useRenderDebug';

interface DecklistInputProps {
  name: string;
  errors: Record<string, string>;
  value: string;
  success?: boolean;
  handleKeyDown: (
    name: string,
  ) => (e: React.KeyboardEvent<HTMLDivElement>) => void;
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

function DecklistInput(props: DecklistInputProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    name,
    value,
    handleInput,
    handleKeyDown,
    errors,
    success,
    className,
  } = props;
  useRenderDebug(`DecklistInput ${name}`);

  const handleAdornment = () => {
    if (errors[name]) {
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
        autoFocus
        error={!!errors[name]}
        onKeyDown={handleKeyDown(name)}
        name={name}
        variant="outlined"
        onChange={handleInput}
        value={value}
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

/**
 * Ensures that the text field does not rerender if no props have changed.
 * @param prevProps The previous props of decklist input
 * @param nextProps The next props of decklist input
 * @returns true if the props are the same
 */
const areEqual = (
  prevProps: Readonly<React.PropsWithChildren<DecklistInputProps>>,
  nextProps: Readonly<React.PropsWithChildren<DecklistInputProps>>,
) => {
  if (nextProps.value !== prevProps.value) {
    return false;
  }
  return true;
};

export default React.memo(DecklistInput, areEqual);
