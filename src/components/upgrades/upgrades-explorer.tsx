"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ExternalLink, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UPGRADE_CATEGORIES,
  UPGRADE_KITS,
  UPGRADE_MODELS,
  upgradeQuery,
  type UpgradeCategory,
  type UpgradeModel,
} from "@/data/upgrades";
import { searchLinks } from "@/lib/search-links";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

// The shared Tabs styles assume a light page; on this dark page force readable colours.
const TAB_CLASS =
  "flex-none px-3 text-white/70! hover:text-white! data-active:bg-white! data-active:text-neutral-950! data-active:hover:text-neutral-950!";

const EVOS = UPGRADE_MODELS.filter((m) => m.isEvo);
const LANCERS = UPGRADE_MODELS.filter((m) => !m.isEvo);
const categoryLabel = (id: UpgradeCategory) =>
  UPGRADE_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function UpgradesExplorer() {
  const root = useRef<HTMLDivElement>(null);
  const [modelId, setModelId] = useState(UPGRADE_MODELS[2].id);
  const [category, setCategory] = useState<UpgradeCategory | "all">("all");

  const model =
    UPGRADE_MODELS.find((m) => m.id === modelId) ?? UPGRADE_MODELS[0];
  const kits = useMemo(
    () =>
      UPGRADE_KITS.filter(
        (k) =>
          k.models.includes(model.id) &&
          (category === "all" || k.category === category),
      ),
    [model.id, category],
  );
  const query = upgradeQuery(model, category);
  const links = searchLinks(query);

  // Page load: EVO cards rise in; selected EVO image gets a slow Ken Burns drift.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-model-card]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
        });
        gsap.fromTo(
          "[data-kenburns]",
          { scale: 1.05 },
          {
            scale: 1.14,
            xPercent: -2,
            duration: 20,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      });
    },
    { scope: root },
  );

  // Every model/category change: stagger the results in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-result]", {
          autoAlpha: 0,
          y: 16,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
        });
      });
    },
    { scope: root, dependencies: [model.id, category], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="flex flex-col gap-10">
      {/* EVO model cards: larger, image-led treatment. */}
      <section aria-labelledby="evo-heading">
        <h2 id="evo-heading" className="mb-4 text-lg font-semibold text-white">
          Lancer Evolution
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {EVOS.map((m) => (
            <EvoCard
              key={m.id}
              model={m}
              selected={m.id === model.id}
              onSelect={() => setModelId(m.id)}
            />
          ))}
        </div>
      </section>

      {/* Other models: compact chips plus a full dropdown. */}
      <section aria-labelledby="lancer-heading" className="flex flex-col gap-3">
        <h2 id="lancer-heading" className="text-lg font-semibold text-white">
          Lancer
        </h2>
        <div className="flex flex-wrap gap-2">
          {LANCERS.map((m) => (
            <button
              key={m.id}
              type="button"
              data-model-card
              aria-pressed={m.id === model.id}
              onClick={() => setModelId(m.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                m.id === model.id
                  ? "border-white bg-white text-neutral-950"
                  : "border-white/15 bg-white/5 text-white hover:bg-white/10",
              )}
            >
              <span className="block font-medium">{m.name}</span>
              <span className="block text-xs opacity-70">
                {m.chassis} · {m.years}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section
        aria-label="Filters"
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <label className="flex flex-col gap-1.5 text-sm text-white/70">
          Model
          <Select value={model.id} onValueChange={setModelId}>
            <SelectTrigger className="w-full border-white/15 bg-white/5 text-white sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Lancer Evolution</SelectLabel>
                {EVOS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.chassis})
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Lancer</SelectLabel>
                {LANCERS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.chassis})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>

        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as UpgradeCategory | "all")}
          className="min-w-0"
        >
          <TabsList className="h-auto flex-wrap justify-start bg-white/5">
            <TabsTrigger className={TAB_CLASS} value="all">
              All
            </TabsTrigger>
            {UPGRADE_CATEGORIES.map((c) => (
              <TabsTrigger key={c.id} className={TAB_CLASS} value={c.id}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Results */}
      <section
        aria-live="polite"
        aria-labelledby="results-heading"
        className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <div>
          <h2
            id="results-heading"
            className="mb-3 text-lg font-semibold text-white"
          >
            {category === "all" ? "Popular upgrades" : categoryLabel(category)}{" "}
            for {model.name}{" "}
            <span className="text-sm font-normal text-white/60">
              ({kits.length})
            </span>
          </h2>
          {kits.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {kits.map((k) => (
                <Card
                  key={k.id}
                  data-result
                  className="border-white/10 bg-white/5 text-white"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">
                        {categoryLabel(k.category)}
                      </Badge>
                      <span className="text-xs text-white/60">{k.brand}</span>
                    </div>
                    <CardTitle className="mt-2 text-base">{k.name}</CardTitle>
                    <CardDescription className="text-white/70">
                      {k.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-2">
                    {k.powerGain && (
                      <Badge variant="outline">{k.powerGain}</Badge>
                    )}
                    {k.priceRange && (
                      <Badge variant="outline">{k.priceRange}</Badge>
                    )}
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="ml-auto"
                    >
                      <a
                        href={k.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Look it up <ExternalLink />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p
              data-result
              className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-white/60"
            >
              No curated kits for this combination yet — use the searches on the
              right.
            </p>
          )}
          <p className="mt-3 text-xs text-white/50">
            Curated list of well-known product lines. Always confirm fitment for
            your exact chassis and year with the seller.
          </p>
        </div>

        <aside
          data-result
          className="h-fit rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Search className="size-4" /> Search the internet
          </h3>
          <p className="mt-1 text-xs text-white/60">Searches for “{query}”.</p>
          <div className="mt-3 flex flex-col gap-2">
            {links.map((l) => (
              <Button
                key={l.id}
                asChild
                variant="outline"
                className="h-11 justify-between border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  Search {l.label}
                  <ExternalLink />
                </a>
              </Button>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function EvoCard({
  model,
  selected,
  onSelect,
}: {
  model: UpgradeModel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-model-card
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group relative isolate flex min-h-44 overflow-hidden rounded-xl border text-left transition-colors sm:min-h-52",
        selected
          ? "border-white ring-2 ring-white/60"
          : "border-white/10 hover:border-white/40",
      )}
    >
      {model.image && (
        <div
          data-kenburns={selected ? "" : undefined}
          className="absolute inset-0 -z-20"
        >
          <Image
            src={model.image}
            loading="eager"
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover object-[70%_50%]"
          />
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/50 to-transparent"
      />
      <div className="mt-auto p-4">
        <Badge className="bg-red-600 text-white">EVO</Badge>
        <p className="mt-2 text-xl font-semibold text-white">{model.name}</p>
        <p className="text-sm text-white/70">
          {model.chassis} · {model.years} · {model.engine}
        </p>
      </div>
    </button>
  );
}
