import axios, { AxiosResponse } from 'axios';
import ScryfallCard, { RelatedCard } from 'interfaces/scryfall-card';

/* eslint-disable camelcase */
const BASE_URL = 'https://api.scryfall.com';

export type Identifier =
  | { id: string }
  | { mtgo_id: number }
  | { multiverse_id: number }
  | { oracle_id: string }
  | { illustration_id: string }
  | { name: string | undefined }
  | { name: string; set: string }
  | { collector_number: string; set: string };

export default async function getCollection(identifiers: Identifier[]) {
  return axios.post(`${BASE_URL}/cards/collection`, { identifiers });
}

export async function handleCollectionResponse(resp: AxiosResponse) {
  return new Promise((res, rej) => {
    const {
      not_found,
      data,
    }: { data: ScryfallCard[]; not_found: Identifier[] } = resp.data;
    const onlyTokenMakers = data.filter((card: ScryfallCard) =>
      Object.keys(card).includes('all_parts'),
    );
    const getAllParts = onlyTokenMakers.map((card: ScryfallCard) => {
      const acceptedTypes = ['token', 'meld_part'];
      const { all_parts } = card;
      return all_parts?.filter((related) =>
        acceptedTypes.includes(related.component),
      ) as RelatedCard[];
    });
    const flattened = getAllParts.reduce((acc, curr) => [...acc, ...curr], []);
    res(flattened);
  });
}
