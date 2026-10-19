# Contributing to Hikarii

Thank you for your interest in contributing to **Hikarii**! We welcome contributions from developers worldwide to build an institutional-grade, high-clarity productivity platform.

This document outlines our engineering standards, collaborative code review workflow, testing policies, and release cadence to ensure long-term maintainability and high code quality.

---

## 1. Collaborative Development & Multi-Author Workflow

To ensure multi-perspective quality control, maintainability, and bus-factor resilience, all substantive changes must follow a peer-reviewed workflow:

1. **Issues First**: Every non-trivial fix or feature begins with an issue detailing the context, proposed solution, and acceptance criteria.
2. **Feature Branches**: Branch from `main` using descriptive naming:
   - `feat/short-description`
   - `fix/issue-description`
   - `refactor/component-name`
   - `test/suite-name`
3. **Draft PRs Early**: Open a Draft Pull Request early so teammates can provide architectural feedback before implementation finishes.
4. **Peer Review Requirement**:
   - Every PR requires at least one approving review from a peer maintainer before merge.
   - Self-merges without review are restricted by branch protection rules on `main`.
   - Reviewers verify architectural fit, test quality, type safety, and component size boundaries.

---

## 2. Commit Standards: Focused, Atomic, and Tested

Value scales with how cleanly engineering history can be understood and audited. We adhere strictly to **atomic commits accompanied by tests**:

- **Conventional Commits**: Use semantic prefixes:
  - `feat(...)`: A new user-facing capability or API endpoint
  - `fix(...)`: A bug fix
  - `test(...)`: Adding or updating test suites
  - `refactor(...)`: Code restructuring without functional behavior changes
  - `ci(...)`: Workflow, automation, or audit gate changes
  - `docs(...)`: Documentation and onboarding updates
- **Atomic Commits**: Each commit must represent a single logical change. Avoid bulk commits that mix refactors, feature code, and formatting.
- **Ship Features with Tests**: Every new feature, endpoint, or bug fix must land in the same commit with the tests proving that behavior. Test-less feature commits are rejected by CI.

---

## 3. Architecture & Code Cleanliness Standards

- **Component Size Thresholds**:
  - Keep page components under **500 LOC**.
  - Keep complex management components under **400 LOC**.
  - Extract distinct functional blocks into modular subcomponents (e.g., `src/components/<domain>/`) and custom hooks (e.g., `src/hooks/use<Feature>.ts`).
- **Strict Typing**:
  - Zero TypeScript errors (`npx tsc --noEmit` must exit 0).
  - Explicit interfaces for all store actions, props, and API payloads; avoid `any`.
- **Runtime Validation**:
  - All external inputs (request bodies, query params, environment variables) must be validated using Zod schemas (`src/utils/validationSchemas.ts`, `server/src/config/env.schema.ts`).

---

## 4. Testing & Coverage Policy

Hikarii enforces Vitest-powered automated testing across both client and server:

- **Coverage Gates**: Overall statement, line, and function coverage must exceed the CI threshold (**40%**):
  ```bash
  npm run test:coverage
  ```
- **What Requires Tests**:
  - **Controllers & Services**: All business logic in `server/src/services/` and `server/src/controllers/` must have unit tests with mocked Prisma/clients.
  - **Zustand Stores**: State mutations, computed values, and API integrations in `src/stores/`.
  - **Utility Functions & Parsers**: Schemas, NLP parsers, and financial calculators in `src/utils/`.
  - **Extracted Components & Hooks**: Custom hooks (`src/hooks/`) and extracted UI elements (`src/components/`).

---

## 5. Security Hygiene

- **Dependency Auditing**: The repository enforces a high-severity dependency audit in CI:
  ```bash
  npm audit --audit-level=high --omit=dev
  ```
  Vulnerabilities in production dependencies block PR merges. Use `package.json` `overrides` or update upstream packages to maintain zero high-severity production vulnerabilities.
- **Secrets Management**: Never commit credentials, JWT secrets, or API keys. Always consult `.env.example` when introducing new environment configuration variables.

---

## 6. Pre-Commit Verification Checklist

Before submitting a Pull Request, run the local verification suite:

```bash
# 1. Typecheck client and server
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Unit tests with coverage
npm run test:coverage

# 4. Dependency security audit
npm audit --audit-level=high --omit=dev

# 5. Production build validation
npm run build
```

---

## 7. Versioning & Release Milestones

Hikarii uses [Semantic Versioning (SemVer)](https://semver.org/):

- `vMAJOR.MINOR.PATCH` (e.g., `v1.0.0`, `v1.1.0`, `v1.2.0`).
- Releases are tagged as annotated Git tags:
  ```bash
  git tag -a v1.1.0 -m "Release v1.1.0: Core service tests, runtime schema validation, security audit gate"
  git push origin v1.1.0
  ```
- Each release milestone notes all resolved issues, new tests added, and architectural improvements.
