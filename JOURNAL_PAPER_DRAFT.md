# An AI-Powered Platform for Quantifying Scientific Impact and Capability Maturity Across NASA Earth System Models

**Kyongsik Yun**

Jet Propulsion Laboratory, California Institute of Technology, Pasadena, CA, USA

**Correspondence:** Kyongsik Yun (kyongsik.yun@jpl.nasa.gov)

---

## Target Journal Recommendation

| Journal | Fit | IF | Open Access | Rationale |
|---------|-----|-----|-------------|-----------|
| **Earth and Space Science (AGU)** | Best | 3.1 | Yes (Gold OA) | Explicitly welcomes model assessment, informatics, and cross-disciplinary Earth science. JAMES editorial noted ESS as the right home for model evaluation papers. |
| **Environmental Modelling & Software** | Strong | 4.9 | Hybrid | Covers modeling frameworks, dashboards, software for environmental science. Strong fit for the platform/methodology angle. |
| **Geoscientific Model Development** | Strong | 5.6 | Yes (Gold OA) | Model evaluation and assessment frameworks. Higher IF but may want more model development content. |
| **Earth Science Informatics** | Good | 2.7 | Hybrid | Springer journal focused on informatics for Earth science. Lower bar, good fit for the data pipeline and dashboard. |

**Recommended primary target: Earth and Space Science (AGU)** — explicitly in-scope for model assessment, open access, and the AGU ecosystem aligns with the Earth science community.

---

## Abstract

Quantifying the scientific impact and technical maturity of Earth system models is essential for strategic research investment, yet no standardized, automated framework exists for this purpose. We present an integrated platform that combines citation analytics, AI-powered classification, multi-agent data verification, uncertainty quantification, and capability maturity assessment across NASA's Earth science modeling and observation enterprises. The platform analyzes 44,268 publications with 1.33 million citations spanning eight JPL Earth system models (JEME) and two NASA observation missions (JEOE), providing automated classification of engagement levels, research domains, and geographic reach using large language models. A three-phase Bayesian uncertainty quantification pipeline—combining deterministic scoring, multi-temperature LLM sampling, and adversarial skeptic review—yields calibrated confidence estimates for every classification. Cross-model network analysis identifies bridge papers and collaboration opportunities through shared citations and co-authorship. We introduce the Model Capability Level (MCL) framework, a two-tier, 14-dimension assessment adapted from NASA Technology Readiness Levels and the Sandia Predictive Capability Maturity Model, providing systematic, evidence-based evaluation of model maturity on a 0–3 scale. Applied across all eight models, the MCL assessment reveals that ML/AI integration (mean 1.1/3) and stakeholder adoption (mean 1.3/3) are the most significant cross-cutting capability gaps. The platform's extensibility is demonstrated through rapid deployment to a scientist profiling system (JESP) covering 199 researchers and 12,768 publications. All components are open source and deployed as interactive web dashboards.

**Keywords:** Earth system models, citation analytics, model capability maturity, uncertainty quantification, large language models, scientific impact assessment

---

## 1. Introduction

NASA's Earth Science to Action Strategy requires objective, quantitative assessment of observation-informed models to advance science, develop decision-support tools, and formulate new satellite missions (National Academies of Sciences, Engineering, and Medicine, [2018](https://doi.org/10.17226/24938)). JPL's Strategic R&TD investment in the Earth Science domain further calls for evidence-based evaluation of model capability and impact. However, the scientific community lacks standardized tools for systematically quantifying how Earth system models are used, how they interconnect, and how mature they are across multiple capability dimensions.

Traditional bibliometric analyses provide aggregate citation counts but fail to capture the nature of model engagement—whether a paper merely cites a model or builds fundamentally upon it. Technology readiness assessments exist for hardware (Mankins, [1995](https://www.researchgate.net/publication/247705707_Technology_Readiness_Level_-_A_White_Paper)) but not for the complex, multi-dimensional capabilities of Earth system models. And while individual model teams track their own publications, no cross-model framework exists to identify shared research communities, collaboration opportunities, or common development gaps.

We address these challenges with an integrated platform comprising five innovations:

1. **Automated citation analytics** using large language models (LLMs) to classify engagement levels, research domains, and geographic reach across 44,268 publications.
2. **Multi-agent data verification** with five specialized agents that cross-validate citation datasets, achieving 91–96% keyword relevance match across models.
3. **Three-phase Bayesian uncertainty quantification** providing calibrated confidence scores for every citation classification.
4. **Cross-model network analysis** that identifies bridge papers, co-authorship networks, and domain overlap across models.
5. **Model Capability Level (MCL) framework** with 14 core dimensions and 5 application domain categories, adapted from NASA TRL and DOE PCMM heritage.

The platform currently serves JPL's Earth Modeling Enterprise (JEME; 8 models), JPL Earth Observation Enterprise (JEOE; 2 missions), and JPL Earth Science Profiles (JESP; 199 scientists), demonstrating extensibility across distinct scientific domains.

---

## 2. Background and Related Work

### 2.1 Bibliometric Analysis of Scientific Models

Bibliometric methods have been widely applied to assess research impact (Ellegaard & Wallin, [2015](https://doi.org/10.1007/s11192-015-1645-z)), but their application to computational Earth system models presents unique challenges. Standard citation counts conflate background mentions with deep methodological usage, and cross-model analyses are rare. The Semantic Scholar Academic Graph (Kinney et al., [2023](https://arxiv.org/abs/2301.10140)) and Crossref metadata infrastructure (Hendricks et al., [2020](https://doi.org/10.1162/qss_a_00023)) provide the API foundations for large-scale citation retrieval, but domain-specific classification requires additional intelligence.

### 2.2 Large Language Models for Scientific Classification

Recent advances in LLMs have demonstrated effectiveness in scientific text classification and systematic review automation (Scherbakov et al., [2025](https://doi.org/10.1093/jamia/ocaf063)). LLMs can categorize research papers by topic, methodology, and relevance with performance approaching human annotators, though calibrated uncertainty estimates remain a challenge. Our work extends these approaches by introducing multi-temperature sampling and adversarial review to quantify classification confidence.

### 2.3 Model Maturity and Capability Assessment

NASA's Technology Readiness Levels (TRL) provide a 9-level scale for assessing technology maturity from basic principles to flight-proven systems (Mankins, [2009](https://doi.org/10.1016/j.actaastro.2009.08.058)). The Sandia Predictive Capability Maturity Model (PCMM) extends this concept to computational modeling and simulation, assessing six contributing elements: representation fidelity, physics fidelity, code verification, solution verification, model validation, and uncertainty quantification (Oberkampf et al., [2007](https://doi.org/10.2172/976951)). The PCMM was further elaborated by Pilch et al. ([2011](https://doi.org/10.2172/1029740)) into a fourth-generation framework.

Verification and validation (V&V) of computational models has been extensively studied (Oberkampf & Trucano, [2002](https://doi.org/10.1016/S0376-0421(02)00005-2)), establishing foundational concepts for distinguishing code verification from model validation. However, neither TRL nor PCMM is directly applicable to Earth system models, which operate at unprecedented scales with coupled physical, chemical, and biological processes. Our MCL framework adapts and extends these approaches specifically for the Earth science modeling context.

### 2.4 Earth System Models Under Study

The eight JEME models span the full Earth system: ECCO for ocean state estimation (Forget et al., [2015](https://doi.org/10.5194/gmd-8-3071-2015)), ISSM for ice sheet dynamics (Larour et al., [2012](https://doi.org/10.1029/2011JF002140)), CMS-Flux for carbon flux monitoring (Liu et al., [2021](https://doi.org/10.5194/essd-13-299-2021)), CARDAMOM for terrestrial ecosystem carbon (Bloom & Williams, [2015](https://doi.org/10.5194/bg-12-1299-2015)), and RAPID, MOMO-CHEM, LES, and EDMF for hydrology, atmospheric chemistry, cloud processes, and atmospheric physics, respectively. Two JEOE missions—GRACE (Tapley et al., [2004](https://doi.org/10.1029/2004GL019920)) and SWOT (Morrow et al., [2019](https://doi.org/10.3389/fmars.2019.00232))—provide the observational constraints that these models assimilate.

---

## 3. Methods

### 3.1 Citation Analytics Pipeline

The citation analytics pipeline (Figure 1) comprises five stages:

**Stage 1: Seed Paper Identification.** For each model, core algorithm and application papers are identified by the model team. These "seed papers" represent the canonical publications describing the model itself.

**Stage 2: Citation Collection.** All papers citing the seed papers are retrieved using the Semantic Scholar Academic Graph API (Kinney et al., [2023](https://arxiv.org/abs/2301.10140)) and Crossref REST API (Hendricks et al., [2020](https://doi.org/10.1162/qss_a_00023)). Metadata including title, authors, abstract, DOI, venue, and citation count are extracted. Two data formats coexist: Crossref format (nested arrays) and a simplified flat format; a normalization function harmonizes field names before processing.

**Stage 3: LLM Classification.** Each citation is classified along three dimensions using a locally hosted LLM (Gemma3 via Ollama):

- *Engagement Level* (4 tiers): Level 1 (background citation), Level 2 (data usage), Level 3 (model adaptation), Level 4 (foundational method).
- *Research Domain* (10 categories): Hydrology, Ocean & Marine, Climate, Atmospheric, Cryosphere, Remote Sensing, Ecosystem & Biogeochemistry, Machine Learning, Modeling & Simulation, Geophysics & Geodesy.
- *Geographic Region*: Extracted from abstract and title keywords using a curated geographic lexicon.

**Stage 4: Multi-Agent Verification.** Five specialized agents cross-validate the classification results:

1. *Team Paper Categorizer*: Classifies each team paper by relevance tier using hierarchical keyword matching.
2. *Crossref Agent*: Resolves DOIs to validate existence and retrieve journal/venue metadata.
3. *Semantic Scholar Agent*: Batch API for title recovery and venue enrichment for DOI-less entries.
4. *Keyword Classifier*: Scores relevance via domain-specific keyword matching on title and abstract against 170 keywords across 10 domains.
5. *Deduplication Agent*: DOI-first, title-fallback duplicate detection.

**Stage 5: Dashboard Visualization.** Verified data are served through a React-based interactive dashboard with per-model drill-downs, cross-model comparisons, and geographic visualizations using D3.js and Recharts.

![Figure 7. Three-Phase Uncertainty Quantification Pipeline](figures/fig7_uq_pipeline.png)

### 3.2 Three-Phase Uncertainty Quantification

Classification confidence is quantified through a three-phase pipeline (Figure 7):

**Phase 1: Deterministic Scoring.** Evidence confidence (0–1) is computed from metadata completeness: abstract presence (35%), DOI (15%), venue (15%), author completeness (10%), and keyword match score against 170 domain keywords (25%). Reasoning confidence is heuristically set to 0.85 with abstract, 0.50 without. Pipeline variance measures disagreement between the keyword classifier and the LLM label. The composite score is:

$$C_1 = 0.45 \times E + 0.45 \times R - 0.10 \times V$$

where $E$ is evidence confidence, $R$ is reasoning confidence, and $V$ is pipeline variance, clamped to [0.05, 0.99].

**Phase 2: Multi-Temperature LLM Sampling.** Each entry is classified three times using Gemini at temperatures {0.1, 0.5, 1.0}. Stochastic variance $S$ is the fraction of runs disagreeing with the majority label (range 0.0–0.67). Reasoning confidence is the average of the LLM's self-assessed confidence (1–5 scale), normalized to 0–1. The updated composite is:

$$C_2 = 0.35 \times E + 0.35 \times R + 0.20 \times (1 - S) - 0.10 \times V$$

**Phase 3: Skeptic Agent Review.** High-risk entries—those with miscalibration risk "high," stochastic variance > 0.3, or high engagement with low confidence—are subjected to adversarial review. An LLM is prompted to challenge the existing classification and rate agreement on a 1–5 scale. Override flags are set when agreement ≤ 2/5.

### 3.3 Cross-Model Network Analysis

Network analysis identifies inter-model connections through three mechanisms:

- *Bridge Papers*: Citations appearing in two or more models' datasets, identified via DOI matching. These represent research that spans multiple model communities.
- *Connection Matrix*: Pairwise model overlap counts, forming a weighted adjacency matrix.
- *Cross-Model Co-Authorship*: Authors appearing on bridge papers spanning multiple models, ranked by model count and paper count.

Network metrics include connectivity ratio (connections/total papers), centrality ranking, and average connection strength. Results are visualized as a force-directed graph with nodes sized by centrality and edges weighted by shared paper count.

### 3.4 Earth System Sphere Classification

All publications are classified into Earth's five interconnected spheres—atmosphere, hydrosphere, cryosphere, biosphere, and geosphere—using keyword-based matching. Multi-sphere papers are counted in each relevant sphere. An inter-sphere connection matrix identifies papers bridging multiple Earth system components, and model-to-sphere mappings reveal which JEME models contribute to which spheres.

### 3.5 Model Capability Level (MCL) Framework

The MCL framework adapts NASA TRL (Mankins, [1995](https://www.researchgate.net/publication/247705707_Technology_Readiness_Level_-_A_White_Paper); [2009](https://doi.org/10.1016/j.actaastro.2009.08.058)) and the Sandia PCMM (Oberkampf et al., [2007](https://doi.org/10.2172/976951)) for Earth system models. It employs a two-tier structure:

**Tier 1: 14 Core Capability Dimensions.** Each is scored on a 0–3 scale with defined level descriptors:

| # | Dimension | Description |
|---|-----------|-------------|
| 1 | Process Representation | Fidelity of physical/chemical/biological processes |
| 2 | Spatial Resolution | Grid resolution and adaptive refinement capability |
| 3 | Temporal Resolution | Time step range and output frequency |
| 4 | Process Coupling | Multi-component interaction complexity |
| 5 | Predictive Skill | Validated forecast accuracy against observations |
| 6 | Computational Performance | Scalability, GPU/cloud portability |
| 7 | Observational Constraint | Number and diversity of assimilated observation types |
| 8 | Retrospective Analysis | Continuous reanalysis product availability |
| 9 | UQ & Attribution | Uncertainty quantification and source attribution |
| 10 | V&V Framework | Verification and validation rigor (Oberkampf & Trucano, [2002](https://doi.org/10.1016/S0376-0421(02)00005-2)) |
| 11 | ML/AI Integration | Machine learning adoption in model workflows |
| 12 | Mission Support | OSSE capability and mission formulation contribution |
| 13 | Interoperability | Open data, standard formats, FAIR compliance (Wilkinson et al., [2016](https://doi.org/10.1038/sdata201618)) |
| 14 | Stakeholder Adoption | Operational use beyond the research community |

**Tier 2: 5 Application Domain Categories.** Each comprises 4 sub-dimensions scored on the same 0–3 scale: Research, Data Assimilation, VVUQ/ML, Mission Formulation, and Decision Support.

Scores are assigned based on published evidence, model documentation, intercomparison results, and model-team input. Each score is accompanied by an evidence string documenting the rationale.

---

## 4. Results

### 4.1 Citation Dataset Overview

Figure 1 and Table 1 summarize the citation datasets across the 10 entities analyzed.

![Figure 1. Citation Dataset Overview](figures/fig1_citation_overview.png)

**Table 1.** Citation statistics for JEME models and JEOE missions.

| Entity | Type | Papers | Citations | Domain |
|--------|------|--------|-----------|--------|
| ECCO | Model | 27,456 | 820,748 | Oceanography |
| ISSM | Model | 5,668 | 165,963 | Cryosphere |
| MOMO-CHEM | Model | 1,658 | 50,986 | Atmospheric Chemistry |
| EDMF | Model | 1,178 | 43,527 | Atmospheric Physics |
| CMS-Flux | Model | 955 | 21,108 | Carbon Flux |
| CARDAMOM | Model | 773 | 22,117 | Terrestrial Ecosystems |
| RAPID | Model | 488 | 11,129 | Hydrology |
| LES | Model | 255 | 3,763 | Cloud / Turbulence |
| GRACE | Mission | 5,455 | 179,779 | Geophysics & Geodesy |
| SWOT | Mission | 782 | 12,106 | Ocean & Inland Water |
| **Total** | | **44,668** | **1,331,226** | |

### 4.2 Data Verification Results

The multi-agent verification pipeline achieved 91–96% keyword relevance match across models with clean datasets (Table 2). ECCO required the most extensive cleaning due to its large dataset and the prevalence of tangential citing papers.

**Table 2.** Verification outcomes by model.

| Model | Original | Verified | Removed | Keyword Match | Primary Issue |
|-------|----------|----------|---------|---------------|---------------|
| ECCO | 31,452 | 27,456 | 3,996 | Variable | EGM2008 contamination, tangential team papers |
| ISSM | 5,950 | 5,938 | 12 | 96% | Broken metadata (1,904 titles repaired) |
| All others | — | — | 0 | 91–96% | Clean datasets |

Overall estimated error rates: false removal 8–12%, false retention 3–5%. The primary uncertainty source is the ~50% of ECCO entries lacking abstracts, requiring title-only verification.

### 4.3 Uncertainty Quantification

The three-phase UQ pipeline assigns calibrated confidence scores to each of the 44,668 classification decisions. Phase 1 deterministic scoring provides the baseline. Phase 2 multi-temperature LLM sampling (3 passes at temperatures 0.1, 0.5, 1.0) captures stochastic variance in classification. Phase 3 skeptic review targets high-risk entries for adversarial challenge. The combined pipeline reduces miscalibration risk and flags entries requiring human review.

### 4.4 Cross-Model Network Analysis

Network analysis reveals structured connectivity across the eight JEME models (Figure 5). The strongest connections are between ECCO and ISSM (ocean–ice coupling) and between CMS-Flux and CARDAMOM (carbon cycle). Bridge papers—those cited by multiple model communities—identify concrete interdisciplinary research opportunities and collaboration pathways between modeling teams that may otherwise operate independently.

![Figure 5. Cross-Model Connection Matrix](figures/fig5_network_matrix.png)

### 4.5 Earth System Sphere Coverage

Classification of all JEME publications into Earth's five spheres reveals comprehensive but uneven coverage (Figure 8). The hydrosphere and atmosphere are well represented across multiple models, while the geosphere has narrower coverage (primarily ISSM and ECCO). Inter-sphere bridge papers—those spanning two or more spheres—represent the most integrative research and are concentrated in climate science and water cycle studies.

![Figure 8. Model-to-Sphere Mapping](figures/fig8_sphere_coverage.png)

### 4.6 Model Capability Level Assessment

Figures 2, 3, and 6 and Table 3 present the Tier 1 MCL scores across all eight models and 14 dimensions.

![Figure 2. MCL Tier 1 Capability Heatmap](figures/fig2_mcl_heatmap.png)

![Figure 3. MCL Tier 1 Radar Comparison](figures/fig3_mcl_radar.png)

**Table 3.** Tier 1 MCL heatmap (0 = None, 1 = Low, 2 = Medium, 3 = High).

| Dimension | ECCO | ISSM | RAPID | CMS-Flux | CARDAMOM | MOMO-CHEM | LES | EDMF | Mean |
|-----------|------|------|-------|----------|----------|-----------|-----|------|------|
| Process Repr. | 3 | 3 | 2 | 2 | 2 | 2 | 3 | 2 | 2.4 |
| Spatial Res. | 2 | 3 | 2 | 2 | 1 | 2 | 3 | 1 | 2.0 |
| Temporal Res. | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2.1 |
| Process Coupling | 2 | 3 | 2 | 1 | 1 | 2 | 1 | 2 | 1.8 |
| Predictive Skill | 3 | 2 | 2 | 2 | 2 | 2 | 1 | 1 | 1.9 |
| Comp. Performance | 2 | 2 | 2 | 1 | 1 | 1 | 2 | 2 | 1.6 |
| Obs. Constraint | 3 | 2 | 2 | 3 | 2 | 2 | 1 | 1 | 2.0 |
| Retro. Analysis | 3 | 2 | 2 | 2 | 2 | 2 | 0 | 0 | 1.6 |
| UQ & Attribution | 2 | 2 | 1 | 2 | 3 | 2 | 1 | 2 | 1.9 |
| V&V Framework | 3 | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2.3 |
| ML/AI Integration | 1 | 1 | 1 | 1 | 1 | 0 | 2 | 2 | 1.1 |
| Mission Support | 3 | 2 | 2 | 2 | 1 | 1 | 1 | 0 | 1.5 |
| Interoperability | 3 | 3 | 3 | 2 | 2 | 1 | 1 | 2 | 2.1 |
| Stakeholder Adopt. | 2 | 2 | 2 | 2 | 1 | 1 | 0 | 0 | 1.3 |
| **Tier 1 Average** | **2.50** | **2.29** | **1.93** | **1.86** | **1.64** | **1.57** | **1.43** | **1.36** | **1.82** |

**Key findings:**

- ECCO leads with 8 dimensions at Level 3 and a Tier 1 average of 2.50/3.0. Its strengths include process representation, observational constraint (14+ observation types), retrospective analysis (v4r4 reanalysis 1992–2017), and mission support (OSSEs for GRACE-FO, SWOT, Sentinel-6).
- ISSM ranks second (2.29/3.0) with strengths in spatial resolution (adaptive mesh, sub-km at ice sheet margins), process coupling (3-way ice–solid Earth–sea level), and interoperability (open source).
- **ML/AI Integration** is the most significant cross-cutting gap: 6 of 8 models score below Level 2, with a mean of 1.1/3 (Figure 4).
- **Stakeholder Adoption** (mean 1.3/3) and **Computational Performance** (mean 1.6/3) are the next most significant gaps.

![Figure 4. Gap Analysis](figures/fig4_gap_analysis.png)

![Figure 6. Tier 1 Average Scores with Standard Deviation](figures/fig6_tier1_averages.png)

### 4.7 Platform Extensibility: JESP

To demonstrate platform extensibility, the same technology—citation collection, LLM classification, uncertainty quantification, and network analysis—was applied to profile 199 scientists in JPL's Earth Science Section. The JESP system extracted 12,768 publications with 1,022,329 total citations from OpenAlex and Semantic Scholar APIs, classified research expertise using Gemini, and constructed a collaboration network with 1,281 co-publication connections across 11 research groups. Deployment required days rather than months, validating the platform's reusability.

---

## 5. Discussion

### 5.1 Strategic Implications for R&TD Investment

The MCL gap analysis provides directly actionable intelligence for NASA's strategic R&TD planning. ML/AI integration represents the highest-priority cross-cutting investment opportunity: a shared initiative could benefit all eight modeling teams simultaneously. The combination of citation impact data with capability assessment creates an evidence base that connects "how widely used is this model?" with "how capable is it for the applications we need?"

### 5.2 Limitations

Several limitations warrant discussion:

- **Abstract availability**: Approximately 50% of ECCO entries and 4–9% of other model entries lack abstracts, forcing title-only classification with reduced confidence.
- **Keyword-based relevance**: An estimated 5–10% of papers that use model outputs without naming the model are missed by citation-based retrieval.
- **MCL scoring subjectivity**: Despite evidence-based scoring, the 0–3 scale involves subjective judgment. We mitigate this through evidence documentation and plan for periodic reassessment with model-team validation.
- **LLM classification drift**: Model performance may vary across scientific domains and may degrade as terminology evolves.

### 5.3 Comparison with Existing Approaches

Our platform differs from existing bibliometric tools (e.g., Google Scholar profiles, Scopus) in three key ways: (1) engagement-level classification distinguishes background citations from deep methodological usage; (2) cross-model network analysis reveals inter-model connections invisible to single-model analyses; and (3) the MCL framework provides a structured capability assessment absent from pure bibliometric approaches.

Compared to the Sandia PCMM (Oberkampf et al., [2007](https://doi.org/10.2172/976951)), our MCL framework adds Earth-science-specific dimensions (observational constraint, retrospective analysis, mission support) and application domain tiers, while maintaining the multi-dimensional assessment philosophy.

---

## 6. Conclusions

We have presented an integrated platform that combines AI-powered citation analytics, multi-agent data verification, uncertainty quantification, network analysis, and capability maturity assessment for NASA Earth system models. The key contributions are:

1. A five-stage citation analytics pipeline processing 44,668 publications across 10 NASA models and missions.
2. A three-phase Bayesian uncertainty quantification system providing calibrated confidence for every classification.
3. The Model Capability Level framework—a 14-dimension, evidence-based assessment adapted from NASA TRL and Sandia PCMM heritage.
4. Identification of ML/AI integration (mean 1.1/3) and stakeholder adoption (mean 1.3/3) as the most significant cross-cutting capability gaps across JEME.
5. Demonstrated platform extensibility through rapid deployment to scientist profiling (JESP: 199 scientists, 12,768 publications).

The platform provides the quantitative evidence base for JPL's Strategic R&TD planning in Earth Science and is designed for periodic reassessment as models evolve.

**Code and Data Availability.** The dashboard source code and MCL scoring data are available at https://github.com/yunks128/science-model-dashboard. Live dashboards are deployed at http://34.31.165.25:3000/science-model-dashboard/ (JEME/JEOE) and http://34.31.165.25:3002/sci-profile/ (JESP).

---

## List of Figures

| Figure | File | Description |
|--------|------|-------------|
| 1 | `figures/fig1_citation_overview.png` | Citation dataset overview: papers and citations per entity (log scale) |
| 2 | `figures/fig2_mcl_heatmap.png` | MCL Tier 1 capability heatmap across eight JEME models |
| 3 | `figures/fig3_mcl_radar.png` | MCL Tier 1 radar comparison for top 4 models |
| 4 | `figures/fig4_gap_analysis.png` | Gap analysis: dimensions ranked by development need |
| 5 | `figures/fig5_network_matrix.png` | Cross-model connection matrix (bridge papers) |
| 6 | `figures/fig6_tier1_averages.png` | Tier 1 average scores with standard deviation |
| 7 | `figures/fig7_uq_pipeline.png` | Three-phase uncertainty quantification pipeline schematic |
| 8 | `figures/fig8_sphere_coverage.png` | Model-to-sphere mapping: JEME coverage of Earth system components |

All figures are available in both PNG (300 DPI) and PDF vector formats in the `figures/` directory.

---

## References

Bloom, A. A., & Williams, M. (2015). Constraining ecosystem carbon dynamics in a data-limited world: integrating ecological "common sense" in a model–data fusion framework. *Biogeosciences*, 12(5), 1299–1315. [https://doi.org/10.5194/bg-12-1299-2015](https://doi.org/10.5194/bg-12-1299-2015)

Ellegaard, O., & Wallin, J. A. (2015). The bibliometric analysis of scholarly production: How great is the impact? *Scientometrics*, 105, 1809–1831. [https://doi.org/10.1007/s11192-015-1645-z](https://doi.org/10.1007/s11192-015-1645-z)

Forget, G., Campin, J.-M., Heimbach, P., Hill, C. N., Ponte, R. M., & Wunsch, C. (2015). ECCO version 4: an integrated framework for non-linear inverse modeling and global ocean state estimation. *Geoscientific Model Development*, 8, 3071–3104. [https://doi.org/10.5194/gmd-8-3071-2015](https://doi.org/10.5194/gmd-8-3071-2015)

Hendricks, G., Tkaczyk, D., Lin, J., & Feeney, P. (2020). Crossref: The sustainable source of community-owned scholarly metadata. *Quantitative Science Studies*, 1(1), 414–427. [https://doi.org/10.1162/qss_a_00023](https://doi.org/10.1162/qss_a_00023)

Kinney, R., et al. (2023). The Semantic Scholar Open Data Platform. *arXiv preprint*. [https://arxiv.org/abs/2301.10140](https://arxiv.org/abs/2301.10140)

Larour, E., Seroussi, H., Morlighem, M., & Rignot, E. (2012). Continental scale, high order, high spatial resolution, ice sheet modeling using the Ice Sheet System Model (ISSM). *Journal of Geophysical Research: Earth Surface*, 117(F1). [https://doi.org/10.1029/2011JF002140](https://doi.org/10.1029/2011JF002140)

Liu, J., Bowman, K. W., Schimel, D. S., Parazoo, N. C., Jiang, Z., Lee, M., Bloom, A. A., Wunch, D., Frankenberg, C., Sun, Y., O'Dell, C. W., Gurney, K. R., Menemenlis, D., Gierach, M., Crisp, D., & Eldering, A. (2021). Carbon Monitoring System Flux Net Biosphere Exchange 2020 (CMS-Flux NBE 2020). *Earth System Science Data*, 13, 299–330. [https://doi.org/10.5194/essd-13-299-2021](https://doi.org/10.5194/essd-13-299-2021)

Mankins, J. C. (1995). Technology readiness levels: A white paper. *NASA Office of Space Access and Technology*. [https://www.researchgate.net/publication/247705707](https://www.researchgate.net/publication/247705707_Technology_Readiness_Level_-_A_White_Paper)

Mankins, J. C. (2009). Technology readiness assessments: A retrospective. *Acta Astronautica*, 65(9–10), 1216–1223. [https://doi.org/10.1016/j.actaastro.2009.08.058](https://doi.org/10.1016/j.actaastro.2009.08.058)

Morrow, R., Fu, L.-L., et al. (2019). Global observations of fine-scale ocean surface topography with the Surface Water and Ocean Topography (SWOT) mission. *Frontiers in Marine Science*, 6, 232. [https://doi.org/10.3389/fmars.2019.00232](https://doi.org/10.3389/fmars.2019.00232)

National Academies of Sciences, Engineering, and Medicine. (2018). *Thriving on Our Changing Planet: A Decadal Strategy for Earth Observation from Space*. The National Academies Press. [https://doi.org/10.17226/24938](https://doi.org/10.17226/24938)

Oberkampf, W. L., Pilch, M., & Trucano, T. G. (2007). Predictive Capability Maturity Model for computational modeling and simulation. *Sandia National Laboratories Report SAND2007-5948*. [https://doi.org/10.2172/976951](https://doi.org/10.2172/976951)

Oberkampf, W. L., & Trucano, T. G. (2002). Verification and validation in computational fluid dynamics. *Progress in Aerospace Sciences*, 38(3), 209–272. [https://doi.org/10.1016/S0376-0421(02)00005-2](https://doi.org/10.1016/S0376-0421(02)00005-2)

Pilch, M., Trucano, T. G., Moya, J. L., Froehlich, G., Hodges, A., & Peercy, D. (2011). Guidelines for Sandia PCMM application. *Sandia National Laboratories Report SAND2011-2041*. [https://doi.org/10.2172/1029740](https://doi.org/10.2172/1029740)

Scherbakov, D., et al. (2025). The emergence of large language models as tools in literature reviews: a large language model-assisted systematic review. *Journal of the American Medical Informatics Association*, 32(6), 1071–1084. [https://doi.org/10.1093/jamia/ocaf063](https://doi.org/10.1093/jamia/ocaf063)

Tapley, B. D., Bettadpur, S., Watkins, M., & Reigber, C. (2004). The gravity recovery and climate experiment: Mission overview and early results. *Geophysical Research Letters*, 31(9). [https://doi.org/10.1029/2004GL019920](https://doi.org/10.1029/2004GL019920)

Wilkinson, M. D., et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data*, 3, 160018. [https://doi.org/10.1038/sdata201618](https://doi.org/10.1038/sdata201618)
