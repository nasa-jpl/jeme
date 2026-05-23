# Recent Updates Report

**Date:** April 3, 2026
**Platform:** JPL Earth System Models and Missions Dashboard (JEME/JEOE)

---

## 1. Peer-Review Verification and Removal

A three-tier verification pipeline (`scripts/verify_peer_review.py`) was implemented to identify and remove non-peer-reviewed papers from the citation dataset.

### Methodology

| Tier | Method | Coverage |
|------|--------|----------|
| Tier 1 | Deterministic venue/title pattern matching (blocklist + whitelist) | 95% of decisions |
| Tier 2 | Crossref DOI type lookup (`journal-article`, `posted-content`, `dissertation`, etc.) | 4% of decisions |
| Tier 3 | Gemini LLM fallback for ambiguous cases | <1% (not needed) |

### Results

**1,278 non-peer-reviewed papers removed** (28,019 → 26,741 papers, 4.6% reduction)

Note: The "Before" counts below reflect the dataset at the start of this update cycle, after prior multi-agent data verification had already been applied. For example, ECCO's original citation dataset contained ~31,452 papers, which was reduced to ~16,869 through earlier verification stages (removal of EGM2008 geodesy contamination, off-topic citing papers, island biogeography, PFAS chemistry, broken metadata entries, and junk/spam). Similarly, ISSM was reduced from ~5,950 to ~3,698 after repairing 1,904 broken team paper titles and removing off-topic entries. All other models had smaller reductions (80 total) from book chapters, editorial content, and errata. See Section 4.2 of the journal paper draft for full verification details.

| Model | Before | After | Removed | % |
|-------|--------|-------|---------|---|
| CARDAMOM | 531 | 514 | 17 | 3.2% |
| CMS-Flux | 684 | 646 | 38 | 5.6% |
| ECCO | 16,869 | 16,327 | 542 | 3.2% |
| EDMF | 837 | 810 | 27 | 3.2% |
| GRACE | 3,452 | 3,091 | 361 | 10.5% |
| ISSM | 3,698 | 3,495 | 203 | 5.5% |
| LES | 174 | 168 | 6 | 3.4% |
| MOMO-CHEM | 1,042 | 983 | 59 | 5.7% |
| RAPID | 359 | 336 | 23 | 6.4% |
| SWOT | 373 | 371 | 2 | 0.5% |
| **Total** | **28,019** | **26,741** | **1,278** | **4.6%** |

### Removal Breakdown by Type

| Category | Count | Examples |
|----------|-------|---------|
| Copernicus "(Discussions)" preprints | 526 | The Cryosphere (Discussions), Biogeosciences (Discussions) |
| Conference proceedings | 185 | AIP Conference Proceedings, SGEM Proceedings |
| AGU/EGU meeting abstracts | 114 | AGU Fall Meeting, EGU General Assembly |
| Preprints (via Crossref) | 72 | arXiv, ESSoAr, EarthArXiv |
| No venue + no DOI | 61 | Papers with insufficient metadata |
| Conference presentations | 56 | "presented at", "paper presented at" |
| Book chapters (via Crossref) | 46 | Crossref type: book-chapter |
| Dissertations/theses | 44 | PhD/MS theses, Crossref type: dissertation |
| Monographs/encyclopedias/handbooks | 43 | Geophysical Monograph Series, Encyclopedia of Ocean Sciences |
| Reports (via Crossref) | 20 | Technical reports |
| EGUsphere preprints | 20 | EGUsphere |
| Other | 91 | SEG expanded abstracts, posters |

Full removal log: `scripts/removed_non_peer_reviewed.json`

---

## 2. Uncertainty Quantification Pipeline

The three-phase UQ pipeline was completed across all 26,741 papers.

### Phase 1: Deterministic Scoring

- **26,741 / 26,741 entries scored** (100%)
- Composite confidence computed from:
  - Evidence confidence: metadata completeness (abstract 35%, DOI 15%, venue 15%, authors 10%, keyword match 25%)
  - Reasoning confidence: 0.85 with abstract, 0.50 without
  - Pipeline variance: keyword classifier vs LLM label disagreement
- Formula (without Phase 2): `C = 0.45 * Evidence + 0.45 * Reasoning - 0.10 * Variance`
- Formula (with Phase 2): `C = 0.35 * Evidence + 0.35 * Reasoning + 0.20 * (1 - Stochastic_Variance) - 0.10 * Variance`

### Phase 2: Multi-Temperature LLM Sampling

- **26,740 / 26,741 entries processed** (>99.99%)
- 3 Gemini 2.5 Flash calls per entry at temperatures {0.1, 0.5, 1.0}
- ~80,220 total API calls
- Metrics computed:
  - **Stochastic variance:** fraction of runs disagreeing with majority label (0.0–0.67)
  - **Reasoning confidence:** average of Gemini's self-assessed confidence (1–5 scale), normalized to 0–1
- Cache: 26,807 entries (`scripts/phase2_cache.json`)

| Model | Entries | Phase 2 Complete |
|-------|---------|-----------------|
| CARDAMOM | 514 | 514 |
| CMS-Flux | 646 | 646 |
| ECCO | 16,327 | 16,326 |
| EDMF | 810 | 810 |
| GRACE | 3,091 | 3,091 |
| ISSM | 3,495 | 3,495 |
| LES | 168 | 168 |
| MOMO-CHEM | 983 | 983 |
| RAPID | 336 | 336 |
| SWOT | 371 | 371 |

### Phase 3: Skeptic Agent Review

- **2,968 high-risk entries reviewed** out of 26,741 total (11.1%)
- **2,758 override flags set** (93% of reviewed entries)
- Flagging criteria (any one triggers review):
  - `miscalibration_risk == "high"`
  - `stochastic_variance > 0.3`
  - Engagement Level 2–3 with `composite_confidence < 0.5`
- Override flag set when skeptic agreement score ≤ 2/5

| Model | Entries | Reviewed | Overrides | Override Rate |
|-------|---------|----------|-----------|---------------|
| CARDAMOM | 514 | 31 | 30 | 96.8% |
| CMS-Flux | 646 | 69 | 68 | 98.6% |
| ECCO | 16,327 | 1,959 | 1,821 | 92.9% |
| EDMF | 810 | 117 | 103 | 88.0% |
| GRACE | 3,091 | 196 | 175 | 89.3% |
| ISSM | 3,495 | 404 | 381 | 94.3% |
| LES | 168 | 22 | 21 | 95.5% |
| MOMO-CHEM | 983 | 109 | 103 | 94.5% |
| RAPID | 336 | 20 | 18 | 90.0% |
| SWOT | 371 | 41 | 38 | 92.7% |
| **Total** | **26,741** | **2,968** | **2,758** | **92.9%** |

Note: The high override rate is expected because Phase 3 specifically targets entries already flagged as high-risk by Phase 1/2. These entries had high stochastic variance or miscalibration risk, meaning the skeptic agent's disagreement confirms the classification uncertainty.

### Pipeline Execution Order

1. Phase 1 — Deterministic scoring (initial)
2. Phase 2 — Multi-temperature LLM sampling (all models)
3. Phase 1 — Recompute (incorporating Phase 2 stochastic variance)
4. Peer-review verification and removal (1,278 papers removed)
5. Phase 1 — Recompute (after removal)
6. Phase 3 — Skeptic agent review (high-risk entries)
7. Phase 1 — Final recompute (incorporating Phase 3 data)

---

## 3. Engagement Level Classification

### Current System (3-Tier for Models, 2-Tier for Missions)

**Models (CARDAMOM, CMS-Flux, ECCO, EDMF, ISSM, LES, MOMO-CHEM, RAPID):**

| Level | Label | Definition |
|-------|-------|-----------|
| Level 1 | Data Usage | Uses data or outputs from the model |
| Level 2 | Model Adaptation | Modifies, extends, or couples the model |
| Level 3 | Foundational Method | Builds directly on the model as a core method |

**Missions (GRACE, SWOT):**

| Label | Definition |
|-------|-----------|
| Data Usage | Uses mission data or products |
| Review Paper | Reviews or surveys the mission |

### Distribution

| Model | L1: Data Usage | L2: Adaptation | L3: Foundational | Total |
|-------|---------------|----------------|-------------------|-------|
| CARDAMOM | 229 (44.6%) | 138 (26.8%) | 147 (28.6%) | 514 |
| CMS-Flux | 302 (46.7%) | 149 (23.1%) | 195 (30.2%) | 646 |
| ECCO | 7,405 (45.4%) | 4,196 (25.7%) | 4,726 (28.9%) | 16,327 |
| EDMF | 237 (29.3%) | 292 (36.0%) | 281 (34.7%) | 810 |
| ISSM | 1,440 (41.2%) | 1,136 (32.5%) | 919 (26.3%) | 3,495 |
| LES | 74 (44.0%) | 30 (17.9%) | 64 (38.1%) | 168 |
| MOMO-CHEM | 411 (41.8%) | 256 (26.0%) | 316 (32.1%) | 983 |
| RAPID | 160 (47.6%) | 63 (18.8%) | 113 (33.6%) | 336 |

| Mission | Data Usage | Review Paper | Total |
|---------|-----------|--------------|-------|
| GRACE | 2,592 (83.9%) | 499 (16.1%) | 3,091 |
| SWOT | 287 (77.4%) | 84 (22.6%) | 371 |

### Note on Classification Mapping

The LLM classification prompt uses a 4-tier system (Level 1: Simple Citation, Level 2: Data Usage, Level 3: Model Adaptation, Level 4: Foundational Method). These were remapped to the dashboard's 3-tier system:

- LLM Level 1 (Simple Citation) → removed during prior data verification stages
- LLM Level 2 (Data Usage) → Dashboard Level 1: Data Usage
- LLM Level 3 (Model Adaptation) → Dashboard Level 2: Model Adaptation
- LLM Level 4 (Foundational Method) → Dashboard Level 3: Foundational Method

---

## 4. Files Modified

| File | Change |
|------|--------|
| `public/data/*_analyzed.json` (10 files) | Updated with Phase 1/2/3 uncertainty data, engagement levels remapped, non-peer-reviewed papers removed |
| `scripts/verify_peer_review.py` | New — three-tier peer-review verification script |
| `scripts/peer_review_cache.json` | New — Crossref/LLM lookup cache (451 entries) |
| `scripts/removed_non_peer_reviewed.json` | New — detailed log of all 1,278 removed papers |
| `scripts/phase2_cache.json` | Updated — grew from 14,494 to 26,807 entries (ECCO completion) |
| `scripts/phase3_cache.json` | Updated — skeptic agent review cache |
