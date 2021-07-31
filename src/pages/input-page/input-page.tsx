import React, { useState, useCallback } from 'react';
import { Box, Button, makeStyles, Paper } from '@material-ui/core';
import DecklistInput from 'components/decklist-input/decklist-input';
import CustomSnackbars from 'components/snackbars/custom-snackbars';
import { parser, validateInput } from 'utils/utils';
import getCollection, {
  handleCollectionResponse,
  Identifier,
} from 'services/scryfall';
import ScryfallCard from 'interfaces/scryfall-card';
import { AxiosError } from 'axios';
import { InputPageProps } from 'pages/input-page/input-page-interfaces';
import TokenDisplay from 'components/token-display/token-display';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#e8e8e8',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  controls: {
    padding: theme.spacing(2),
    margin: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  },
  tokens: {
    padding: theme.spacing(4),
    width: '50%',
  },
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
  const [tokens, setTokens] = useState<ScryfallCard[]>([]);
  const [snackbar, setSnackbar] = useState({
    in: false,
    message: '',
  });

  const validate = useCallback(() => {
    const decklistMatches = validateInput(decklist);

    if (decklistMatches) {
      const parsedDecklist = parser(decklist);
      getCollection(parsedDecklist)
        .then(handleCollectionResponse)
        .then((t) => getCollection(t as Identifier[]))
        .then((resp) => setTokens(resp.data.data))
        .catch((err: AxiosError) => {
          console.error(err);
          setSnackbar({ in: true, message: err.response?.data });
        });
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

  const handleClear = () => {
    setDecklist('');
    setTokens([]);
  };

  return (
    <div className={classes.root}>
      <Paper component="div" className={classes.controls}>
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
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={handleClear}
          >
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
      </Paper>
      <div className={classes.tokens}>
        <TokenDisplay tokens={tokens} />
      </div>
    </div>
  );
}
