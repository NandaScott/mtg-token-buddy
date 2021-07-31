import React from 'react';
import { Box, TextField } from '@material-ui/core';

interface DecklistInputProps {
  currentInput: string;
  error?: boolean;
  handleInput: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  className?: string;
}

export default function DecklistInput(props: DecklistInputProps) {
  const { currentInput, handleInput, error, className } = props;

  return (
    <Box flexGrow={1} className={className}>
      <TextField
        error={error}
        onChange={handleInput}
        value={currentInput}
        fullWidth
        multiline
        minRows={25}
        variant="outlined"
        label="Enter your decklist"
      />
    </Box>
  );
}

DecklistInput.defaultProps = {
  error: false,
  className: '',
};
