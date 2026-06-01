import { useEffect, useState } from "react";

/**
 * Search entry point. For now this is a stub that opens a placeholder
 * dialog; full search (index + results) lands in a later step.
 */
export default function SearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="검색"
        className="grid h-9 w-9 place-items-center rounded-md text-ink transition-colors hover:bg-surface-strong"
      >
        <SearchIcon />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="검색"
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 px-4 pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[560px] rounded-lg border border-hairline bg-surface-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 rounded-md border border-hairline-strong bg-canvas-soft px-4 py-3">
              <SearchIcon />
              <input
                autoFocus
                type="text"
                placeholder="글 검색…"
                className="w-full bg-transparent text-ink outline-none placeholder:text-muted-soft"
              />
            </div>
            <p className="caption mt-3 text-muted">
              검색 기능은 곧 추가됩니다. <kbd className="code-type">Esc</kbd> 로
              닫기
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
