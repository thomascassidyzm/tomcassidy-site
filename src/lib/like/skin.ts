/**
 * "What are you like, anyway?" — the tomcassidy.co skin: every word a person
 * reads, except the moments themselves (those are the measurement, and live in
 * the engine's bank).
 *
 * The frame, binding (Tom, 2026-10-10): no categorisation of any kind — only
 * tendencies, directions and indications of them. The OCEAN names label the
 * axes as vocabulary, never as verdicts. No population claims ("among 100
 * people", "most people", percentiles): the scores are uncalibrated, so every
 * sentence is self-scaled ("you lean towards…"). No compatibility score for
 * pairs — directions only. Banned in this file: "type", "you are a",
 * "most people", "of 100", "percent", "%", "score", "compatib".
 */
import type { AxisKey, Side } from './engine';

export interface AxisWords {
  /** The vocabulary label, never a verdict. */
  label: string;
  lo: string;
  hi: string;
}

export const AXES: Record<AxisKey, AxisWords> = {
  O: { label: 'Openness', lo: 'the familiar', hi: 'the unfamiliar' },
  C: { label: 'Conscientiousness', lo: 'going with the flow', hi: 'following through' },
  E: { label: 'Extraversion', lo: 'recharging alone', hi: 'recharging with people' },
  A: { label: 'Agreeableness', lo: 'saying the plain thing', hi: 'keeping the peace' },
  N: { label: 'Sensitivity', lo: 'a quiet alarm', hi: 'a loud alarm' },
  R: { label: 'Risk appetite', lo: 'protecting the downside', hi: 'chasing the uncertain' },
};

export function end(k: AxisKey, side: Side): string {
  return side > 0 ? AXES[k].hi : AXES[k].lo;
}

export const COPY = {
  title: 'What are you like, anyway?',
  dek: 'Ten everyday moments. About two minutes. You’ll see which way you lean — and you can send it to someone who thinks they know you.',
  start: 'Start',
  privacy: 'No account. Your answers live in the link — keep the link and you keep the result.',
  how: 'How this works',
  howBody: [
    'First you say where you think you’ll land. Then ten moments: put the four options in the order you’d actually do them, most likely first.',
    'The result is three views of you — what you said, what you picked, and what a friend guesses — and the gaps between them.',
    'It reads tendencies and directions from a handful of choices. It doesn’t put you in a box, and it doesn’t compare you with anyone you haven’t chosen to compare with. Adults only.',
  ],

  statedLabel: 'Before the moments',
  statedTitle: 'Where do you think you’ll land?',
  statedHint: 'One tap per line. Your gut, not your best self.',
  statedGo: 'On to the moments',
  statedSkip: 'Skip — I’d rather not guess',

  pickLabel: 'Most likely to least likely',
  rankHint: 'Tap them in the order you’d do them. Hold and drag to change it; tap a numbered one to take it out.',
  rankTop: 'Most likely',
  rankBottom: 'Least likely',
  rankAria: 'The options, in your order',
  rankDone: 'Next',
  youPutFirst: 'You put first',
  back: 'Back',

  resultLabel: 'Your portrait, so far',
  legendRevealed: 'what you ranked',
  legendStated: 'where you said',
  sharpen: 'Sharpen it — 10 more moments',
  momentsSoFar: (n: number) => `From ${n} moments. More moments, sharper picture.`,
  leanHeading: 'Which way your picks lean',
  gapHeading: 'Between what you said and what you picked',
  noGaps: 'Your picks landed close to where you said you would, on every line. That’s rarer than it sounds.',
  noStated: 'You skipped the “where will you land?” step, so there’s no gap to show — the gaps are the interesting part. Start again to add it.',
  matchedLine: (labels: string[]) => `Where your picks matched your guess: ${labels.join(', ')}.`,
  tryHeading: 'One small thing to try this week',
  tryIntro: 'Pick a direction you’d like to move in.',
  tryHow: 'Before you do it, guess how it’ll go. Afterwards, notice how it went. That’s the whole experiment.',
  keepHeading: 'Keep it',
  keepBody: 'This link is your save. Copy it somewhere you’ll find it.',
  copyLink: 'Copy my link',
  copied: 'Copied',
  guessHeading: 'Guess me',
  guessBody: 'Send a link to someone who thinks they know you. They rank five of your moments as they think you would — then do their own, and you can both see where you lean differently.',
  guessName: 'Your first name',
  guessSend: 'Send a Guess-me link',
  startOver: 'Start again',

  // the friend's side
  guessFrontTitle: (n: string) => `${n} did ten moments. Can you guess what ${n} would do?`,
  guessFrontDek: (n: string) => `Five moments. Put them in the order you think ${n} did. Then do your own and see where you two lean differently.`,
  guessStart: (n: string) => `Guess ${n}`,
  guessPick: (n: string) => `As ${n} would rank them`,
  guessRevealTitle: (n: string, hit: number, of: number) => `You read ${n} right on ${hit} of ${of}.`,
  guessRight: 'You called it',
  guessSurprise: 'A surprise',
  youThought: (n: string) => `You thought ${n} would put first`,
  theyPicked: (n: string) => `${n} put first`,
  wholeOrder: 'And the whole order, all the way down.',
  wholeOrderThem: 'The whole order, all the way down.',
  nowYours: 'Now do yours',

  // the pair view
  pairHeading: (n: string) => `You and ${n}`,
  pairLevel: 'close enough to call level',
  pairNote: 'Differences here are things to notice about each other, not a verdict on the two of you. A difference only shows when it’s bigger than the blur on both sides.',
  pairLine: (n: string, k: AxisKey, side: Side) =>
    side === 0 ? '' : `${n} leans further towards ${end(k, side)} than you`,
  othersHeading: (n: string) => `How ${n} guessed you`,
  othersRight: (n: string) => `${n} read you right`,
  othersLine: (n: string) => `${n} expected`,
  youWent: 'You',
  sendBack: (n: string) => `Send it back to ${n}`,
  sendBackBody: (n: string) => `${n} gets your guesses and the two of you side by side.`,
  yourName: 'Your first name',
  legendThem: (n: string) => `${n}`,

  // the painting
  paintAria: 'A painting after Mondrian, drawn from your answers',
  paintKey: 'How to read your painting',
  paintWhite: (labels: string[]) => `The white fields: nearer the middle — ${labels.join(', ')}.`,
  paintLines: (n: number) => `The black lines: drawn from ${n} moments. More moments, finer lines.`,
  paintCredit: 'after Piet Mondrian',
  paintPairYou: (n: number) => `You, from these ${n} moments`,
  paintPairThem: (n: string) => `As ${n} guessed you`,
  paintPairGuessed: (n: string) => `${n}, from these moments`,
  paintPairMine: (n: string) => `As you guessed ${n}`,
  paintPairNote: 'Same moments, two paintings. Where they part is where the guess read differently.',
};

/** One key line per coloured field, in the indication register. */
export function paintFieldLine(hue: string, area: number, k: AxisKey, side: Side): string {
  const size = area > 0.3 ? 'wide ' : area < 0.12 ? 'small ' : '';
  return `The ${size}${hue} field: a lean towards ${end(k, side)}`;
}

/** "You lean towards…" — one line per axis, self-scaled. */
export function leanLine(k: AxisKey, side: Side, strong: boolean): string {
  if (side === 0) return `Your picks sat around the middle, between ${AXES[k].lo} and ${AXES[k].hi}.`;
  return `You lean ${strong ? 'clearly ' : ''}towards ${end(k, side)}.`;
}

/** Stated vs revealed, as directions. */
export function gapLine(k: AxisKey, statedSide: Side, revealedSide: Side, delta: number): string {
  const towards = end(k, delta > 0 ? 1 : -1);
  if (statedSide === 0) return `You said you’d sit in the middle. Your picks leaned towards ${towards}.`;
  const said = end(k, statedSide);
  if (revealedSide === 0) return `You said you’d lean towards ${said}. Your picks sat nearer the middle.`;
  if (revealedSide !== statedSide) return `You said you’d lean towards ${said}. Your picks leaned towards ${end(k, revealedSide)}.`;
  return Math.sign(delta) === statedSide
    ? `You said you’d lean towards ${said}. Your picks leaned further that way than you guessed.`
    : `You said you’d lean towards ${said}. Your picks leaned that way, but less than you guessed.`;
}

/** One small behaviour per direction. Predict, do, compare. */
export const TRY: Record<AxisKey, { lo: string; hi: string }> = {
  O: {
    hi: 'Once this week, choose the option you’ve never tried — a dish, a route home, a podcast someone else loves.',
    lo: 'Once this week, go back to something you already half-know and go one level deeper, instead of starting something new.',
  },
  C: {
    hi: 'Pick one thing you’ve been putting off that takes under ten minutes, and finish it before lunch one day.',
    lo: 'Leave one evening unplanned on purpose, and decide what to do with it only when it arrives.',
  },
  E: {
    hi: 'Start one conversation you’d normally skip — the person beside you in a queue, the colleague you only nod to.',
    lo: 'Book thirty minutes on your own with no phone, and protect it the way you’d protect a meeting.',
  },
  A: {
    hi: 'Once this week, let someone else’s choice stand where you’d normally argue for yours, and notice what it costs you, if anything.',
    lo: 'Once this week, say the plain thing you’d normally soften — kindly, in one sentence.',
  },
  N: {
    hi: 'When something niggles this week, say it out loud to one person instead of shrugging it off.',
    lo: 'When a worry fires this week, write down what you expect to happen. Check a day later what did.',
  },
  R: {
    hi: 'Take one small risk with a real but tiny downside — ask for the discount, send the message, sign up for the thing.',
    lo: 'Before one decision this week, write down the worst realistic outcome and one thing that would guard against it.',
  },
};

export function tryLabel(k: AxisKey, side: Side): string {
  return `A little more towards ${end(k, side)}`;
}

/** Lower-case the first letter and drop closing punctuation, so an option reads inside a sentence. */
export function inline(t: string): string {
  const u = t.replace(/[.!?…\s]+$/, '');
  return u.charAt(0).toLowerCase() + u.slice(1);
}
