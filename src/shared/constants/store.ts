// Store-page content constants — the small things I've built.
// Cards render in the order listed here; the first item is treated as the
// "featured" pick and spans wider on large screens.

export type ProjectKind = 'game' | 'web' | 'app';

export interface Project {
  /** Short, slug-ish id — used as a stable React/Astro key. */
  id: string;
  title: string;
  description: string;
  /** What it is — drives the corner badge label. */
  kind: ProjectKind;
  /** Where the card links to. Opens in a new tab. */
  link: string;
  /**
   * Screenshot / thumbnail under `public/`, e.g. `/store/gitcha.png`.
   * Optional — when missing the card shows a typed-glyph placeholder instead.
   */
  image?: string;
  /** Tech stack tags shown along the bottom of the card. */
  tags?: string[];
  /** Optional release-ish line shown next to the badge (e.g. "2024"). */
  year?: string;
}

// Korean labels for the corner badge, keyed by kind.
export const projectKindLabels: Record<ProjectKind, string> = {
  game: '게임',
  web: '웹',
  app: '앱',
};

export const projects: Project[] = [
  {
    id: 'gitcha',
    title: 'Gitcha',
    description: 'Commit 기반 레벨링 시스템의 로그라이크 게임',
    kind: 'game',
    link: 'https://gitcha.vercel.app',
    image: 'https://i.imgur.com/R5WdqFP.png',
    tags: ['Phaser', 'Tanstack Start', 'Vite', 'Nitro'],
    year: '2026',
  },
];
