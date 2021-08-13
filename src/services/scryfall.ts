import axios, { AxiosResponse } from 'axios';
import ScryfallCard, { RelatedCard } from 'interfaces/scryfall-card';
import { GetCollectionResponse } from 'interfaces/scryfall-responses';

/* eslint-disable camelcase */
const BASE_URL = 'https://api.scryfall.com';

export type WithId = { id: string };
export type WithMTGOId = { mtgo_id: number };
export type WithMultiverseId = { multiverse_id: number };
export type WithOracleId = { oracle_id: string };
export type WithIllustrationId = { illustration_id: string };
export type WithName = { name: string | undefined };
export type WithNameAndSet = { name: string; set: string };
export type WithCollectorNumberAndSet = {
  collector_number: string;
  set: string;
};

export type Identifier =
  | WithId
  | WithMTGOId
  | WithMultiverseId
  | WithOracleId
  | WithIllustrationId
  | WithName
  | WithNameAndSet
  | WithCollectorNumberAndSet;

export default async function getCollection(
  identifiers: Identifier[],
): Promise<AxiosResponse<GetCollectionResponse>> {
  return axios.post(`${BASE_URL}/cards/collection`, { identifiers });
}

export async function handleCollectionResponse(resp: AxiosResponse) {
  return new Promise((res, rej) => {
    const { data }: { data: ScryfallCard[]; not_found: Identifier[] } =
      resp.data;
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
