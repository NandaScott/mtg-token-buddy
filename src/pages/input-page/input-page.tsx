import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  makeStyles,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import DecklistInput from 'components/decklist-input/decklist-input';
import CustomSnackbars from 'components/snackbars/custom-snackbars';
import {
  flatten,
  generateArray,
  parser,
  splitIntoChunks,
  uniqueArray,
  validateInput,
} from 'utils/utils';
import getCollection, { WithName } from 'services/scryfall';
import ScryfallCard, { RelatedCard } from 'interfaces/scryfall-card';
import { AxiosError } from 'axios';
import { InputPageProps } from 'pages/input-page/input-page-interfaces';
import TokenDisplay from 'components/token-display/token-display';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  controls: {
    height: 'fit-content',
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
  const [decklist, setDecklist] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [numberOfInputs, setNumberOfInputs] = useState(generateArray(1));
  const [tokens, setTokens] = useState<ScryfallCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    in: false,
    message: '',
  });

  const validate = useCallback(() => {
    if (
      Object.keys(errors).length !== 0 &&
      process.env.NODE_ENV !== 'development'
    ) {
      setSnackbar({
        in: true,
        message:
          'Looks like you still have some errors. Please double check your input before submitting again.',
      });
      return;
    }

    setLoading(true);
    const parseableInput: string = Object.entries(decklist)
      .map(([k, v]) => v)
      .join('\n');
    const parsedDecklist = parser(parseableInput);
    const chunked = splitIntoChunks(parsedDecklist, 75);
    const collections = chunked.map((chunk) => getCollection(chunk));
    Promise.all(collections)
      .then((responses) => {
        const axiosData = responses.map((resp) => resp.data);
        const scryfallData = axiosData.map((resp) => resp.data);
        const respErrors = axiosData.map(
          (resp) => resp.not_found as WithName[],
        );
        if (respErrors.length > 0) {
          const erroredEntries = flatten(respErrors).map(
            (val) => val.name,
          ) as string[];
          const newErrors = Object.entries(decklist)
            .map(([index, value]) => {
              for (let i = 0; i < erroredEntries.length; i++) {
                const bar = erroredEntries[i];
                if (value.includes(bar)) {
                  return {
                    [index]:
                      'Scryfall could not find this card. Please double check your spelling and try again.',
                  };
                }
              }
              return {};
            })
            .reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setErrors((curr) => ({ ...curr, ...newErrors }));
        }
        const flattenedResp: ScryfallCard[] = flatten(scryfallData);
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
        setSnackbar({ in: true, message: err.response?.data.details });
      })
      .finally(() => setLoading(false));
  }, [decklist, errors]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setDecklist((currentDecklist) => ({
        ...currentDecklist,
        [e.target.name]: e.target.value,
      }));
      if (errors[e.target.name]) {
        setErrors(omit(errors, [e.target.name]));
      }
    },
    [errors],
  );

  const handleClear = () => {
    setDecklist(mapValues(decklist, () => ''));
    setTokens([]);
    setErrors({});
    setNumberOfInputs(['0']);
  };

  const addInput = useCallback(() => {
    setNumberOfInputs(generateArray(numberOfInputs.length + 1));
  }, [numberOfInputs]);

  const addError = useCallback((id: string, message: string) => {
    setErrors((curr) => ({ ...curr, [id]: message }));
  }, []);

  const handleKeyDown = useCallback(
    (name: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        addInput();
        if (decklist[name] === undefined) return;
        const isValid = validateInput(decklist[name]);
        if (!isValid) {
          addError(name, 'Entry is not a valid format');
        }
      }
    },
    [addError, addInput, decklist],
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.controls}>
        {numberOfInputs.map((v) => (
          <DecklistInput
            key={`DecklistInput-${v}`}
            name={v}
            value={decklist[v] ?? ''}
            error={errors[v]}
            handleKeyDown={handleKeyDown}
            handleInput={handleInput}
          />
        ))}
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={26} /> : 'Submit'}
          </Button>
        </Box>
      </Paper>
      {tokens.length > 0 && (
        <div className={classes.tokens}>
          <TokenDisplay tokens={tokens} />
        </div>
      )}
      <CustomSnackbars
        open={snackbar.in}
        message={snackbar.message}
        snackbarControl={setSnackbar}
      />
    </div>
  );
}
