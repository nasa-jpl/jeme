#!/usr/bin/env node
// Fetches news relevant to NASA earth science, commercial earth observation,
// and PSE sectors (insurance, finance, carbon, agriculture, water, energy).
//
// Sources:
//   1. NASA Earth Observatory (science.nasa.gov) — earth/climate imagery & stories
//   2. NASA News Releases — filtered to earth science topics
//   3. ScienceDaily Earth & Climate — earth/ocean/atmosphere science
//   4. EOS / AGU — geoscience research news
//   5. The Guardian — sector news (carbon, climate finance, insurance) in science/environment/business sections
//
// Usage:  node scripts/fetch_guardian_news.js
// Output: public/guardian_news.json

const fs = require('fs');
const path = require('path');
const https = require('https');

const GUARDIAN_KEY = 'c707fd89-3e57-4acd-abe0-8070dbda3cf8';
const OUTPUT_PATH = path.join(__dirname, '../public/guardian_news.json');

const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 31);
const FROM = fromDate.toISOString().slice(0, 10);

// RSS feeds — no API key required
const RSS_FEEDS = [
  { url: 'https://science.nasa.gov/feed/?science_org=19791%2C22453', source: 'NASA Earth Observatory', isNASA: true },
  { url: 'https://www.nasa.gov/news-release/feed/',                  source: 'NASA',                  isNASA: true },
  { url: 'https://www.sciencedaily.com/rss/earth_climate.xml',       source: 'ScienceDaily',          isNASA: false },
  { url: 'https://eos.org/feed',                                     source: 'Eos / AGU',             isNASA: false },
];

// Guardian: only sector-focused queries where the Guardian has real coverage
// Restricted to science|environment|technology|us-news|business sections
const GUARDIAN_SECTIONS = 'science|environment|technology|us-news|business';
const GUARDIAN_QUERIES = [
  // Earth science & NASA
  '"carbon credit" OR "carbon market" OR "voluntary carbon" ("United States" OR satellite OR NASA)',
  '"climate risk" (insurance OR reinsurance OR "parametric") ("satellite data" OR "earth observation" OR NASA)',
  '"climate finance" OR "green bond" OR "ESG" "United States" (climate OR NASA OR satellite)',
  'NASA "earth observation" OR "JPL" (flood OR drought OR "sea level" OR groundwater OR agriculture) "United States"',
  '"satellite data" OR "earth observation" (agriculture OR "water supply" OR "renewable energy") "United States"',
  // PSE company news in JPL/NASA domains
  '(Planet Labs OR Maxar OR Capella Space OR Spire OR Muon Space) satellite "earth observation"',
  '(BlackRock OR Goldman Sachs OR "JP Morgan" OR Amundi) "climate data" OR "satellite" OR "earth observation" OR "ESG"',
  '(Verisk OR "Munich Re" OR "Swiss Re" OR Chubb OR Aon) "climate risk" OR "natural disaster" OR "flood" OR "satellite"',
  '(Microsoft OR Google OR Amazon OR NVIDIA) "climate" OR "earth observation" OR "satellite data" OR "carbon"',
  '("Carbon Mapper" OR "GHGSat" OR Kayrros OR "Descartes Labs") methane OR carbon OR emissions OR satellite',
  '("Jupiter Intelligence" OR "Tomorrow.io" OR "One Concern") climate OR weather OR flood OR risk',
  '(Boeing OR "Lockheed Martin" OR Leidos OR Raytheon) "earth observation" OR "remote sensing" OR "climate"',
  // Additional company-focused queries
  '(AccuWeather OR "The Weather Company" OR Climavision) "extreme weather" OR "natural disaster" OR "climate risk"',
  '(Bloomberg OR "S&P Global" OR "Moody\'s") "climate risk" OR "ESG" OR "carbon" OR "sustainable finance"',
  '(Deloitte OR KPMG OR PwC OR "Boston Consulting Group") "climate" OR "ESG" OR "net zero" OR "carbon"',
  '(Stripe OR NCX OR "Carbon Direct" OR Verra OR "Gold Standard") "carbon credit" OR "carbon offset" OR "voluntary carbon"',
  '(Esri OR "Planet Labs" OR Maxar) wildfire OR flood OR drought OR "crop monitoring" OR "precision agriculture"',
  '("ICEYE" OR "BlackSky" OR "Satelligence" OR "Overstory") satellite OR "earth observation" OR "land use" OR deforestation',
  '(WattTime OR "Energy Vault" OR "Sunrun") "renewable energy" OR "clean energy" OR "grid" OR "carbon"',
  '("Environmental Defense Fund" OR "World Resources Institute" OR "Rocky Mountain Institute") satellite OR "earth observation" OR NASA',
];

// ─── taggers ──────────────────────────────────────────────────────────────────

const autoTagModels = (text) => {
  const t = text.toLowerCase();
  const tags = [];
  if (/\bgrace\b|groundwater storage|aquifer depletion|gravity recovery|terrestrial water storage/.test(t)) tags.push('GRACE');
  if (/\bswot\b|surface water(?! quality)|river height|lake level|ocean topograph/.test(t)) tags.push('SWOT');
  if (/streamflow|flood routing|river discharge|hydrograph|watershed model/.test(t)) tags.push('RAPID');
  if (/\bcms.flux\b|co2 flux|carbon flux|greenhouse gas emission budget/.test(t)) tags.push('CMS-Flux');
  if (/\bcardamom\b|soil carbon|ecosystem carbon|terrestrial carbon cycle/.test(t)) tags.push('CARDAMOM');
  if (/\bissm\b|ice sheet model|sea.level rise|glacier melt|greenland ice sheet|antarctic ice sheet/.test(t)) tags.push('ISSM');
  if (/\becco\b|ocean reanalysis|ocean heat content|sea surface salinity/.test(t)) tags.push('ECCO');
  if (/\btropess\b|tropospheric emission|ozone column|methane retrieval/.test(t)) tags.push('TROPESS');
  if (/\bmomo.chem\b|atmospheric chemistry model/.test(t)) tags.push('MOMO-CHEM');
  return tags;
};

const autoTagSectors = (text) => {
  const t = text.toLowerCase();
  const tags = [];
  if (/\binsur|parametric risk|catastrophe bond|reinsur|underwr|nat cat|climate risk/.test(t)) tags.push('Insurance');
  if (/\besg\b|climate finance|green bond|asset manag|pension fund|blackrock|amundi|sustainable invest/.test(t)) tags.push('Finance');
  if (/\bfarm\b|crop yield|agricultur|irrigation|harvest|precision ag|food security|agronomy/.test(t)) tags.push('Agriculture');
  if (/offshore wind|wind energy|solar farm|renewable energy|power grid|clean energy/.test(t)) tags.push('Energy');
  if (/water utility|water supply|water scarcity|groundwater manag|drought manag|water resource/.test(t)) tags.push('Water Management');
  if (/carbon credit|carbon market|carbon offset|nature.based solution|forest carbon|blue carbon|voluntary carbon/.test(t)) tags.push('Carbon & Conservation');
  if (/sea.level rise|coastal flood|storm surge|coastal erosion|coastal inundation/.test(t)) tags.push('Coastal & Sea Level');
  return tags;
};

// Modern earth/climate science — excludes paleoclimate/archaeology/geology oddities
const EARTH_SCIENCE_RE = /satellite|earth observation|climate change|global warming|sea level rise|flood|drought|groundwater|ice sheet|glacier|ocean current|carbon flux|wildfire|hurricane|tropical storm|precipitation|watershed|sea ice|methane emission|greenhouse gas|deforestation|permafrost|remote sensing|land use change|ozone|aerosol|air quality|water resource/;

// Topics outside PSE scope — archaeology, paleoclimate, deep geology, marine biology
const NOT_RELEVANT_RE = /\bancient\b|prehistoric|fossil|paleontol|archaeolog|neanderthal|extinct species|evolution|cave|stone age|dinosaur|roman empire|medieval|viking|solar storm|earthquake|volcano|magma|seismic|coral reef medicine|drug discovery|deep.sea creature|new species|marine biolog|genetics|dna|genome|surgery|cancer|biology|medicine|health|spider|insect|plant species|invasive species|supervolcano|neanderthal|ice age human|ancient tree|squid/;

const isRelevant = (article) => {
  const tagged = article.models.length > 0 || article.sectors.length > 0;
  const combined = (article.title + ' ' + article.summary).toLowerCase();
  // Drop clearly off-topic content regardless of source
  if (NOT_RELEVANT_RE.test(combined)) return false;
  // NASA sources: keep if modern earth science topic
  if (article._isNASA) return tagged || EARTH_SCIENCE_RE.test(combined);
  // ScienceDaily/EOS: must match earth science keywords
  if (article._isRSS) return tagged || EARTH_SCIENCE_RE.test(combined);
  // Guardian: keep if PSE company mentioned with climate/earth science context,
  // OR if sector/model tagged with an earth-science anchor.
  const hasEarthScienceAnchor = /\bnasa\b|\bjpl\b|satellite|earth observation|climate data|climate science|remote sensing|climate risk|net.?zero|carbon|greenhouse|renewable energy|flood|drought|wildfire|sea.level|deforestation/.test(combined);
  const hasPSECompany = /planet labs|maxar|capella space|spire|muon space|carbon mapper|ghgsat|kayrros|descartes labs|jupiter intelligence|tomorrow\.io|one concern|blackrock|goldman sachs|jp morgan|amundi|verisk|munich re|swiss re|chubb|microsoft|google|amazon|nvidia|boeing|lockheed martin|leidos|raytheon|accuweather|bloomberg|s&p global|moody'?s|deloitte|kpmg|\bpwc\b|boston consulting|stripe|ncx|carbon direct|verra|\besri\b|iceye|blacksky|satelligence|overstory|watttime|environmental defense fund|world resources institute|rocky mountain institute/.test(combined);
  // Pass if: strong PSE company mention + earth science context, OR tagged + earth anchor
  if (hasPSECompany && hasEarthScienceAnchor) return true;
  return tagged && hasEarthScienceAnchor;
};

// ─── http helpers ─────────────────────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'JPL-PSE-Dashboard/1.0' } }, res => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function fetchJson(url) {
  return fetchText(url).then(text => {
    try { return JSON.parse(text); }
    catch (e) { throw new Error(`JSON parse: ${e.message}`); }
  });
}

// ─── RSS parser ───────────────────────────────────────────────────────────────

function parseRSS(xml, sourceName, isNASA) {
  const articles = [];
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const item of items) {
    const cdata = s => s ? s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') : '';
    const tag = name => {
      const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`));
      return m ? cdata(m[1]).trim() : '';
    };

    const title = tag('title').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const link  = tag('link') || tag('guid');
    const desc  = tag('description').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    const pub   = tag('pubDate');

    if (!title || !link) continue;

    let date = '';
    if (pub) { try { date = new Date(pub).toISOString().slice(0, 10); } catch {} }
    if (date && date < FROM) continue;

    const text = (title + ' ' + desc).toLowerCase();
    articles.push({
      url: link,
      title,
      summary: desc.slice(0, 400),
      section: sourceName,
      source: sourceName,
      date,
      models: autoTagModels(text),
      sectors: autoTagSectors(text),
      _isNASA: isNASA,
      _isRSS: true,
    });
  }
  return articles;
}

async function fetchRSS({ url, source, isNASA }) {
  process.stdout.write(`  [${source}] ... `);
  try {
    const xml = await fetchText(url);
    const items = parseRSS(xml, source, isNASA);
    console.log(`${items.length} items (within ${FROM})`);
    return items;
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
    return [];
  }
}

// ─── Guardian ─────────────────────────────────────────────────────────────────

async function fetchGuardian(query) {
  const url =
    `https://content.guardianapis.com/search` +
    `?q=${encodeURIComponent(query)}` +
    `&api-key=${GUARDIAN_KEY}` +
    `&section=${GUARDIAN_SECTIONS}` +
    `&show-fields=trailText` +
    `&order-by=newest` +
    `&page-size=15` +
    `&from-date=${FROM}`;

  process.stdout.write(`  "${query.slice(0, 65)}..." `);
  let data;
  try { data = await fetchJson(url); }
  catch (err) { console.log(`FAILED: ${err.message}`); return []; }
  if (data.response?.status === 'error') {
    console.log(`API error: ${data.response.message}`);
    return [];
  }
  const results = data.response?.results || [];
  console.log(`${results.length} results`);
  return results.map(a => {
    const text = (a.webTitle + ' ' + (a.fields?.trailText || '')).toLowerCase();
    return {
      url: a.webUrl,
      title: a.webTitle,
      summary: a.fields?.trailText || '',
      section: a.sectionName,
      source: 'The Guardian',
      date: a.webPublicationDate?.slice(0, 10) || '',
      models: autoTagModels(text),
      sectors: autoTagSectors(text),
      _isNASA: false,
      _isRSS: false,
    };
  });
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n[${new Date().toISOString()}] Fetching news since ${FROM}...\n`);

  const seen = new Set();
  let all = [];

  // 1. RSS feeds (no quota cost)
  console.log('RSS feeds:');
  for (const feed of RSS_FEEDS) {
    const items = await fetchRSS(feed);
    for (const a of items) {
      if (!seen.has(a.url)) { seen.add(a.url); all.push(a); }
    }
  }

  // 2. Guardian — sector-focused queries
  console.log('\nThe Guardian:');
  for (const q of GUARDIAN_QUERIES) {
    const items = await fetchGuardian(q);
    for (const a of items) {
      if (!seen.has(a.url)) { seen.add(a.url); all.push(a); }
    }
  }

  // 3. Relevance gate
  const before = all.length;
  const kept = all.filter(isRelevant);
  console.log(`\nRelevance filter: ${before} → ${kept.length} articles kept`);

  // Strip internal flags before saving
  const articles = kept.map(({ _isNASA, _isRSS, ...rest }) => rest);
  articles.sort((a, b) => b.date.localeCompare(a.date));

  const output = {
    fetchedAt: new Date().toISOString(),
    fromDate: FROM,
    count: articles.length,
    articles,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`[${new Date().toISOString()}] Saved ${articles.length} articles → ${OUTPUT_PATH}\n`);
}

main().catch(err => {
  console.error(`[${new Date().toISOString()}] FATAL:`, err.message);
  process.exit(1);
});
