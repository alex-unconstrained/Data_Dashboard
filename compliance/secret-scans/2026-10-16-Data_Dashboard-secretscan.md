# Secret scan record: Data_Dashboard

| Field | Value |
|---|---|
| Repository | alex-unconstrained/Data_Dashboard (public) |
| Branch scanned | main |
| Commit SHA | 3867bf162c9224812a21ddc9258271b7071c49ec (committed 2026-03-25T20:42:23-05:00) |
| Run identifier | 20261016T004037Z-3867bf1 |
| Scan started / finished (UTC) | 2026-10-16T00:40:37Z / 2026-10-16T00:40:39Z |
| Tracked files scanned | 39 |
| Document generated (UTC) | 2026-10-16T00:51:22Z |
| Reviewer | Alex Johnson (prepared by automated scan, to be confirmed) |

## Tools and versions

- Local scan: detect-secrets 1.5.0 (Yelp; default plugins and filters, `scan --all-files`), run on a shallow clone (`--depth 1`) of the default branch. Scope is the tree at the commit above only; git history was NOT scanned. gitleaks and trufflehog were not installed.
- GitHub secret scanning (API `/secret-scanning/alerts`): NOT AVAILABLE. Private repository on a personal GitHub plan without Advanced Security; API returned 404 "Secret scanning is disabled". No GitHub-side secret alerts exist to report.
- GitHub Dependabot alerts (API `/dependabot/alerts`, all states): enabled. Open by severity band (CVSS): critical 0, high 0, medium 0, low 0. Full list in UC_Vulnerability_Tracker_v1.0_2026-10-16.xlsx.

## Result

detect-secrets reported **1 finding(s)**: 1 open (need reviewer confirmation), 0 provisional false positive (path-based judgement, secret values not inspected).

detect-secrets assigns no severity. Indicative severity by detector type (preparer's classification): High = credential-shaped (AWS key, private key, GitHub token, JWT, basic-auth), Medium = secret keyword, Low = high-entropy string.

| Indicative severity | All findings | Open |
|---|---|---|
| High | 0 | 0 |
| Medium | 1 | 1 |
| Low | 0 | 0 |

## Findings and disposition

Secret values are not recorded. Lines are line numbers within the file.

| File / location | Detector type | Indicative severity | Count | Line(s) | Disposition | Rationale |
|---|---|---|---|---|---|---|
| `generateHash.js` | Secret Keyword | Medium | 1 | 4 | open | requires reviewer triage (values intentionally not inspected or recorded) |

## Notes

- Committed to this repository at `/compliance/secret-scans/2026-10-16-Data_Dashboard-secretscan.md` on 2026-10-16 as evidence for SecComply gap G-05 (retained scan artefact).
- Dispositions are provisional until Alex Johnson confirms them. Status values: open, fixed, false positive.
