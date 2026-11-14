"use client";

import { useGSAP } from "@gsap/react";
import { track } from "@vercel/analytics";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, SplitText);

const TAGS = ["Classic Lancer", "Interactive 3D", "DIY Focused"];

/**
 * Home-page hero. The background is an original, AI-generated image of an EVO-style
 * rally sedan (no badges or logos), stored in /public/hero.
 *
 * Animations (all GSAP, all reverted on unmount by useGSAP):
 * - staggered entrance: badge → headline (masked word reveal) → subtitle → CTA → tags
 * - slow Ken Burns zoom/drift on the background (transform only)
 * - hover lift on the CTA
 * Users who prefer reduced motion get the final state with no movement.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Background: slow, continuous zoom and drift.
        gsap.fromTo(
          "[data-hero-bg]",
          { scale: 1.08, xPercent: 0 },
          { scale: 1.16, xPercent: -2, duration: 24, ease: "sine.inOut", repeat: -1, yoyo: true },
        );

        // Entrance. autoSplit re-splits once Geist has loaded so line breaks stay correct.
        SplitText.create(headline.current, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit(self) {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from("[data-hero-badge]", { autoAlpha: 0, y: 12, duration: 0.5 })
              .from(self.words, { yPercent: 110, duration: 0.8, stagger: 0.06 }, "-=0.15")
              .from("[data-hero-sub]", { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.45")
              .from("[data-hero-cta]", { autoAlpha: 0, y: 16, duration: 0.5 }, "-=0.35")
              .from("[data-hero-tag]", { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.08 }, "-=0.25");
            return tl;
          },
        });
      });
    },
    { scope: root },
  );

  const onEnter = contextSafe((e: React.PointerEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: -2, scale: 1.03, duration: 0.25, ease: "power2.out" });
  });
  const onLeave = contextSafe((e: React.PointerEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
  });

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[85vh] w-full items-center overflow-hidden bg-neutral-950 text-white"
    >
      {/* Background image, slightly oversized so the Ken Burns zoom never shows an edge. */}
      <div data-hero-bg className="absolute inset-0 -z-20 scale-[1.08] will-change-transform">
        <Image
          src="/hero/evo-style.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_50%]"
        />
      </div>

      {/* Readability overlays: stronger on the left (text side) and at the bottom. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p
            data-hero-badge
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm"
          >
            Mitsubishi Parts Catalog
          </p>

          <h1
            ref={headline}
            id="hero-title"
            className="mt-5 font-sans text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Restore your Mitsubishi. Explore every part in 3D.
          </h1>

          <p data-hero-sub className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
            Interactive diagrams and OEM part numbers for DIY restorers — starting with the classic Lancer, with
            more Mitsubishi models to come.
          </p>

          <div data-hero-cta className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 bg-white px-5 text-base text-neutral-950 hover:bg-white/90"
              onPointerEnter={onEnter}
              onPointerLeave={onLeave}
            >
              <a href="#catalog" onClick={() => track("hero_browse_catalog")}>
                Browse Catalog
                <ArrowDown data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60" aria-label="Highlights">
            {TAGS.map((tag, i) => (
              <li key={tag} data-hero-tag className="flex items-center gap-4">
                {i > 0 && <span aria-hidden className="text-white/30">•</span>}
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
