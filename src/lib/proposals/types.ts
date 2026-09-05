/**
 * Proposal microsite data model.
 *
 * A proposal is data, not markup: one file per client under src/lib/proposals/
 * describes everything the page says — the price, the sections, the optional
 * extra, the meeting slots. The route src/pages/proposals/[slug].astro renders
 * whatever it finds here. The one inherently per-client part is the design
 * mockups (they are made of the client's own content), so a proposal declares
 * a `mockups` section wherever it wants them and the route plugs in that
 * client's showcase component — see the component map in [slug].astro.
 */

export interface ProposalSlot {
  /** e.g. "Tuesday 8 September" */
  day: string;
  /** e.g. "7pm UK" */
  time: string;
}

export type ProposalSection =
  | {
      kind: 'prose';
      heading: string;
      paragraphs: string[];
    }
  | {
      kind: 'price';
      heading: string;
      /** e.g. "£3,000" */
      amount: string;
      /** e.g. "fixed — the whole thing, one price" */
      qualifier: string;
      /** What the price buys, one line each. */
      includes: string[];
      /** e.g. "£8,000–£12,000" — stated so the discount is visible. */
      marketRate: string;
      marketNote: string;
    }
  | {
      kind: 'facts';
      heading: string;
      intro?: string;
      items: { value: string; label: string }[];
      footnote?: string;
    }
  | {
      /** Placeholder for the per-client design showcase component. */
      kind: 'mockups';
      heading: string;
      intro: string[];
    }
  | {
      kind: 'optional';
      heading: string;
      paragraphs: string[];
      /** The explicit "removable, never a condition" line. */
      reassurance: string;
    }
  | {
      kind: 'slots';
      heading: string;
      intro: string;
      slots: ProposalSlot[];
      outro: string;
    };

export interface Proposal {
  slug: string;
  /** The person the proposal addresses, e.g. "Tania". */
  clientName: string;
  /** The project / site, e.g. "dreamtravelstudy.com". */
  projectName: string;
  /** Page <title> and hero heading. */
  title: string;
  /** e.g. "Tom Cassidy · September 2026" */
  byline: string;
  /** Opening paragraphs, before any section. */
  greeting: string[];
  sections: ProposalSection[];
  /** Closing paragraphs after the last section. */
  signoff: string[];
  signature: string;
}
