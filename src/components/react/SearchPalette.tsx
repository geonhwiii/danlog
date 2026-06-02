import { useEffect, useState } from 'react';
import { Command } from 'cmdk';

type SearchEntry = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
};

type Props = {
  isOpen: boolean;
  close: () => void;
};

// Module-scope cache so the index is fetched at most once per page load,
// even if the palette is opened and closed repeatedly.
let cachedIndex: SearchEntry[] | null = null;
let indexPromise: Promise<SearchEntry[]> | null = null;

function loadIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  if (!indexPromise) {
    indexPromise = fetch('/search-index.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchEntry[]) => {
        cachedIndex = data;
        return data;
      })
      .catch(() => {
        indexPromise = null;
        return [];
      });
  }
  return indexPromise;
}

export default function SearchPalette({ isOpen, close }: Props) {
  const [entries, setEntries] = useState<SearchEntry[]>(cachedIndex ?? []);
  const [loading, setLoading] = useState(cachedIndex === null);

  useEffect(() => {
    let active = true;
    loadIndex().then((data) => {
      if (!active) return;
      setEntries(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  function go(id: string) {
    close();
    window.location.href = `/blog/${id}`;
  }

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) close();
      }}
      label="글 검색"
      className="search-palette"
      shouldFilter
      loop
    >
      <div className="search-palette__field">
        <SearchIcon />
        <Command.Input placeholder="글 검색…" className="search-palette__input" />
        <kbd className="code-type search-palette__esc">Esc</kbd>
      </div>

      <Command.List className="search-palette__list">
        {loading ? (
          <Command.Loading className="search-palette__status caption">불러오는 중…</Command.Loading>
        ) : (
          <Command.Empty className="search-palette__status caption">검색 결과가 없습니다.</Command.Empty>
        )}

        {entries.map((entry) => (
          <Command.Item
            key={entry.id}
            value={entry.title}
            keywords={entry.tags}
            onSelect={() => go(entry.id)}
            className="search-palette__item"
          >
            <span className="search-palette__item-title title-sm">{entry.title}</span>
            {entry.description && (
              <span className="search-palette__item-desc caption text-muted">{entry.description}</span>
            )}
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
