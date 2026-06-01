import { useEffect, useState } from "react";

export type NavItem = { label: string; href: string };

type Props = {
  items: NavItem[];
  currentPath: string;
};

function isActive(href: string, currentPath: string) {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(href + "/");
}

export default function MobileNav({ items, currentPath }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-md text-ink transition-colors hover:bg-surface-strong"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-hairline bg-canvas">
          <nav className="container-page flex flex-col py-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  "nav-link-type rounded-md px-3 py-3 transition-colors hover:bg-surface-strong " +
                  (isActive(item.href, currentPath) ? "text-ink" : "text-muted")
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
