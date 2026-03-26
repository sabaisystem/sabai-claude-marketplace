# Sabai DocuSign — Implementation Plan

## Context

- **Linear Project**: [DocuSign](https://linear.app/sabaisystem/project/docusign-1d42fd80d156) — Q2 2026
- **Branch**: `feature/sabai-docusign`
- **Target**: Claude CoWork plugin (skills + commands + MCP server)
- **Auth**: JWT Grant (not CoWork connector) — supports multiple DocuSign accounts

## Scope: Phase 1 + Phase 2

### Phase 1: Scaffold + Skill (SCM-196, SCM-197)

| # | Task | Ticket | Status |
|---|------|--------|--------|
| 1 | Plugin directory structure | SCM-196 | Done |
| 2 | plugin.json manifest | SCM-196 | Done |
| 3 | MCP server scaffold (index.ts) | SCM-196 | Done |
| 4 | JWT Grant auth module (auth.ts) | SCM-196 | Done |
| 5 | Multi-account manager (account-manager.ts) | SCM-196 | Done |
| 6 | DocuSign REST API client (docusign-client.ts) | SCM-196 | Done |
| 7 | startup.sh + package.json + tsconfig | SCM-196 | Done |
| 8 | `docusign-agreements` skill (SKILL.md) | SCM-197 | Done |

### Phase 2: Commands (SCM-198, SCM-199)

| # | Task | Ticket | Status |
|---|------|--------|--------|
| 9 | `/docusign-status` command | SCM-198 | Done |
| 10 | `/docusign-summary` command | SCM-199 | Done |

### Release Tasks

| # | Task | Status |
|---|------|--------|
| 11 | README.md (plugin template) | Done |
| 12 | CHANGELOG.md | Done |
| 13 | marketplace.json entry | Done |
| 14 | Main README.md table entry | Done |
| 15 | npm install + TypeScript compile | Done |
| 16 | esbuild bundle for CoWork zip | Done |
| 17 | CoWork zip upload test | Done (validated) |

## Architecture

### Auth: JWT Grant (not CoWork connector)

**Why not the connector?** One Claude account needs to manage multiple DocuSign accounts (different orgs, clients, etc.). The CoWork connector binds to a single account.

**How it works:**
1. User creates an Integration Key + RSA keypair in DocuSign Admin (one-time per account)
2. User grants consent via browser URL (one-time)
3. Plugin generates JWT → exchanges for access token (1-hour, auto-refreshed)
4. Multiple account profiles stored in `mcp/config/accounts/*.json`

### MCP Tools

| Tool | Description |
|------|-------------|
| `docusign_list_accounts` | List configured account profiles |
| `docusign_switch_account` | Switch active account |
| `docusign_add_account` | Add a new account profile |
| `docusign_remove_account` | Remove a saved profile |
| `docusign_get_user_info` | Get authenticated user info |
| `docusign_list_envelopes` | List envelopes (status, date, search filters) |
| `docusign_get_envelope` | Get full envelope details |
| `docusign_get_documents` | List documents in an envelope |
| `docusign_get_recipients` | Get recipient signing status |

### File Structure

```
plugins/sabai-docusign/
  .claude-plugin/
    plugin.json
  mcp/
    index.ts          → MCP server, wires all tools
    auth.ts           → JWT Grant token generation + auto-refresh
    account-manager.ts → Multi-account profile CRUD
    docusign-client.ts → DocuSign eSignature REST API wrapper
    config/
      accounts/       → Per-account JSON configs (gitignored)
    startup.sh
    package.json
    tsconfig.json
  skills/
    docusign-agreements/
      SKILL.md        → Domain knowledge for Claude
  commands/
    docusign-status.md
    docusign-summary.md
  README.md
  CHANGELOG.md
  PLAN.md             → This file
```

## Key Decisions

1. **No `docusign-esign` SDK** — uses raw `fetch()` to DocuSign REST API to keep the bundle small
2. **JWT over OAuth Code Grant** — no browser needed after one-time consent
3. **Account profiles on disk** — simpler than a database, works in CoWork sandbox
4. **Skills use `SKILL.md` in subdirectory** — required by CoWork validator (plain .md files in skills/ fail validation)
5. **Commands stay as plain `.md`** — `commands/` directory supports legacy flat file format

## Not in Scope (Future Phases)

- SCM-200: `/docusign-workflow` — Maestro workflow triggers
- SCM-201: `/docusign-remind` — send signature reminders
- SCM-202: `/docusign-report` — activity reports
- SCM-203: Testing + documentation + release
- Creating/sending envelopes (write operations)
- Document PDF downloads
