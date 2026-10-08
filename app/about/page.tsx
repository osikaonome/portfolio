import type { Metadata } from "next";
import { PrintButton } from "@/components/layout/print-button";
import { cv } from "@/lib/cv";
import { JsonLd, personJsonLd } from "@/lib/json-ld";
import { ExtLink } from "@/components/ui/ext-link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}: experience, skills and contact. Prints as a CV.`,
  alternates: { canonical: "/about" },
};

/** Doubles as the CV: the print stylesheet in globals.css strips the chrome. */
export default function AboutPage() {
  return (
    <div className="container-page pt-stack-l md:pt-stack-2xl">
      <JsonLd data={personJsonLd()} />
      <header className="flex flex-wrap items-end justify-between gap-stack-m border-b border-border pb-stack-l">
        <div>
          <h1 className="font-display text-step-5">{site.name}</h1>
          <p className="mt-1 text-step-1 text-muted">
            {site.role} · {site.location}
          </p>
          <ul className="mt-stack-xs flex flex-wrap gap-x-stack-m text-step--1">
            <li>
              <a className="print-url underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <ExtLink className="print-url underline" href={site.social.github}>
                GitHub
              </ExtLink>
            </li>
            <li>
              <ExtLink className="print-url underline" href={site.social.linkedin}>
                LinkedIn
              </ExtLink>
            </li>
          </ul>
        </div>
        <PrintButton />
      </header>

      <div className="mt-stack-xl grid gap-stack-2xl lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-stack-2xl">
          <section aria-labelledby="profile">
            <h2 id="profile" className="eyebrow">
              Profile
            </h2>
            <p className="mt-stack-xs max-w-[60ch] text-step-1">{cv.summary}</p>
          </section>

          <section aria-labelledby="experience">
            <h2 id="experience" className="eyebrow">
              Experience
            </h2>
            <ol className="mt-stack-s space-y-stack-l">
              {cv.experience.map((job) => (
                <li key={`${job.org}-${job.period}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-stack-s">
                    <h3 className="font-semibold">
                      {job.role}, {job.org}
                    </h3>
                    <p className="font-mono text-step--1 text-muted">
                      {job.period} · {job.location}
                    </p>
                  </div>
                  <ul className="mt-stack-2xs list-disc space-y-1 pl-5 text-muted">
                    {job.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-stack-xl">
          {Object.entries(cv.skills).map(([group, items]) => (
            <section key={group} aria-labelledby={`skills-${group}`}>
              <h2 id={`skills-${group}`} className="eyebrow">
                {group}
              </h2>
              <ul className="mt-stack-xs space-y-1">
                {items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          ))}
          <section aria-labelledby="education">
            <h2 id="education" className="eyebrow">
              Education
            </h2>
            <ul className="mt-stack-xs space-y-1">
              {cv.education.map((e) => (
                <li key={e.title}>
                  {e.title}, {e.org} <span className="text-muted">({e.period})</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
