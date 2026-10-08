import { NavLink } from "./nav-link";
import { SearchButton } from "./search-button";

const items = [
  { href: "/", label: "Home", icon: "M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4z" },
  { href: "/work", label: "Work", icon: "M4 7h16v12H4zM9 7V5h6v2" },
  { href: "/lab", label: "Lab", icon: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" },
  { href: "/about", label: "About", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" },
];

/** Mobile navigation, kept within thumb reach. Hidden from md up. */
export function BottomNav() {
  return (
    <nav
      data-bottom-nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="flex h-(--bottom-nav-height) items-stretch px-[env(safe-area-inset-left)]">
        {items.map((item) => (
          <li key={item.href} className="flex flex-1">
            <NavLink
              href={item.href}
              className="tap flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.7rem] text-muted data-active:text-fg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
                <path d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          </li>
        ))}
        <li className="flex flex-1">
          <SearchButton variant="bottom" />
        </li>
      </ul>
    </nav>
  );
}
