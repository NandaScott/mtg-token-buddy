import React, { useCallback } from 'react';
import ScryfallCard, { RelatedCard } from 'interfaces/scryfall-card';
import getCollection, { WithName } from 'services/scryfall';
import { parser, splitIntoChunks, flatten, uniqueArray } from 'utils/utils';
import { AxiosError } from 'axios';

type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;
type Errors = Record<string, string>;
type Decklist = Record<string, string>;
type SetSnackbar = StateDispatch<{
  in: boolean;
  message: string;
}>;
type SetLoading = StateDispatch<boolean>;
type SetErrors = StateDispatch<Errors>;
type SetTokens = StateDispatch<ScryfallCard[]>;

const useValidateAndFetch = (
  errors: Errors,
  decklist: Decklist,
  setSnackbar: SetSnackbar,
  setLoading: SetLoading,
  setErrors: SetErrors,
  setTokens: SetTokens,
) =>
  useCallback(() => {
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
  }, [decklist, errors, setErrors, setLoading, setSnackbar, setTokens]);

export default useValidateAndFetch;
