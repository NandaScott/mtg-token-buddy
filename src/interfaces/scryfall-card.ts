/* eslint-disable camelcase */
export default interface ScryfallCard extends Object {
  // Core fields
  arena_id?: number;
  id: string;
  lang: string;
  mtgo_id?: number;
  mtgo_foil_id?: number;
  multiverse_ids?: number[];
  tcgplayer_id?: number;
  cardmarket_id?: number;
  object: string;
  oracle_id: string;
  prints_search_uri: string;
  rulings_uri: string;
  scryfall_id: string;
  uri: string;

  // Gameplay fields
  all_parts?: RelatedCard[];
  card_faces?: CardFace[];
  cmc: number;
  color_identity: Color[];
  color_indicator?: Color[];
  colors?: Color[];
  edhrec_rank?: number;
  foil: boolean;
  hand_modifier?: string;
  keywords: string[];
  layout: Layout;
  legalities: Legality;
  life_modifier?: string;
  loyalty?: string;
  mana_cost?: string;
  name: string;
  nonfoil: boolean;
  oracle_text?: string;
  oversized: boolean;
  power?: string;
  produced_mana?: Color[];
  reserved: boolean;
  toughness?: string;
  type_line: string;

  // Print fields
  artist?: string;
  booster: boolean;
  border_color: BorderColor;
  card_back_id: string;
  collector_number: string;
  content_warning?: boolean;
  digital: boolean;
  flavor_name?: string;
  flavor_text?: string;
  frame_effects?: FrameEffect[];
  frame: Frame;
  full_art: boolean;
  games: Games[];
  highres_image: boolean;
  illustration_id?: string;
  image_uris?: ImageUris;
  prices: Prices;
  printed_name?: string;
  printed_text?: string;
  printed_type_line?: string;
  promo: boolean;
  promo_types?: string[];
  purchases_uri: PurchaseUris;
  rarity: Rarity;
  related_uris: RelatedUris;
  released_at: string;
  reprint: boolean;
  scryfall_set_uri: string;
  set_name: string;
  set_search_uri: string;
  set_type: string;
  set_uri: string;
  set: string;
  story_spotlight: boolean;
  textless: boolean;
  variation: boolean;
  variation_of?: string;
  watermark?: string;
  preview: Preview;
}

export interface CardFace {
  artist: string;
  color_indicator: Color[] | [];
  colors: Color[] | [];
  flavor_text: string;
  illustration_id: string;
  image_uris: ImageUris;
  loyalty: string;
  mana_cost: string;
  name: string;
  object: string;
  oracle_text: string;
  power: string;
  printed_name: string;
  printed_text: string;
  printed_type_line: string;
  toughness: string;
  type_line: string;
  watermark: string;
}

export interface RelatedCard {
  id: string;
  object: string;
  component: RelatedCardComponent;
  name: string;
  type_line: string;
  uri: string;
}

export type RelatedCardComponent =
  | 'token'
  | 'meld_part'
  | 'meld_result'
  | 'combo_piece';

export type Color = 'W' | 'U' | 'B' | 'R' | 'G';

export type ImageUris = {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
};

export type Layout =
  | 'normal'
  | 'split'
  | 'flip'
  | 'transform'
  | 'modal_dfc'
  | 'meld'
  | 'leveler'
  | 'saga'
  | 'adventure'
  | 'planar'
  | 'scheme'
  | 'vanguard'
  | 'token'
  | 'double_faced_token'
  | 'emblem'
  | 'augment'
  | 'host'
  | 'art_series'
  | 'double_sided';

export type Frame = '1993' | '1997' | '2003' | '2015' | 'future';

export type FrameEffect =
  | 'legendary'
  | 'miracle'
  | 'nyxtouched'
  | 'draft'
  | 'devoid'
  | 'tombstone'
  | 'colorshifted'
  | 'inverted'
  | 'sunmoondfc'
  | 'compasslanddfc'
  | 'originpwdfc'
  | 'mooneldrazidfc'
  | 'moonreversemoondfc'
  | 'showcase'
  | 'extendedart'
  | 'companion'
  | 'etched'
  | 'snow';

export type Legality = 'legal' | 'not_legal' | 'restricted' | 'banned';

export type BorderColor = 'black' | 'borderless' | 'gold' | 'silver' | 'white';

export type Games = 'paper' | 'arena' | 'mtgo';

export type Prices = {
  usd: string;
  usd_foil: string;
  eur: string;
  eur_foil: string;
  tix: string;
};

export type RelatedUris = {
  gatherer: string;
  tcgplayer_decks: string;
  edhrec: string;
  mtgtop8: string;
};

export type PurchaseUris = {
  tcgplayer: string;
  cardmarket: string;
  cardhoarder: string;
};

export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic';

export type Preview = {
  previewed_at?: string;
  source_uri?: string;
  source?: string;
};
