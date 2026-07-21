# Ledger Scrape

## Snapshot

- Date: 2025-08
- Role: Engineering
- Duration: 6 weeks
- Domain: Scraping · Finance ops

## Problem

A bookkeeping studio re-typed supplier invoices from 12 vendor portals every month. Errors hit client VAT returns; juniors burned evenings on copy-paste.

## Artistic Intent

Invisible plumbing. The win is a quiet inbox of structured rows, not a flashy dashboard.

## Process

### 1) Question

Which portals are stable enough to automate, and which need human fallback?

### 2) Attempt

Playwright scrapers per vendor with a shared normalize → CSV → Xero draft path.

### 3) Failure

Two vendors changed DOM weekly. Full re-scrapes failed silently; bookkeepers thought data was fresh.

### 4) Revision

Health checks + screenshot diffs on login and table headers. Fail loud into a triage queue instead of empty success.

### 5) Outcome

~70% of monthly invoice volume auto-ingested. Manual hours per client cut roughly in half for the pilot set.

## Reflection

- What this project taught me about my craft: Scrapers need ops, not just selectors.
- What still feels unresolved: Captcha and MFA edges.
- Next experiment I will run: Vendor-agnostic email PDF parse as backup lane.

## Evidence

- Sample normalized invoice rows
- Failure queue mock (placeholder cover)
