import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";

// Confirmation pages for the no-JavaScript contact form post.
export const dynamicParams = false;
export const metadata: Metadata = { title: "Contact", robots: { index: false } };

export function generateStaticParams() {
  return [{ status: "sent" }, { status: "failed" }];
}

export default async function ContactStatus({ params }: PageProps<"/contact/[status]">) {
  const { status } = await params;
  if (status !== "sent" && status !== "failed") notFound();
  return (
    <div className="container-page pt-stack-2xl">
      <h1 className="font-display text-step-5">{status === "sent" ? "Message sent" : "That didn’t send"}</h1>
      <p className="mt-stack-s text-step-1 text-muted">
        {status === "sent" ? (
          "Thanks, I’ll reply by email."
        ) : (
          <>
            Please email me directly at{" "}
            <a className="text-accent underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </>
        )}
      </p>
      <Link href="/" className="tap mt-stack-m inline-flex items-center text-accent underline">
        Back to the home page
      </Link>
    </div>
  );
}
