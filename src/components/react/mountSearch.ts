import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import SearchProvider from './SearchProvider.tsx';
import { searchBus } from './searchBus.ts';

/**
 * Lazily mount the React search island on first use. React + overlay-kit + cmdk
 * stay out of the initial bundle entirely — they're only fetched the first time
 * the user invokes search (⌘K or a [data-search-open] click).
 *
 * The mount node is appended to <html> (not <body>) so it survives the body
 * swaps performed by Astro's view-transition ClientRouter.
 */
let root: Root | null = null;

export function openSearch() {
  if (root) {
    searchBus.open();
    return;
  }
  // Island not mounted yet — flag the open so it fires once React commits.
  searchBus.pendingOpen = true;
  const el = document.createElement('div');
  el.id = 'search-root';
  document.documentElement.appendChild(el);
  root = createRoot(el);
  root.render(createElement(SearchProvider));
}
