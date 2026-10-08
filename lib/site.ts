// Site-wide settings.
export const site = {
  name: "Onome Osika",
  role: "Senior Frontend Engineer & Creative Designer",
  location: "Dublin, Ireland",
  timeZone: "Europe/Dublin",
  description:
    "Senior frontend engineer with 5+ years building scalable web applications in React, Next.js and TypeScript. Also a creative designer.",
  // Home hero headline (positioning statement A from the content brief).
  positioning: "Senior frontend engineer building healthcare, community and AI products, with a designer’s eye.",
  // Production domain on Vercel (previews too, so canonicals point at production); localhost elsewhere.
  // NEXT_PUBLIC_SITE_URL overrides.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL ? "https://www.onomeosika.dev" : "http://localhost:3000"),
  // Public contact. Never publish the phone number.
  email: "meetonomeosika@gmail.com",
  // Used by inspect mode to link annotations to their source files.
  repo: "https://github.com/osikaonome/portfolio",
  social: {
    github: "https://github.com/osikaonome",
    linkedin: "https://www.linkedin.com/in/onomeosika/",
  },
} as const;

export const nav = [
  { href: "/", label: "Home", short: "Home" },
  { href: "/work", label: "Work", short: "Work" },
  { href: "/lab", label: "Lab", short: "Lab" },
  { href: "/writing", label: "Writing", short: "Writing" },
  { href: "/system", label: "System", short: "System" },
  { href: "/about", label: "About", short: "About" },
] as const;

/** Link to a file in the public repo. */
export function sourceUrl(path: string): string | null {
  return `${site.repo}/blob/master/${path}`;
}
