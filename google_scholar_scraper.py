#!/usr/bin/env python3
"""
Google Scholar Citation Scraper
Uses scholarly library to scrape citations from Google Scholar
WARNING: This is against Google's ToS and may result in IP blocking
"""

import json
import time
import logging
import argparse
from pathlib import Path
from typing import List, Dict, Optional
from scholarly import scholarly, ProxyGenerator
import random

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GoogleScholarScraper:
    """Scraper using Google Scholar via scholarly library"""

    def __init__(self, use_proxy=False):
        """Initialize with optional proxy support"""
        self.use_proxy = use_proxy
        if use_proxy:
            try:
                # Use free proxies (may be slow/unreliable)
                pg = ProxyGenerator()
                success = pg.FreeProxies()
                if success:
                    scholarly.use_proxy(pg)
                    logger.info("Using proxy for Google Scholar")
            except Exception as e:
                logger.warning(f"Could not set up proxy: {e}")

    def search_paper(self, title: str, authors: List[str] = None) -> Optional[Dict]:
        """Search for a paper by title"""
        try:
            # Add random delay to avoid rate limiting
            time.sleep(random.uniform(5, 10))

            search_query = title
            logger.info(f"Searching Google Scholar for: {title[:80]}...")

            # Search for the paper
            search_results = scholarly.search_pubs(search_query)

            # Get first result (most relevant)
            paper = next(search_results, None)

            if paper:
                logger.info(f"Found paper: {paper.get('bib', {}).get('title', 'Unknown')}")
                return paper
            else:
                logger.warning(f"Paper not found: {title}")
                return None

        except StopIteration:
            logger.warning(f"No results for: {title}")
            return None
        except Exception as e:
            logger.error(f"Error searching for '{title}': {e}")
            return None

    def get_citations(self, paper: Dict, max_citations: int = 1000) -> List[Dict]:
        """Get citing papers from Google Scholar"""
        try:
            citations = []

            # Get number of citations
            num_citations = paper.get('num_citations', 0)
            logger.info(f"Paper has {num_citations} citations")

            if num_citations == 0:
                return []

            # Fill the paper object to get citations link
            time.sleep(random.uniform(3, 7))
            filled_paper = scholarly.fill(paper)

            if 'citedby_url' not in filled_paper:
                logger.warning("No citations URL found")
                return []

            # Get citing papers
            logger.info(f"Fetching up to {min(max_citations, num_citations)} citing papers...")

            citing_papers = scholarly.citedby(filled_paper)

            count = 0
            for citing_paper in citing_papers:
                if count >= max_citations:
                    break

                # Add delay to avoid rate limiting
                time.sleep(random.uniform(2, 5))

                try:
                    bib = citing_paper.get('bib', {})

                    citation_entry = {
                        'title': bib.get('title', 'Unknown Title'),
                        'authors': [bib.get('author', 'Unknown')],  # May be comma-separated
                        'year': int(bib.get('pub_year', 0)) if bib.get('pub_year') else None,
                        'venue': bib.get('venue', bib.get('journal', 'Unknown Venue')),
                        'doi': None,  # Google Scholar doesn't always provide DOI
                        'url': citing_paper.get('pub_url'),
                        'abstract': bib.get('abstract'),
                        'citation_count': citing_paper.get('num_citations', 0),
                        'source': 'google_scholar'
                    }

                    citations.append(citation_entry)
                    count += 1

                    if count % 10 == 0:
                        logger.info(f"Collected {count}/{min(max_citations, num_citations)} citations...")

                except Exception as e:
                    logger.error(f"Error processing citing paper: {e}")
                    continue

            logger.info(f"Successfully collected {len(citations)} citations")
            return citations

        except Exception as e:
            logger.error(f"Error getting citations: {e}")
            return []

def scrape_citations(input_file: str, output_file: str, max_citations: int = 1000, use_proxy: bool = False):
    """Main scraping function"""

    # Load team papers
    logger.info(f"Loading team papers from {input_file}")
    with open(input_file, 'r') as f:
        data = json.load(f)

    team_papers = data.get('papers', [])
    logger.info(f"Found {len(team_papers)} team papers")

    # Initialize scraper
    scraper = GoogleScholarScraper(use_proxy=use_proxy)

    # Collect all citations
    all_citations = []
    stats = {
        'total_team_papers': len(team_papers),
        'papers_found': 0,
        'papers_not_found': 0,
        'total_citations': 0,
        'failed_papers': []
    }

    for i, team_paper in enumerate(team_papers, 1):
        title = team_paper.get('title', '')
        authors = team_paper.get('authors', [])

        logger.info(f"\n[{i}/{len(team_papers)}] Processing: {title[:80]}...")

        # Search for paper
        paper = scraper.search_paper(title, authors)

        if paper:
            stats['papers_found'] += 1

            # Get citations
            citations = scraper.get_citations(paper, max_citations)

            # Add metadata to each citation
            for citation in citations:
                citation['citing_team_paper'] = title
                citation['team_paper_doi'] = team_paper.get('doi')
                citation['citation_type'] = 'google_scholar'

            all_citations.extend(citations)
            stats['total_citations'] += len(citations)

        else:
            stats['papers_not_found'] += 1
            stats['failed_papers'].append(title)

    # Save results
    output_data = {
        'scraping_metadata': {
            'scraping_date': '2025-11-12',
            'tool': 'google_scholar_scraper.py',
            'model_name': data.get('model_name', 'Unknown'),
            'api_source': 'google_scholar',
            'note': 'Citations scraped from Google Scholar using scholarly library. May be incomplete due to rate limiting.',
            'statistics': stats
        },
        'citations': all_citations
    }

    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)

    logger.info(f"\n{'='*50}")
    logger.info(f"Saved {len(all_citations)} citations to {output_file}")
    logger.info(f"\n=== Citation Scraping Results ===")
    logger.info(f"Team papers processed: {stats['total_team_papers']}")
    logger.info(f"Papers found: {stats['papers_found']}")
    logger.info(f"Papers not found: {stats['papers_not_found']}")
    logger.info(f"Total citations collected: {stats['total_citations']}")

    if stats['failed_papers']:
        logger.info(f"\nFailed papers:")
        for paper in stats['failed_papers']:
            logger.info(f"  - {paper}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape citations from Google Scholar')
    parser.add_argument('input_file', help='Input JSON file with team papers')
    parser.add_argument('-o', '--output', required=True, help='Output JSON file for citations')
    parser.add_argument('--max-citations', type=int, default=1000, help='Maximum citations per paper')
    parser.add_argument('--use-proxy', action='store_true', help='Use proxy to avoid blocking')

    args = parser.parse_args()

    scrape_citations(args.input_file, args.output, args.max_citations, args.use_proxy)
