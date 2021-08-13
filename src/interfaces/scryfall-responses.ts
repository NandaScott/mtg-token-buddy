import { Identifier } from 'services/scryfall';
import { StatusCodes as StatusCodesEnum } from 'http-status-codes';
import ScryfallCard from './scryfall-card';

export interface GetCollectionResponse {
  object: 'list';
  not_found: Identifier[];
  data: ScryfallCard[];
}

type StatusCodes = `${StatusCodesEnum}`;
type StatusNames = Lowercase<`${keyof typeof StatusCodesEnum}`>;

export interface ScryfallError {
  object: 'error';
  status: StatusNames;
  code: StatusCodes;
  details: string;
  type: string;
  warnings: string[];
}
