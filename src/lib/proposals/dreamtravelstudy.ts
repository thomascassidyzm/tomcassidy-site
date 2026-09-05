import type { Proposal } from './types';

/**
 * The proposal for Tania — rebuilding dreamtravelstudy.com.
 *
 * The words follow Tom's approved WhatsApp draft of 5 September 2026; the
 * numbers come from the measured scope of the same date (1,206 pages, 317
 * English schools, 999 images, five languages via Polylang).
 *
 * Tom's to change in one edit: the price (below), the school-photo promise
 * (in "The photographs"), and the Zoom slots (bottom of this file).
 */
export const dreamtravelstudy: Proposal = {
  slug: 'dreamtravelstudy',
  clientName: 'Tania',
  projectName: 'dreamtravelstudy.com',
  title: 'A proposal for Dream Travel Study',
  byline: 'From Tom Cassidy · September 2026',
  greeting: [
    'Hi Tania,',
    'First, an apology for the silence — you wrote nearly three weeks ago and I left you waiting. No excuse, and sorry.',
    'I have been through the site properly since, page by page, and this is the whole proposal — the price, what it covers, and what your site could look like afterwards. It reads best on your phone, top to bottom, in about five minutes.',
  ],
  sections: [
    {
      kind: 'price',
      heading: 'The price',
      amount: '£3,000',
      qualifier: 'fixed, for the whole thing',
      includes: [
        'Every one of the 999 images replaced, with a list showing where each licence came from',
        'The whole site rebuilt — all 1,200-odd pages, all five languages, all 317 schools',
        'Everything handed over in your name: hosting, source, forms, the lot',
        'One price. Not split into two jobs — the pictures and the rebuild together, everything in it',
      ],
      marketRate: '£8,000–£12,000',
      marketNote:
        'For honesty: a developer quoting this job properly would charge £8,000–£12,000. I am charging less because your directory is good, the work suits how I build things, and I would like the education conversation that comes with it.',
    },
    {
      kind: 'prose',
      heading: 'The photographs — and why I would replace all of them',
      paragraphs: [
        'You asked me to go through the images, pick out the risky ones, and replace those. I would rather not do it that way, and here is why.',
        'Where a picture came from usually is not recorded in the picture itself. So anyone who says "these ones are fine" is really just guessing — and if they guess wrong, it is you who gets the letter.',
        'So I would replace all of them, with pictures we can actually show permission for, and hand you a list of every single image and where its licence came from. For the individual schools I would ask the schools themselves for their own photos — they want to be in your directory, so they are usually glad to send them.',
        'That way you are never left holding a judgement call about a photo somebody else chose. The copyright question is not managed — it is gone.',
      ],
    },
    {
      kind: 'prose',
      heading: 'The site itself',
      paragraphs: [
        'What you would end up with is your site as plain files, sitting on hosting in your own name, with the original kept in your own account and the enquiry forms going to a service you pay for directly — a few pounds a month at your volume.',
        'The difference is that there is no login for anyone to break into, nothing that needs updating every few months, and nothing of mine left running inside it. It also gets faster for your visitors, because plain files are the fastest thing a website can be.',
        'You could sack me the day after I hand it over and absolutely nothing would break. That is the actual point of doing it this way — you have had quite enough of depending on people, and this is the version where you do not have to depend on me either.',
      ],
    },
    {
      kind: 'facts',
      heading: 'What carries across',
      intro: 'I counted everything from the site itself, so these are real numbers, not estimates:',
      items: [
        { value: '1,206', label: 'published pages, all carried across' },
        { value: '5', label: 'languages — English, Русский, Español, Română, Українська' },
        { value: '317', label: 'schools in the English directory' },
        { value: '999', label: 'images, every one replaced and licensed' },
      ],
      footnote:
        'Two small things you should know, because you are better off knowing them. First: the translations have drifted over time — English has all 317 schools, but the other languages have between 138 and 181. Nothing is lost in the move; I carry across exactly what is there, and topping the others up can be a later job if you want it. Second: the software your current site runs on (PHP 7.4) stopped receiving security fixes in 2022. That is not a crisis, but it is a good reason the new site has nothing that needs patching at all.',
    },
    {
      kind: 'mockups',
      heading: 'What it could look like',
      intro: [
        'Rather than describe a design, I would rather show you three. Each one below is built from your real directory — your actual schools, your actual photographs, loaded live from your site as it is today.',
        'They are three genuinely different ideas of what Dream Travel Study is, not one design in three colours. Scroll through each, on your phone, and see which one feels like you.',
      ],
    },
    {
      kind: 'optional',
      heading: 'One optional extra — take it or leave it',
      paragraphs: [
        'I run a maths and science tutoring business. If you liked, I could put a small sign-up box on the site so families who find you can also find us. It is a nice little thing for both businesses.',
      ],
      reassurance:
        'Free either way, not part of the price, and you can delete it at any time without touching anything else. Genuinely no problem if you would rather not — the price and the work are exactly the same without it.',
    },
    {
      kind: 'slots',
      heading: 'And yes to the Zoom',
      intro:
        'I would still love that conversation about the education side — you asked about a Thursday or Friday and I let those sail past, so let me offer fresh ones:',
      slots: [
        { day: 'Tuesday 8 September', time: '7pm UK' },
        { day: 'Thursday 10 September', time: '7pm UK' },
      ],
      outro: 'Either works for me, and if neither suits, just throw some times at me.',
    },
  ],
  signoff: [
    'If you are happy with this, say the word and I will start with the rebuild so you can see your site live again quickly, with the image replacement running alongside.',
    'And whichever design you liked — just tell me its name.',
  ],
  signature: 'Tom',
};
