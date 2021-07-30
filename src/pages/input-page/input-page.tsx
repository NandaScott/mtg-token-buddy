import React, { useState, useCallback } from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import DecklistInput from 'components/decklist-input/decklist-input';
import CustomSnackbars from 'components/snackbars/custom-snackbars';
import { parser, validateInput } from 'utils/utils';
import { InputPageProps } from './input-page-interfaces';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(),
  },
  buttonWrapper: {
    display: 'flex',
    margin: theme.spacing(1, 0),
  },
  button: {
    flexGrow: 1,
    marginLeft: theme.spacing(),
  },
}));

export default function InputPage(props: InputPageProps) {
  const classes = useStyles();
  const [decklist, setDecklist] = useState('');
  const [inputError, setInputError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    in: false,
    message: '',
  });

  const validate = useCallback(() => {
    const decklistMatches = validateInput(decklist);

    if (decklistMatches) {
      const parsedDecklist = parser(decklist);
      console.log(parsedDecklist);
      // api call
    } else {
      setInputError(true);
      setSnackbar({ in: true, message: 'Format does not match' });
    }
  }, [decklist]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setDecklist(e.target.value);
      if (inputError) {
        setInputError(false);
      }
    },
    [inputError],
  );

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      padding={4}
    >
      <DecklistInput
        error={inputError}
        handleInput={handleInput}
        currentInput={decklist}
        className={classes.input}
      />
      <Box
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        className={classes.buttonWrapper}
      >
        <Button variant="outlined" size="large" color="primary">
          Clear
        </Button>
        <Button
          onClick={validate}
          fullWidth
          variant="contained"
          size="large"
          color="primary"
          className={classes.button}
        >
          Submit
        </Button>
      </Box>
      <CustomSnackbars
        open={snackbar.in}
        message={snackbar.message}
        snackbarControl={setSnackbar}
      />
    </Box>
  );
}
