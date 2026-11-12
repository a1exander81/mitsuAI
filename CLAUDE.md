# LancerParts Interactive Catalog — Starter Guide (CLAUDE.md)

**Project Name**: LancerParts (or “4G15 Catalog”)  
**Vehicle**: Mitsubishi Lancer (China-market / CK2A chassis) with **4G15** 1.5L carbureted engine  
**Goal**: Interactive parts website — click a part on a diagram → see OEM number, image, description, and ready-to-use buy links (Shopee / Lazada / FB Marketplace). Filter by preferred location, price, and newest listings.  
**Inspired by**: Your Hiver project workflow (spec-first, structured feature tracking, Claude-driven iterative builds, clear acceptance criteria, early mobile testing).  
**Primary Tools**: Claude + Higgsfield MCP (images & UI visuals), GitHub, Vercel, Supabase.

---

## 1. Project Goal & MVP Scope

Build a clean, mobile-first interactive catalog where:

- You open a diagram (Oil Pan, Power Steering Oil Line, etc.).
- Click a hotspot → side panel or modal shows:
  - OEM part number (e.g. `MD030133`)
  - Description
  - Part image (Higgsfield-generated clean photo or real reference)
  - One-click buy links built from the part number or description
- Filter / sort results by:
  - Preferred area (Quezon City / NCR, Region 1, Baguio, etc.)
  - Price (low → high or high → low)
  - Newest listings first
- Works well on phone (you source parts on the go).

**MVP (start small, same as Hiver):**
- 1–2 diagrams (Oil Pan + Power Steering Oil Line)
- 15–30 key parts with real OEM numbers
- Click interaction + detail panel + dynamic buy links
- Basic filters
- Later expand to more diagrams and user-contributed listings

---

## 2. Quick Research Notes (Similar Tools)

| Tool | Strength | Limitation for Us |
|------|----------|-------------------|
| MegaZip.net | Excellent diagrams + OEM numbers for CK2A 1500 | Not interactive for end-users, no PH buy links |
| Nengun / Mitsubishi OEM sites | Genuine parts | Expensive, slow shipping, no local PH focus |
| Shopee / Lazada search | Real local prices & sellers | Manual searching, no diagram context |
| FB Marketplace | Local sellers, often cheaper used/new | Hard to filter systematically |

**Our advantage**: Combine MegaZip-style diagrams + one-click PH buy links + location preference.

---

## 3. SWOT (Hiver-style)

**Strengths**
- You already have researched part numbers (oil pan gasket, PS hoses, shocks).
- Strong Claude + Higgsfield workflow.
- Vercel + GitHub already connected.
- Clear personal need (your own Lancer upgrades).

**Weaknesses**
- Real-time Shopee/Lazada price + location data is hard without scraping (against ToS, fragile).
- Diagram hotspot mapping takes time.

**Opportunities**
- Useful for other PH Lancer / 4G15 owners.
- Can later add user-submitted listings or affiliate links.
- Expand to full engine, suspension, EFI conversion parts.

**Threats**
- Part number supersessions (old numbers replaced).
- Marketplace search result quality varies.

**Mitigation**: Start with dynamic search links (reliable). Add optional manual/user listings later.

---

## 4. Recommended Tech Stack

| Layer | Recommendation | Why it fits Claude + Higgsfield + Hiver flow |
|-------|----------------|-----------------------------------------------|
| **Frontend** | **Next.js 15** (App Router) + TypeScript + Tailwind CSS + shadcn/ui | Claude generates full pages/components very well. Vercel-native. Mobile-friendly. |
| **Interactive Diagrams** | `react-img-mapper` (or `reactjs-img-mapper`) | Overlay clickable zones on diagram images. Claude can generate the hotspot JSON. Next.js compatible. |
| **Data** | Supabase (Postgres) | Free tier, easy schema, image storage, later PostGIS for real location queries. Claude writes schema + queries easily. |
| **Auth / Location** | Browser Geolocation API + optional Supabase Auth | Simple. Store preferred city or lat/lng. |
| **Images & Visuals** | **Higgsfield MCP** via Claude | Clean part photos, annotated diagrams, UI mockups, short explainer videos. |
| **Buy Links** | Dynamic URL builders | Shopee: `https://shopee.ph/search?keyword=MD030133`<br>Lazada: similar<br>FB Marketplace / Google as fallback. |
| **Deployment** | Vercel | One-click from GitHub. You already have the connector. |
| **State** | Zustand or React context + `feature_list.json` | Mirror Hiver’s structured tracking. |

**Lighter alternative (even faster start)**: Next.js + local JSON/CSV for parts first → migrate to Supabase later.

**Other diagram options** (if you want more control later): Custom SVG overlays, or percentage-based absolute positioned hotspots (no library).

---

## 5. Data Model (Supabase)

```sql
parts (
  id uuid primary key default gen_random_uuid(),
  oem_number text unique not null,     -- MD030133
  description text,
  category text,                       -- 'oil-pan', 'steering', 'suspension'
  diagram_id text,
  hotspot_coords jsonb,                -- for react-img-mapper
  image_url text,
  notes text,                          -- e.g. “superseded by ...”
  created_at timestamptz default now()
);

-- Optional later: user or scraped listings
listings (
  id uuid primary key default gen_random_uuid(),
  part_id uuid references parts,
  source text,                         -- 'shopee', 'lazada', 'fb', 'manual'
  title text,
  price numeric,
  currency text default 'PHP',
  seller_location text,
  lat float,
  lng float,
  url text,
  listed_at timestamptz,
  is_active boolean default true
);
```

Start with a seed JSON of the parts you already know.

---

## 6. Interactive Diagram Approach

1. Screenshot or export clean diagram from MegaZip (CK2A 1500 → Engine → Cover, Rear Plate & Oil Pan).
2. Use Higgsfield to generate a clean, high-resolution annotated version if needed.
3. Define hotspots as percentage or coordinate arrays (Claude can help map them).
4. On click → open detail drawer/modal with part number + image + buy links.

**Library prompt example for Claude**:
> “Use react-img-mapper. Here is the diagram image URL and this JSON of areas. On click, open a sheet that shows the OEM number and generates Shopee/Lazada links.”

---

## 7. Filtering & Location Logic (Realistic)

- On first visit: ask for preferred city (Quezon City, Baguio, San Fernando La Union, etc.) or use browser location.
- Sort options:
  - Price low → high / high → low
  - Newest first
  - “Near me” preference (prioritize results that mention the city or Region when we have listing data)
- Primary buy path remains **dynamic search links** so it always works.
- Later phase: user-contributed listings with real lat/lng.

---

## 8. Higgsfield MCP Setup & Usage

**Connect once (Claude web or Desktop):**
1. Settings → Connectors → Add custom connector
2. Name: `Higgsfield`
3. URL: `https://mcp.higgsfield.ai/mcp`
4. Connect and sign in to your Higgsfield account

**Useful prompts for this project:**
- “Generate a clean studio product photo of a Mitsubishi oil pan gasket MD030133 on white background.”
- “Create a clean annotated diagram style image of a 4G15 oil pan with numbered callouts.”
- “Generate a modern mobile UI mockup of a parts catalog page: diagram on top, part detail sheet sliding up from bottom.”
- “Make a 6-second video showing a finger tapping a part on a diagram and the buy options appearing.”

Note: Generations use your Higgsfield credits. Attached chat images are not automatically passed — use Higgsfield’s upload if you need references.

---

## 9. Development Process (Hiver-style)

1. **This file = Project Spec / CLAUDE.md** (drop it into your Claude project).
2. Create `feature_list.json` for status tracking (`not_started` → `active` → `passing`).
3. Work in small batches:
   - Batch 1: Project scaffold + static diagram page + 5 seed parts
   - Batch 2: Click interaction + detail panel + buy link generators
   - Batch 3: Sort/filter UI (price, newest)
   - Batch 4: Preferred location selector
   - Batch 5: Supabase integration + seed data
   - Batch 6: More diagrams + Higgsfield-generated images
4. Structured Claude prompts:
   - “Follow the feature list. Implement only feature X. Show acceptance criteria and stop.”
   - “Write the Next.js component for the interactive oil pan diagram using react-img-mapper. Hotspot data is in this JSON…”
5. Visual review with Higgsfield-generated images.
6. Deploy early to Vercel and test on your phone.

**Sample feature_list.json**:
```json
{
  "features": [
    {
      "id": "feat-001",
      "name": "Interactive Oil Pan Diagram",
      "status": "not_started",
      "acceptance": "Clicking the oil pan area shows MD030133 + Shopee and Lazada search links"
    },
    {
      "id": "feat-002",
      "name": "Price & Newest Sort",
      "status": "not_started",
      "acceptance": "User can sort buy recommendations by price or date"
    }
  ]
}
```

---

## 10. Rough Cost Estimate (MVP)

| Item | Cost |
|------|------|
| Vercel + Supabase free tiers | ₱0 |
| Domain (optional) | ~₱500–800 / year |
| Higgsfield credits (images + a few videos) | Depends on your plan (start with free credits) |
| Time (Claude-driven) | A few focused evenings for MVP |
| Later: paid Shopee Affiliate or similar | Optional |

Very low financial risk.

---

## 11. Key Parts to Seed First

| Part | OEM Number | Category | Notes |
|------|------------|----------|-------|
| Oil pan gasket | MD030133 | Engine / Oil Pan | Confirmed |
| Oil pan drain plug gasket | MD050317 (or check diagram) | Engine | Common |
| Power steering pressure / return hoses | Pull from Steering → Power Steering Oil Line on MegaZip CK2A | Steering | Your previous research |
| KYB Excel-G rear shocks | Aftermarket (note OEM equivalent if known) | Suspension | You already checked fit |

Pull exact numbers from the correct **CK2A 1500** catalog on MegaZip.

---

## 12. Immediate Next Steps

1. Create a new GitHub repo (you already have GitHub connected).
2. Copy this file into the repo as `CLAUDE.md` or `PROJECT.md`.
3. Open Claude (with Higgsfield connector enabled) and paste the scaffolding prompt below.
4. Generate the first diagram image + 2–3 part photos via Higgsfield.
5. Deploy to Vercel and test on mobile.

**First Claude Prompt (copy-paste):**

```
Using the attached LANCER_PARTS_CATALOG_STARTER.md as the project spec (treat it as CLAUDE.md):

1. Scaffold a Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui project.
2. Create a sample interactive oil-pan diagram page using react-img-mapper.
3. Seed 5 parts (include MD030133 oil pan gasket) with OEM numbers, descriptions, and dynamic Shopee/Lazada buy link generators.
4. On click of a hotspot, show a side panel or sheet with the part number, description, image placeholder, and buy links.
5. Add basic sort controls (price low-high, newest).
6. Make it mobile-friendly.
7. Include a simple feature_list.json with the first 3 features marked not_started.

Show the folder structure and the key component code. Stop after the scaffold is complete so I can review.
```

---

**Ready to start?**  
Drop this file into your Claude project and begin with the prompt above. We can iterate on diagrams, more parts, and real location filtering next.

File path: `/workspace/artifacts/LANCER_PARTS_CATALOG_STARTER.md`
