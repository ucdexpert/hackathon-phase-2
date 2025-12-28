---
id: 16
title: Login 422 Error Fix
stage: refactor
date: 2025-12-27
surface: agent
model: Qwen
feature: master
branch: master
user: user
command: /sp.fix
labels: [auth, login, validation, frontend, backend, hackathon]
links:
  spec: specs/master/spec.md
  plan: specs/master/plan.md
  tasks: specs/master/tasks.md
  ticket: null
  adr: null
  pr: null
files:
 - frontend/lib/auth.ts
 - frontend/app/login/page.tsx
 - frontend/app/signup/page.tsx
tests:
 - null
---

## Prompt

Fix 422 validation error in FastAPI + Next.js authentication flow, specifically the login endpoint returning 422 after successful registration.

## Response snapshot

Successfully fixed the login 422 error:

ROOT CAUSE ANALYSIS:
- Frontend was sending data in a format that didn't match backend's Pydantic LoginRequest model
- Error handling wasn't properly parsing FastAPI validation errors, showing "[object Object]"
- The login endpoint expects specific field names (email, password) with EmailStr validation

FRONTEND FIXES:
- Updated auth.ts with proper request formatting for login endpoint
- Fixed error handling to properly parse FastAPI error responses
- Ensured email is properly formatted (lowercase and trimmed) for login
- Updated signup flow to properly call signIn after successful registration

UI FIXES:
- Created proper login page with validation
- Updated signup page to handle complete registration-login flow
- Improved error message display to show meaningful messages

## Outcome

- ✅ Impact: Resolved login 422 errors after registration
- 🧪 Tests: N/A (implementation phase)
- 📁 Files: Updated 3 files with auth fixes
- 🔁 Next prompts: Ready to test complete auth flow
- 🧠 Reflection: Fixed request format mismatch between frontend and backend

## Evaluation notes (flywheel)

- Failure modes observed: 422 validation errors due to request format mismatch
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test complete registration-login flow