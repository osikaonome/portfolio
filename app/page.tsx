import Link from "next/link";
import { GenerativeHero } from "@/components/hero/generative-hero";
import { Inspectable } from "@/components/inspect/inspectable";
import { ProjectCard } from "@/components/work/project-card";
import { getProjectCards } from "@/lib/cards";
import { getFeaturedProjects } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd, personJsonLd } from "@/lib/json-ld";
import { ContactForm } from "@/components/layout/contact-form";

export default async function Home() {
  const featured = await getProjectCards(getFeaturedProjects());

  return (
    <>
      <JsonLd data={personJsonLd()} />

      <section className="container-page pt-stack-l md:pt-stack-2xl" aria-labelledby="intro">
        <div className="grid gap-stack-l md:grid-cols-[1.2fr_1fr] md:items-end">
          <Inspectable id="hero-copy">
            <p className="eyebrow">{site.location}</p>
            <h1 id="intro" className="mt-stack-xs max-w-[22ch] font-display text-step-4 leading-[1.08] md:text-step-5">
              {site.positioning}
            </h1>
            <p className="mt-stack-s text-step-1 text-muted">{site.name}</p>
            <div className="mt-stack-m flex flex-wrap gap-2">
              <Link href="/work" className="tap inline-flex items-center rounded-full bg-fg px-5 text-bg transition-opacity hover:opacity-85">
                See the work
              </Link>
              <a href={`mailto:${site.email}`} className="tap inline-flex items-center rounded-full border border-border px-5 transition-colors hover:border-fg">
                Email me
              </a>
            </div>
          </Inspectable>
          <Inspectable id="generative-hero" className="h-40 md:h-80">
            <GenerativeHero />
          </Inspectable>
        </div>
      </section>

      <section className="container-page mt-section" aria-labelledby="featured">
        <div className="flex items-baseline justify-between gap-stack-s">
          <h2 id="featured" className="font-display text-step-3">
            Selected work
          </h2>
          <Link href="/work" className="tap inline-flex items-center text-step--1 text-muted hover:text-fg">
            All projects →
          </Link>
        </div>
        <ul className="mt-stack-l grid gap-x-stack-l gap-y-stack-2xl md:grid-cols-2">
          {featured.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard project={p} priority={i === 0} />
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-section" aria-labelledby="contact">
        <div className="rounded-panel bg-surface p-stack-xl">
          <h2 id="contact" className="font-display text-step-4">
            Get in touch
          </h2>
          <p className="mt-stack-xs text-muted">
            Send a message below, or email{" "}
            <a href={`mailto:${site.email}`} className="text-accent underline">
              {site.email}
            </a>
            .
          </p>
          <div className="mt-stack-l">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
