/**
 * Tiny bridge between the vanilla page bootstrap (which owns the ⌘K / click
 * triggers) and the lazily-mounted React search island. Lets the palette be
 * opened before React has attached its own handlers: if a trigger fires while
 * the island is still mounting, `pendingOpen` is honored once it commits.
 */
type SearchBus = {
  pendingOpen: boolean;
  open: () => void;
};

export const searchBus: SearchBus = {
  pendingOpen: false,
  open: () => {},
};
