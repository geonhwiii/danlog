import { useEffect, useRef } from 'react';
import { OverlayProvider, overlay } from 'overlay-kit';
import SearchPalette from './SearchPalette.tsx';

/**
 * Single mount point for the search palette. Owns the one OverlayProvider on
 * the page (multiple providers would duplicate the overlay) plus the global
 * triggers: the ⌘K / Ctrl+K shortcut and clicks on any `[data-search-open]`
 * element (header bar, hero bar, …). Triggers themselves are plain markup —
 * they don't need to be React islands.
 */
export default function SearchProvider() {
  return (
    <OverlayProvider>
      <SearchTriggers />
    </OverlayProvider>
  );
}

function SearchTriggers() {
  // Guard against stacking multiple palettes on repeated triggers.
  const openRef = useRef(false);

  useEffect(() => {
    function openPalette() {
      if (openRef.current) return;
      openRef.current = true;
      overlay.open(
        ({ isOpen, close, unmount }) => (
          <SearchPalette
            isOpen={isOpen}
            close={() => {
              close();
              openRef.current = false;
              setTimeout(unmount, 200);
            }}
          />
        ),
        { overlayId: 'search-palette' },
      );
    }

    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
      }
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-search-open]')) openPalette();
    }

    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
