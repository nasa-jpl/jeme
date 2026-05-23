# Task Statement: NASA Earth Science Model Impact & Capability Dashboard — Expansion & Sustainment

**Prepared by:** Kyongsik Yun, JPL Earth Science Section
**Date:** March 2026
**Period of Performance:** April 2026 – September 2027 (FY26–FY27)

---

## Background

JPL has developed a unified, AI-powered dashboard that tracks scientific impact, cross-model connections, and capability maturity for Earth science models and missions. The platform currently covers **JEME** (8 JPL models), **JEOE** (2 NASA missions: GRACE, SWOT), and **JESP** (199 JPL Earth Science Section scientist profiles). The system uses automated citation analytics, multi-agent data verification, LLM-based classification, and a 3-phase Bayesian uncertainty quantification pipeline, providing the quantitative evidence base called for by NASA's Earth Science to Action Strategy and JPL's Strategic R&TD investment in the Earth Science domain.

## Scope of Work

### Task 1 — Remaining Quality Control (Months 1–2)

- Finalize verification of citation data across all 8 JEME models (address ~8–12% false-removal rate, ~3–5% false-retention rate)
- Improve abstract coverage for ECCO dataset (~50% of entries were verified using title-only matching; enriching with full abstracts will strengthen classification confidence)
- Refine keyword-based relevance thresholds to reduce ~5–10% estimated miss rate for indirect model usage
- Complete Phase 2 (multi-temperature LLM sampling) and Phase 3 (skeptic agent review) uncertainty quantification runs for all 8 JEME models and integrate results into analyzed JSON data files
- Update Model Capability Level (MCL) scores with model-team feedback

### Task 2 — Inclusion of NASA Models in IMVI (Months 2–6)

- Identify and onboard additional NASA models within the Integrated Modeling & Validation Initiative (IMVI) not currently in the dashboard
- Coordinate with relevant Points of Contact to obtain seed papers, validate citation datasets, and review MCL scores
- Candidates may include models from NASA GSFC, GISS, GMAO, and other centers (e.g., GISS Model-E, GMAO GEOS, CESM, E3SM)
- For each new model: run full pipeline (citation collection → LLM classification → multi-agent verification → uncertainty quantification → MCL assessment)
- *POC coordination needed with Eric Larour, Derek Posselt, Kevin Bowman, and relevant model leads at partner centers*

### Task 3 — Inclusion of Non-IMVI NASA Models (Months 3–8)

- Survey additional NASA-funded or NASA-relevant models that may not be formally part of IMVI but are in active use across the Earth science community
- Engage subject-matter experts (Eric, Derek, Kevin, and others) to identify high-priority candidates
- Assess feasibility and effort per model; prioritize based on strategic relevance and data availability
- Onboard selected models using the established automated pipeline

### Task 4 — NASA-Wide Modeling Dashboard (Months 4–10)

- Evolve the JEME main dashboard from a JPL-specific page to a broader **NASA Earth Science Modeling** landing page
- Redesign navigation and branding to accommodate multi-center models while preserving JEME/JEOE/JESP as sub-views
- Add cross-center comparison features: network analysis, domain overlap, capability benchmarking across NASA centers
- Address hosting and access requirements for a NASA-wide audience (coordinate with IT on appropriate hosting environment)

### Task 5 — Sustainment & Extension Framework (Months 6–12, continuing FY27)

- Establish annual MCL reassessment cycle with model teams
- Build LLM-enhanced MCL scoring (auto-classify papers against capability dimensions, generate evidence summaries)
- Develop cross-dashboard analytics linking JEME models, JEOE missions, and JESP scientist expertise
- Document platform architecture and onboarding procedures for long-term maintainability
- Community engagement: present at NASA workshops, gather feedback, iterate

---

## Resource Estimate

| Role | FY26 (Apr–Sep) | FY27 (Oct–Sep) | Notes |
|------|---------------|----------------|-------|
| **Kyongsik Yun** (lead developer) | **0.3 FTE** (~6 months at 30%) | **0.2 FTE** (sustainment + expansion) | Pipeline development, dashboard engineering, LLM/UQ work, integration of new models |
| **Model-team POCs** (Eric Larour, Derek Posselt, Kevin Bowman, others) | ~0.05 FTE each (~2 hrs/wk, intermittent; max 0.1 FTE at peak) | ~0.02 FTE each | Seed paper identification, MCL score review, validation of results |
| **External model leads** (partner center contacts) | ~0.05 FTE each (~2 hrs/wk, intermittent; max 0.1 FTE at peak) | As needed | Coordination for non-JPL model onboarding |
| **IT / hosting support** | ~2 weeks | As needed | If migration to NASA-accessible hosting is required |

**Total estimated effort:**
- FY26: ~0.3 FTE (KY) + ~0.1 FTE distributed across collaborators
- FY27: ~0.2 FTE (KY) + ~0.05 FTE distributed across collaborators

---

## Timeline

```
FY26 (Apr–Sep 2026)
  Apr–May     Task 1: Quality control finalization
  May–Jul     Task 2: IMVI model onboarding (POC coordination)
  Jun–Sep     Task 3: Non-IMVI model survey & onboarding
  Jul–Sep     Task 4: NASA-wide dashboard redesign
  Aug–Sep     Task 5: Sustainment framework setup

FY27 (Oct 2026–Sep 2027)
  Oct–Dec     Complete remaining model onboarding
  Oct–Mar     LLM-enhanced MCL scoring deployment
  Jan–Sep     Annual MCL reassessment cycle (first round)
  Ongoing     Cross-dashboard analytics, community engagement, refinement
```

## Key Uncertainties & Mitigations

- **POC availability:** Interaction time with model leads at partner centers is the primary schedule driver. Mitigation: begin outreach early (Month 1) and pipeline work in parallel.
- **Number of models:** Final scope depends on survey results (Tasks 2–3). Mitigation: automated pipeline makes per-model marginal cost low (~1–2 weeks each once seed papers are identified).
- **Hosting:** NASA-wide access may require migration from current VM to an approved hosting environment. Mitigation: containerized deployment; engage IT early.
- **Extension:** Task plan structured for multi-year execution. FY26 focuses on implementation; FY27 allows for expansion, refinement, and community adoption. Extension beyond FY27 contingent on demonstrated value and stakeholder interest.

---

## Deliverables

1. Expanded dashboard with all identified IMVI and non-IMVI NASA models onboarded
2. NASA-wide Earth Science Modeling landing page with cross-center analytics
3. Updated MCL assessments validated by model teams
4. Platform documentation and onboarding guide for future model additions
5. Annual reassessment framework and LLM-enhanced scoring capability
