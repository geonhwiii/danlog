import { useEffect, useRef } from 'react';
import { OverlayProvider, overlay } from 'overlay-kit';
import SearchPalette from './SearchPalette.tsx';
import { searchBus } from './searchBus.ts';

export default function SearchProvider() {
  return (
    <OverlayProvider>
      <SearchController />
    </OverlayProvider>
  );
}

function SearchController() {
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

    searchBus.open = openPalette;
    if (searchBus.pendingOpen) {
      searchBus.pendingOpen = false;
      openPalette();
    }

    return () => {
      searchBus.open = () => {};
    };
  }, []);

  return null;
}
