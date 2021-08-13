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
import { generateArray, validateInput } from 'utils/utils';
import ScryfallCard from 'interfaces/scryfall-card';
import { InputPageProps } from 'pages/input-page/input-page-interfaces';
import TokenDisplay from 'components/token-display/token-display';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import CleanIcon from 'assets/clean';
import useValidateAndFetch from 'pages/input-page/validate-and-fetch';

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
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(),
    margin: theme.spacing(1, 0),
  },
  clearButton: {
    [theme.breakpoints.up('md')]: {
      gridColumn: '1 / 3',
    },
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / 7',
    },
  },
  cleanButton: {
    [theme.breakpoints.up('md')]: {
      gridColumn: '3 / 5',
    },
    [theme.breakpoints.down('sm')]: {
      gridColumn: '7 / 13',
    },
  },
  submitButton: {
    [theme.breakpoints.up('md')]: {
      gridColumn: '5 / 13',
    },
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / 13',
    },
  },
  customIconButton: {
    // marginLeft: theme.spacing(),
    // paddingRight: theme.spacing(3.125),
  },
  largeIcon: {
    display: 'inherit',
    marginLeft: '4px',
    marginRight: '8px',
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

  const validate = useValidateAndFetch(
    errors,
    decklist,
    setSnackbar,
    setLoading,
    setErrors,
    setTokens,
  );

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

  const handleCleanInputs = () => {
    if (Object.keys(decklist).length === 0) {
      handleClear();
    } else {
      const reconstructedDecklist: Record<string, string> = Object.entries(
        decklist,
      )
        .map(([key, value], i) => ({ [i.toString()]: value }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      const newInputArray = generateArray(
        Object.keys(reconstructedDecklist).length,
      );
      setDecklist(reconstructedDecklist);
      setNumberOfInputs(newInputArray);
    }
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
            className={classes.clearButton}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            className={classes.cleanButton}
            classes={{
              iconSizeLarge: classes.largeIcon,
            }}
            startIcon={<CleanIcon color="secondary" />}
            onClick={handleCleanInputs}
          >
            Clean
          </Button>
          <Button
            onClick={validate}
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            className={classes.submitButton}
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
