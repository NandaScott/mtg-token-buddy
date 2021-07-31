import React, { useState, useCallback } from 'react';
import { Box, Button, makeStyles, Paper } from '@material-ui/core';
import DecklistInput from 'components/decklist-input/decklist-input';
import CustomSnackbars from 'components/snackbars/custom-snackbars';
import {
  flatten,
  parser,
  splitIntoChunks,
  uniqueArray,
  validateInput,
} from 'utils/utils';
import getCollection from 'services/scryfall';
import ScryfallCard, { RelatedCard } from 'interfaces/scryfall-card';
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
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
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
      const chunked = splitIntoChunks(parsedDecklist, 75);
      const collections = chunked.map((chunk) => getCollection(chunk));
      Promise.all(collections)
        .then((responses) => {
          const responseData = responses.map((resp) => resp.data.data);
          const flattenedResp: ScryfallCard[] = flatten(responseData);
          const acceptedTypes = ['token', 'meld_part'];
          const onlyTokenMakers = flattenedResp.filter((card) =>
            Object.keys(card).includes('all_parts'),
          );
          const getAllParts = onlyTokenMakers.map((card: ScryfallCard) => {
            const { all_parts } = card;
            return all_parts?.filter((related) =>
              acceptedTypes.includes(related.component),
            ) as RelatedCard[];
          });
          const flattenTokens = flatten(getAllParts);
          const uniqueIds = new Set(flattenTokens.map((token) => token.id));
          const prep = Array.from(uniqueIds).map((id) => ({ id }));
          return getCollection(prep);
        })
        .then((resp) => {
          const foundCards: ScryfallCard[] = resp.data.data;
          const uniqueOracle = uniqueArray(foundCards, 'oracle_id');
          setTokens(uniqueOracle);
        })
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
      {tokens.length > 0 && (
        <div className={classes.tokens}>
          <TokenDisplay tokens={tokens} />
        </div>
      )}
    </div>
  );
}
