#!/usr/bin/env node
// Searches Google for JPL alumni at PSE-engaged companies via LinkedIn profiles.
// Uses Serper.dev Google Search API (2,500 free credits on signup).
//
// Usage:
//   node scripts/find_jpl_alumni.js
//
// Output: public/jpl_alumni.json  (fetched dynamically by the React app — no rebuild needed)
// Run again any time to refresh; results are merged with previous run.

const https = require('https');
const fs = require('fs');
const path = require('path');

const SERPER_API_KEY = '17548d6f6c9efbebc9ec08a8029c7a86dd600e15';

const OUTPUT_PATH = path.join(__dirname, '../public/jpl_alumni.json');
const DELAY_MS = 1000; // 1s between queries

// Companies to search. searchTerm is what appears in the Google query;
// key must match the company name used in PSEPage MOCK_ENGAGEMENT.
const COMPANIES = [
  // Original 17
  { key: 'Aon Plc',           searchTerm: 'Aon' },
  { key: 'BlackRock',         searchTerm: 'BlackRock' },
  { key: 'Arbol',             searchTerm: 'Arbol' },
  { key: 'AccuWeather',       searchTerm: 'AccuWeather' },
  { key: 'NCX',               searchTerm: 'NCX' },
  { key: 'AIR Parametric',    searchTerm: 'AIR Worldwide' },
  { key: 'Bloomberg',         searchTerm: 'Bloomberg' },
  { key: 'BASF',              searchTerm: 'BASF' },
  { key: 'Carbon Direct',     searchTerm: 'Carbon Direct' },
  { key: 'Dynamical.org',     searchTerm: 'Dynamical.org' },
  { key: 'Climavision',       searchTerm: 'Climavision' },
  { key: 'Amundi',            searchTerm: 'Amundi' },
  { key: 'Arch Insurance',    searchTerm: 'Arch Insurance' },
  { key: 'Hazen and Sawyer',  searchTerm: 'Hazen and Sawyer' },
  { key: 'Stripe / Frontier', searchTerm: 'Stripe Climate' },
  { key: 'Agrograph',         searchTerm: 'Agrograph' },
  { key: 'Ponterra',          searchTerm: 'Ponterra' },

  // Earth observation & satellite
  { key: 'Planet Labs',                searchTerm: 'Planet Labs' },
  { key: 'Maxar Technologies',         searchTerm: 'Maxar Technologies' },
  { key: 'BlackSky Technologies, Inc.',searchTerm: 'BlackSky' },
  { key: 'Spire',                      searchTerm: 'Spire Global' },
  { key: 'Capella Space',              searchTerm: 'Capella Space' },
  { key: 'ICEYE US',                   searchTerm: 'ICEYE' },
  { key: 'Muon Space',                 searchTerm: 'Muon Space' },
  { key: 'GHGSat',                     searchTerm: 'GHGSat' },
  { key: 'Satelligence',               searchTerm: 'Satelligence' },
  { key: 'Carbon Mapper',              searchTerm: 'Carbon Mapper' },
  { key: 'Kayrros',                    searchTerm: 'Kayrros' },
  { key: 'Descartes Labs',             searchTerm: 'Descartes Labs' },
  { key: 'Overstory',                  searchTerm: 'Overstory' },
  { key: 'Ursa Space Systems',         searchTerm: 'Ursa Space' },

  // Climate & weather tech
  { key: 'Jupiter Intel',              searchTerm: 'Jupiter Intelligence' },
  { key: 'Tomorrow.io',                searchTerm: 'Tomorrow.io' },
  { key: 'One Concern',                searchTerm: 'One Concern' },
  { key: 'WattTime',                   searchTerm: 'WattTime' },
  { key: 'Zesty.ai',                   searchTerm: 'Zesty.ai' },
  { key: 'Verisk',                     searchTerm: 'Verisk' },
  { key: 'KatRisk',                    searchTerm: 'KatRisk' },

  // Aerospace & defense
  { key: 'Boeing',                     searchTerm: 'Boeing' },
  { key: 'Lockheed Martin',            searchTerm: 'Lockheed Martin' },
  { key: 'Leidos',                     searchTerm: 'Leidos' },
  { key: 'The MITRE Corporation',      searchTerm: 'MITRE' },
  { key: 'RTX',                        searchTerm: 'Raytheon' },
  { key: 'BAE Systems',                searchTerm: 'BAE Systems' },

  // Big tech
  { key: 'Google',                     searchTerm: 'Google' },
  { key: 'Microsoft',                  searchTerm: 'Microsoft' },
  { key: 'Amazon',                     searchTerm: 'Amazon' },
  { key: 'Apple',                      searchTerm: 'Apple' },
  { key: 'NVIDIA',                     searchTerm: 'NVIDIA' },
  { key: 'Meta',                       searchTerm: 'Meta' },
  { key: 'IBM Research',               searchTerm: 'IBM Research' },
  { key: 'Esri',                       searchTerm: 'Esri' },

  // Finance & risk
  { key: 'Munich Re',                  searchTerm: 'Munich Re' },
  { key: 'Swiss Re',                   searchTerm: 'Swiss Re' },
  { key: 'Goldman Sachs',              searchTerm: 'Goldman Sachs' },
  { key: 'JP Morgan',                  searchTerm: 'JPMorgan' },
  { key: 'S&P Global',                 searchTerm: 'S&P Global' },
  { key: "Moody's",                    searchTerm: "Moody's" },
  { key: 'Chubb',                      searchTerm: 'Chubb' },

  // Consulting
  { key: 'Deloitte & Touche, LLP',     searchTerm: 'Deloitte' },
  { key: 'KPMG',                       searchTerm: 'KPMG' },
  { key: 'PwC',                        searchTerm: 'PwC' },
  { key: 'Boston Consulting Group',    searchTerm: 'Boston Consulting Group' },

  // Environment & NGO
  { key: 'Environmental Defense Fund', searchTerm: 'Environmental Defense Fund' },
  { key: 'World Resources Institute (WRI)', searchTerm: 'World Resources Institute' },
  { key: 'Rocky Mountain Institute (RMI)', searchTerm: 'Rocky Mountain Institute' },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

function serperSearch(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ q: query, num: 10 });
    const req = https.request({
      hostname: 'google.serper.dev',
      path: '/search',
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function isLikelyAlumni(item) {
  const title = (item.title || '').toLowerCase();
  const snippet = (item.snippet || '').toLowerCase();
  const combined = title + ' ' + snippet;

  // Filter: JPL mentioned via a program/educational reference, not employment
  if (/program\s+through\s+(nasa\s+)?jet propulsion/.test(combined)) return false;

  // Filter: title shows JPL as current employer
  if (/\bat\s+(nasa\s+)?jet propulsion/.test(title)) return false;
  if (/^(nasa\s+)?jet propulsion laboratory/.test(title.trim())) return false;
  if (/^jpl\s*\(/.test(title.trim())) return false;

  // Filter: present-tense self-description of working at JPL
  if (/(i'?m currently|i am a\w*\s+\w+\s+at|where i work).{0,100}jet propulsion/i.test(snippet)) return false;

  // Require positive employment signal: date range or role title near JPL mention
  const jplPos = combined.indexOf('jet propulsion');
  if (jplPos === -1) return false;
  const window = combined.slice(Math.max(0, jplPos - 100), jplPos + 300);

  const hasDate = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}|\d{4}\s*[-–]\s*(?:\d{4}|present)/i.test(window);
  const hasRole = /\b(intern|interned|engineer|scientist|researcher|analyst|fellow|postdoc|developer|graduate|technologist|specialist)\b/i.test(window);
  const hasWorkedAt = /interned?\s+at\s+(the\s+)?(nasa\s+)?jet propulsion|worked\s+at\s+(the\s+)?(nasa\s+)?jet propulsion/i.test(combined);

  return hasDate || hasRole || hasWorkedAt;
}

function parseResult(item, companyKey) {
  // LinkedIn title formats:
  //   "First Last - Title at Company | LinkedIn"
  //   "First Last - Title - Company | LinkedIn"
  const raw = (item.title || '')
    .replace(/ \| LinkedIn$/, '')
    .replace(/ - LinkedIn$/, '');
  const parts = raw.split(' - ');
  const name = parts[0]?.trim() || '';
  const title = parts.slice(1).join(' — ').trim();

  const snippet = (item.snippet || '').replace(/\n/g, ' ').trim();

  return {
    name,
    title,
    linkedin: item.link,
    snippet,
    company: companyKey,
    foundAt: new Date().toISOString().slice(0, 10),
  };
}

async function searchCompany(company) {
  const query = `site:linkedin.com/in "Jet Propulsion Laboratory" "${company.searchTerm}"`;

  process.stdout.write(`  [${company.key}] querying... `);

  const data = await serperSearch(query);

  if (data.error) {
    console.log(`ERROR: ${data.error}`);
    return null;
  }

  const items = (data.organic || [])
    .filter(i => i.link?.includes('linkedin.com/in/'))
    .filter(isLikelyAlumni);
  console.log(`${items.length} results`);
  return items.map(i => parseResult(i, company.key));
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Load existing results — allows incremental re-runs without losing prior data
  let existing = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    try { existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8')).alumni || {}; }
    catch {}
  }

  console.log(`\n[${new Date().toISOString()}] Searching Google for JPL alumni...\n`);
  console.log(`  ${COMPANIES.length} companies × 1 query each = ${COMPANIES.length} credits used\n`);

  const alumni = { ...existing };
  let found = 0;
  let failed = 0;

  for (const company of COMPANIES) {
    try {
      const results = await searchCompany(company);
      if (results !== null) {
        alumni[company.key] = results;
        found += results.length;
      } else {
        failed++;
      }
    } catch (err) {
      console.log(`  [${company.key}] FAILED: ${err.message}`);
      failed++;
    }
    await sleep(DELAY_MS);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    totalFound: found,
    companiesSearched: COMPANIES.length - failed,
    alumni,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\n[${new Date().toISOString()}] Done.`);
  console.log(`  ${found} alumni found across ${COMPANIES.length - failed} companies`);
  if (failed > 0) console.log(`  ${failed} companies failed (API error or quota)`);
  console.log(`  Saved → ${OUTPUT_PATH}\n`);
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
