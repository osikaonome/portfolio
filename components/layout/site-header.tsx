import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Inspectable } from "@/components/inspect/inspectable";
import { NavLink } from "./nav-link";
import { SearchButton } from "./search-button";
import { ThemeToggle } from "./theme";

export function SiteHeader() {
  return (
    <header data-site-header className="container-page pt-[env(safe-area-inset-top)]">
      <Inspectable id="site-header" className="flex min-h-16 items-center justify-between gap-stack-m">
        <Link href="/" className="tap inline-flex items-center font-display text-step-1 leading-none">
          {site.name}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="tap inline-flex items-center rounded-full px-3 text-step--1 text-muted transition-colors hover:text-fg data-active:text-fg data-active:underline data-active:decoration-accent data-active:underline-offset-8"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <SearchButton variant="header" />
          </div>
          <ThemeToggle />
        </div>
      </Inspectable>
    </header>
  );
}
