import Link from "next/link";
import { ExtLink } from "@/components/ui/ext-link";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer data-site-footer className="container-page mt-section border-t border-border py-stack-xl text-step--1 text-muted">
      <div className="flex flex-col gap-stack-m md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="text-fg">{site.name}</p>
          <p>{site.role}</p>
          <p>{site.location}</p>
        </div>
        <ul className="grid grid-cols-2 gap-x-stack-l sm:grid-cols-3">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="tap inline-flex items-center hover:text-fg">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-1">
          <li>
            <a className="tap inline-flex items-center hover:text-fg" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </li>
          <li>
            <ExtLink className="tap inline-flex items-center hover:text-fg" href={site.social.github}>
              GitHub
            </ExtLink>
          </li>
          <li>
            <ExtLink className="tap inline-flex items-center hover:text-fg" href={site.social.linkedin}>
              LinkedIn
            </ExtLink>
          </li>
        </ul>
      </div>
      <p className="mt-stack-l">
        Press <kbd className="font-mono">I</kbd> to see how this page is built.{" "}
        <ExtLink className="underline hover:text-fg" href={site.repo}>
          Source on GitHub
        </ExtLink>
      </p>
    </footer>
  );
}
