/**
 * The optional short questionnaire: 28 public-domain IPIP items, copied
 * VERBATIM from ipip.ori.org on 2026-11-15 (US spelling and all — they are
 * quoted, not edited):
 *   - the Mini-IPIP's 20 (Donnellan et al., 2006): https://ipip.ori.org/MiniIPIPKey.htm
 *   - C6 Cautiousness and E5 Excitement-seeking, 4 each, from the IPIP-NEO-120
 *     (Johnson, 2014): https://ipip.ori.org/30FacetNEO-PI-RItems.htm
 * Never the O6 Liberalism items: they ask how people vote (special category).
 *
 * `responses` in a like_ipip row are stored in THIS array's order, 1-5, so
 * this order is frozen under ITEM_SET. Change a word or the order → new ITEM_SET.
 * The page shows them in SHOWN_ORDER, interleaved so no scale sits in a block.
 */
export const ITEM_SET = 'mini20-c6-e5-v1';

export interface IpipItem {
  /** Scale: Mini-IPIP factor (E A C N O) or NEO facet (C6 E5). */
  scale: 'E' | 'A' | 'C' | 'N' | 'O' | 'C6' | 'E5';
  key: 1 | -1;
  text: string;
}

export const ITEMS: IpipItem[] = [
  // Mini-IPIP I Surgency or Extraversion
  { scale: 'E', key: 1, text: 'Am the life of the party.' },
  { scale: 'E', key: 1, text: 'Talk to a lot of different people at parties.' },
  { scale: 'E', key: -1, text: "Don't talk a lot." },
  { scale: 'E', key: -1, text: 'Keep in the background.' },
  // Mini-IPIP II Agreeableness
  { scale: 'A', key: 1, text: "Sympathize with others' feelings." },
  { scale: 'A', key: 1, text: "Feel others' emotions." },
  { scale: 'A', key: -1, text: 'Am not really interested in others.' },
  { scale: 'A', key: -1, text: "Am not interested in other people's problems." },
  // Mini-IPIP III Conscientiousness
  { scale: 'C', key: 1, text: 'Get chores done right away.' },
  { scale: 'C', key: 1, text: 'Like order.' },
  { scale: 'C', key: -1, text: 'Often forget to put things back in their proper place.' },
  { scale: 'C', key: -1, text: 'Make a mess of things.' },
  // Mini-IPIP IV Neuroticism
  { scale: 'N', key: 1, text: 'Have frequent mood swings.' },
  { scale: 'N', key: 1, text: 'Get upset easily.' },
  { scale: 'N', key: -1, text: 'Am relaxed most of the time.' },
  { scale: 'N', key: -1, text: 'Seldom feel blue.' },
  // Mini-IPIP V Intellect or Imagination
  { scale: 'O', key: 1, text: 'Have a vivid imagination.' },
  { scale: 'O', key: -1, text: 'Have difficulty understanding abstract ideas.' },
  { scale: 'O', key: -1, text: 'Am not interested in abstract ideas.' },
  { scale: 'O', key: -1, text: 'Do not have a good imagination.' },
  // IPIP-NEO-120 C6 Cautiousness (all – keyed)
  { scale: 'C6', key: -1, text: 'Jump into things without thinking.' },
  { scale: 'C6', key: -1, text: 'Make rash decisions.' },
  { scale: 'C6', key: -1, text: 'Rush into things.' },
  { scale: 'C6', key: -1, text: 'Act without thinking.' },
  // IPIP-NEO-120 E5 Excitement-seeking (all + keyed)
  { scale: 'E5', key: 1, text: 'Love excitement.' },
  { scale: 'E5', key: 1, text: 'Seek adventure.' },
  { scale: 'E5', key: 1, text: 'Enjoy being reckless.' },
  { scale: 'E5', key: 1, text: 'Act wild and crazy.' },
];

export const ITEM_COUNT = 28;

/** Display order (indices into ITEMS): one from each scale in turn. Fixed, not random. */
export const SHOWN_ORDER: number[] = [
  0, 4, 8, 12, 16, 20, 24,
  1, 5, 9, 13, 17, 21, 25,
  2, 6, 10, 14, 18, 22, 26,
  3, 7, 11, 15, 19, 23, 27,
];

/** The IPIP's own five-point response labels, 1-5. */
export const SCALE_LABELS = [
  'Very inaccurate',
  'Moderately inaccurate',
  'Neither',
  'Moderately accurate',
  'Very accurate',
];
