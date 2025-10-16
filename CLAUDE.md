# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## Architecture Overview

This is a React-based dashboard for visualizing citation metrics across multiple scientific models. The codebase is designed with a modular, multi-model architecture that supports both model-specific and generic implementations.

### Key Architectural Components

**Model Configuration System (`src/config/modelConfig.js`)**
- Centralized configuration for all supported models (RAPID, CARDAMOM, CMS-Flux, ECCO, ISSM, MOMO-CHEM)
- Each model has display name, description, data path, color theme, domain, and links
- Use `getModelConfig(modelName)` to retrieve model-specific settings
- Use `getModelList()` to get array of all model names

**Routing Architecture (`src/AppWithRouting.js`)**
- Main dashboard route: `/science-model-dashboard`
- Model-specific routes: `/science-model-dashboard/{modelName}`
- Generic sub-pages: `/science-model-dashboard/{modelName}/citations`, `/geographic-impact`, `/research-domains`
- Legacy routes maintained for backward compatibility (RAPID uses legacy pages directly)
- All unmatched paths redirect to main dashboard

**Generic vs Model-Specific Components**
- Generic components (e.g., `GenericDashboard.js`, `GenericCitationsPage.js`) work with any model using the model configuration
- Model-specific components exist in `src/views/{MODEL_NAME}/` directories
- Generic components receive `modelName` prop from route params and load corresponding data file
- Generic components use `citationsData` prop containing the loaded JSON data

**Data Processing (`src/utils/dataUtils.js`)**
- `extractPublicationData(entry)` - Standardizes publication data from different JSON formats. Handles nested Crossref JSON structure with fields like `title[0]`, `author[]`, `published-print['date-parts']`, etc.
- `calculateMetrics(citationsData)` - Computes overview metrics (total papers, citations, growth rate, domains)
- `processGeographicData(citationsData)` - Extracts geographic information from abstracts/titles using keyword matching
- `processCitationTrends(citationsData)` - Analyzes citation patterns over time with cumulative calculations
- `processResearchDomains(citationsData)` - Groups publications by research domain with statistics

**Data Structure**
- Citation data stored as JSON files in `src/data/` with format `{MODEL_NAME}_analyzed.json`
- JSON structure follows Crossref API format with nested objects
- Key fields: `title[]`, `author[]`, `published-print['date-parts']`, `is-referenced-by-count`, `DOI`, `abstract`, `container-title[]`, `publisher`
- Custom fields added during processing: `research_domain`, `models[]`
- Geographic data inferred from text analysis of abstracts and titles

### Component Structure

**Charts (`src/components/charts/`)**
- All chart components built with Recharts library
- Some charts have model-specific variants in `src/components/charts/{MODEL_NAME}/`
- Reusable across different models
- Handle data transformation internally

**Views (`src/views/`)**
- `Dashboard.js` - Main multi-model overview
- `Generic*.js` - Template pages that work with any model (GenericDashboard, GenericCitationsPage, GenericGeographicImpactPage, GenericResearchDomainsPage)
- `{MODEL_NAME}/` - Model-specific implementations when needed (e.g., CARDAMOM, CMS-Flux, ECCO, ISSM, MOMO-CHEM, RAPID)

**Utilities (`src/utils/`)**
- `dataUtils.js` - Core data processing functions
- `colors.js` - Color palette definitions
- `chartUtils.js` - Chart-specific utilities
- `themeConfig.js` - Theme configuration

**Components (`src/components/`)**
- `DataLoader.js` - Wrapper for loading states, error handling, and empty states
- `Header.js` - Main navigation header
- `MetricCard.js` - Reusable metric display cards
- `FilterPanel.js` - Data filtering controls
- `ErrorBoundary.js` - React error boundary for graceful error handling
- Model-specific component variants in `src/components/{MODEL_NAME}/`

## Development Patterns

**Adding New Models**
1. Add model configuration to `src/config/modelConfig.js` in the MODELS object with all required fields (name, displayName, description, dataPath, color, domain, github, website, fullDescription)
2. Add corresponding route in MODEL_ROUTES object
3. Add JSON data file to `src/data/` with naming format `{MODEL_NAME}_analyzed.json`
4. Add route in `src/AppWithRouting.js` for the model-specific dashboard
5. Use generic components or create model-specific ones in `src/views/{MODEL_NAME}/` if custom behavior is needed

**Working with Citation Data**
- Always use `extractPublicationData()` to normalize data structure before processing
- Use processing functions in `dataUtils.js` for consistent data transformation
- Handle missing/malformed data gracefully with try-catch blocks
- All data processing functions return safe defaults on error

**Data Loading Pattern**
- Model-specific pages dynamically import their JSON data file based on the model configuration
- Use React's `useMemo` hook to process data only when it changes
- Wrap data-dependent UI in loading/error states using DataLoader component

**Styling**
- Uses Tailwind CSS for styling (v2.2.19)
- Lucide React for icons
- Model-specific colors defined in model configuration (accessed via `modelConfig.color`)
- Responsive design with mobile-first approach

## Testing & Deployment

- Built with Create React App
- Deployed to GitHub Pages via `npm run deploy`
- No specific test framework beyond React Testing Library (included with CRA)
- Homepage configured for GitHub Pages deployment at `https://yunks128.github.io/science-model-dashboard`
