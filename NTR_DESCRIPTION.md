# NTR Title

An AI-Powered Platform for Quantifying Scientific Impact Across JPL Earth System Models and Missions

---

## Innovator(s)

Kyongsik Yun

---

## Funding

- **Funding Source:** INV05S/05.50.SPI.SRTD.018/149232
- **Task:** S F INVESTMENTS - EARTH SYSTEM MRLS {1/26/2026 - 12/31/3000}

**Additional Funding Sources:**
- 106749/04.03.01.01/149232 — GRACE-FO PHASE E - Science Support {2/09/2026 - 4/05/2026}
- 107427/04.01.04/149232 — TROPESS - DISSEMINATION {3/23/2026 - 9/27/2026}

- **Any DOE Funding:** No
- **Development Costs:** $50K (estimate)
- **Additional Development Dollars Anticipated:** $50K

---

## Technical Description

### Problem

NASA's Earth Science to Action Strategy requires objective, quantitative assessment of Earth system models, yet no standardized, automated framework exists. Traditional bibliometric tools (Google Scholar, Scopus, Web of Science) provide only aggregate citation counts and treat all citations as equivalent, failing to capture the nature of model engagement — whether a paper merely cites a model or builds fundamentally upon it. No cross-model framework exists to identify shared research communities, collaboration opportunities, or common development gaps across JPL's Earth science modeling portfolio.

### Solution

An integrated platform combining four innovations:

1. **Automated citation analytics** using large language models (Gemini, Gemma3) to classify engagement levels (4 tiers: background citation through foundational method usage), research domains (10 Earth science categories), and geographic reach across 26,741 peer-reviewed publications spanning 8 JPL Earth system models (ECCO, ISSM, RAPID, CMS-Flux, CARDAMOM, MOMO-CHEM, LES, EDMF) and 2 NASA observation missions (GRACE, SWOT).

2. **Multi-agent data verification** with five specialized agents (Team Paper Categorizer, Crossref Agent, Semantic Scholar Agent, Keyword Classifier, Deduplication Agent) achieving 91–96% keyword relevance match.

3. **Three-phase Bayesian uncertainty quantification pipeline** — deterministic scoring, multi-temperature LLM ensemble sampling (3 passes at temperatures 0.1, 0.5, 1.0), and adversarial skeptic review — providing calibrated confidence scores for every classification.

4. **Cross-model network analysis** identifying bridge papers, co-authorship networks, and domain overlap across all models.

The platform is implemented as a React-based interactive web dashboard with D3.js/TopoJSON geographic visualizations and Recharts charting, deployed at JPL.

### FPGA/Firmware/Software

Yes — software was developed. No, it was not reported on another NTR.

### Novelty

This platform is novel in four specific dimensions compared to existing commercial bibliometric tools:

1. **Engagement Level Classification.** A 4-tier classification (Level 1: background citation, Level 2: data usage, Level 3: model adaptation, Level 4: foundational method) that distinguishes how deeply each paper engages with the model. No existing bibliometric tool provides this granularity — all treat citations as equivalent.

2. **Domain-Specific Research Classification.** Automated classification into 10 Earth-science-specific research domains (Hydrology, Ocean & Marine, Climate, Atmospheric, Cryosphere, Remote Sensing, Ecosystem & Biogeochemistry, Machine Learning, Modeling & Simulation, Geophysics & Geodesy), beyond the broad subject areas offered by Google Scholar or Semantic Scholar.

3. **Geographic Impact Analysis.** Keyword-based geographic extraction from abstracts and titles maps model adoption across 50+ countries, revealing adoption patterns and underserved regions. No commercial bibliometric tool provides this capability for computational models.

4. **Three-Phase Uncertainty Quantification Pipeline.** A practical synthesis of current best practices for LLM uncertainty — deterministic scoring from metadata completeness, multi-temperature LLM ensemble sampling with verbalized confidence elicitation, and adversarial skeptic agent review. This integrates concepts from calibration analysis (Guo et al., 2017), conformal prediction (Angelopoulos & Bates, 2023), deep ensembles (Lakshminarayanan et al., 2017), and semantic entropy (Lin et al., 2023) into a single operational pipeline. Cross-model network analysis revealing inter-model connections through bridge papers and co-authorship is also novel.

### Relation to NASA Work

This platform directly supports JPL's Strategic R&TD planning in Earth Science by providing quantitative evidence for understanding model impact and adoption across eight JEME models and two JEOE missions. The platform supports NASA's Earth Science to Action Strategy (National Academies, 2018) by revealing how Earth system models are being used across the global research community, identifying emerging research domains, and mapping geographic adoption patterns. Extensibility was demonstrated through rapid deployment to a scientist profiling system (JESP) covering 199 JPL researchers and 12,768 publications. The cross-model network analysis identifies collaboration opportunities between modeling teams that may otherwise operate independently — for example, revealing the ECCO–ISSM ocean–ice coupling research community and CMS-Flux–CARDAMOM carbon cycle connections.

---

## Patent Right Status

- **Related to or resulted from assigned work:** Yes
- **Published or submitted for publication:** No
- **Plans to submit a paper:** Yes
- **Journal:** Earth and Space Science (AGU)
- **Presented at a conference:** No
- **Described on a website:** Yes
- **Date of first posting:** 01-JAN-2026
- **Website URL:** http://34.31.165.25:3000/science-model-dashboard/
- **In use outside of JPL:** No
- **Copies distributed outside JPL:** No
- **Disclosures made with NDA:** None
- **Plans to disclose publicly:** Yes. A paper will be submitted to Earth and Space Science (AGU) as a Gold Open Access publication. The source code is publicly available on GitHub at https://github.com/yunks128/science-model-dashboard.
- **Built or used for intended purpose:** Yes. The platform is deployed and actively used by JPL Earth Science model teams for citation analytics since approximately January 2026.
- **Semiconductor chip product:** No

---

## Commercialization Factors

### Commercial Applications

Yes — Caltech/JPL should consider filing a patent application. The platform addresses a gap in the $3B+ bibliometric analytics market (dominated by Elsevier/Scopus, Clarivate/Web of Science, Digital Science/Dimensions). Current commercial tools provide aggregate citation counts but lack engagement-level classification, domain-specific research categorization, geographic impact mapping, and uncertainty-quantified AI classification. The platform is at a working prototype level with production deployment. Further development includes expanding to additional model domains, adding predictive analytics for research trend forecasting, and incorporating additional data sources.

- **Prototype developed:** Yes
- **Invention fixed in final form:** No (still under active development)

### Potential Licensees

- **Bibliometric analytics companies:** Elsevier (Scopus), Clarivate (Web of Science), Digital Science (Dimensions) — as an add-on for domain-specific model impact assessment
- **Government agencies with modeling programs:** DOE national laboratories (Sandia, LLNL, ORNL, ANL), NOAA, ESA, ECMWF — for assessing their own computational model portfolios
- **Academic institutions:** Universities with large-scale Earth system modeling programs (MIT, Columbia, CU Boulder, University of Washington)
- **Research funding agencies:** NSF, DOE Office of Science — for evidence-based program assessment and investment prioritization

### Related Government Applications

- NASA's Science Discovery Engine provides literature search but does not classify engagement depth or provide cross-model network analysis.
- NIH's iCite provides citation analysis for biomedical research but lacks engagement-level classification and domain-specific categorization for Earth science.
- NSF's research.gov tracks funded publications but does not analyze how computational models are used across the research community.
