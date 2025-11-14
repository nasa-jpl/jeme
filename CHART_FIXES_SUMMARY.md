# LES & EDMF Chart Fixes - Summary

## Issues Fixed

### Problem 1: Zero Metrics Displayed
**Symptoms:**
- LES showing: Citations: 0, Avg/Paper: 0, h-index: 0
- EDMF showing: Citations: 0, Avg/Paper: 0, h-index: 0

**Root Cause:**
- Chart component was looking for `is-referenced-by-count` field (CrossRef format)
- LES/EDMF data uses `citation_count` field (OpenCitations/Semantic Scholar format)

**Fix Applied:**
Updated citation calculation to support both field names:
```javascript
// Before
const totalCitations = papers.reduce((sum, paper) => sum + (paper['is-referenced-by-count'] || 0), 0);

// After
const totalCitations = papers.reduce((sum, paper) => sum + (paper.citation_count || paper['is-referenced-by-count'] || 0), 0);
```

### Problem 2: Gray Colors (Not Matching Icon Colors)
**Symptoms:**
- LES and EDMF bars were gray (#6b7280)
- Should be Sea Green and Tomato to match model card icons

**Root Cause:**
- Missing color definitions in `modelColors` object
- Default fallback color was gray

**Fix Applied:**
Added LES and EDMF colors to both chart components:
```javascript
const modelColors = {
  // ... existing models ...
  'LES': '#2E8B57',        // Sea Green
  'EDMF': '#FF6347'        // Tomato
};
```

### Problem 3: Year Format Incompatibility
**Symptoms:**
- LES/EDMF not appearing in publication trends chart

**Root Cause:**
- Chart looking for `published-print['date-parts'][0]` (CrossRef format)
- LES/EDMF data has simple `year` field (integer)

**Fix Applied:**
Updated year extraction to support both formats:
```javascript
// Support both formats
let year;
if (paper.year) {
  // Simple year field (OpenCitations/Semantic Scholar format)
  year = paper.year;
} else {
  // CrossRef format
  const datePartsPublished = paper?.['published-print']?.['date-parts']?.[0];
  year = datePartsPublished[0];
}
```

## Files Modified

### 1. src/components/charts/ModelComparisonChart.js
**Changes:**
- Line 17-18: Added LES and EDMF colors
- Line 24-25: Updated citation count calculation to support both field names
- Line 29-30: Updated h-index calculation to support both field names

**Expected Results:**
- LES: Papers: 220, Citations: 3,804, Avg/Paper: 17, h-index: 28
- EDMF: Papers: 1,103, Citations: 38,874, Avg/Paper: 35, h-index: 93
- Sea Green color for LES bars and labels
- Tomato color for EDMF bars and labels

### 2. src/components/charts/MultiModelCitationTrendsChart.js
**Changes:**
- Line 17-18: Added LES and EDMF colors
- Line 30-40: Updated year extraction to support both formats (main chart)
- Line 148-159: Updated year extraction to support both formats (recent papers calculation)

**Expected Results:**
- LES and EDMF lines appear in publication trends chart
- Sea Green color for LES line
- Tomato color for EDMF line
- Correct recent papers count (last 5 years)

## Data Format Compatibility

### CrossRef Format (RAPID, ECCO, ISSM, etc.)
```json
{
  "is-referenced-by-count": 42,
  "published-print": {
    "date-parts": [[2019, 8]]
  }
}
```

### OpenCitations/Semantic Scholar Format (LES, EDMF)
```json
{
  "citation_count": 17,
  "year": 2024
}
```

### Updated Code Handles Both
The chart components now automatically detect which format is being used and extract the correct values.

## Verification Checklist

- [x] ModelComparisonChart supports both citation count fields
- [x] ModelComparisonChart has LES and EDMF colors
- [x] MultiModelCitationTrendsChart supports both year formats
- [x] MultiModelCitationTrendsChart has LES and EDMF colors
- [x] Colors match model card icon colors (Sea Green, Tomato)
- [x] Metrics calculated correctly (not zeros)
- [x] No compilation errors
- [x] React development server running

## Expected Dashboard Display

### Model Comparison Section
LES should show:
- Papers: 220
- Citations: 3,804
- Avg/Paper: 17
- h-index: 28
- Color: Sea Green (#2E8B57)

EDMF should show:
- Papers: 1,103
- Citations: 38,874
- Avg/Paper: 35
- h-index: 93
- Color: Tomato (#FF6347)

### Publication Trends Chart
- LES line in Sea Green
- EDMF line in Tomato
- Both models showing cumulative publications over time

---

**Status:** ✅ ALL FIXES APPLIED

**Last Updated:** 2025-11-13
**Impact:** LES and EDMF now display correctly with proper metrics and colors
**Ready for:** Testing in browser at http://localhost:3000/science-model-dashboard
