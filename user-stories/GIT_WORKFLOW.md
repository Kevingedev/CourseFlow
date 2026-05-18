# Git Workflow & Branching Strategy - Course Flow

This document defines the branching strategy and workflow for the project, ensuring consistency and a clean version history.

## 1. Core Branches
- **`main`**: The production-ready branch. Only stable, tested code should be merged here.
- **`develop`**: The main integration branch. All features are merged here first.

## 2. Supporting Branches
### Feature Branches
Used for developing new features based on User Stories.
- **Naming**: `feature/HU-XXX-short-description`
- **Base Branch**: `develop`
- **Merge Back to**: `develop` (via Pull Request)

### Bugfix Branches
Used for fixing bugs found in the `develop` branch.
- **Naming**: `bugfix/short-description`
- **Base Branch**: `develop`

### Hotfix Branches
Used for critical production fixes.
- **Naming**: `hotfix/short-description`
- **Base Branch**: `main`
- **Merge Back to**: `main` and `develop`

## 3. Specific Branches for Current User Stories

| User Story ID | Feature Description | Recommended Branch Name |
| :--- | :--- | :--- |
| **HU-001** | User Registration | `feature/HU-001-user-registration` |
| **HU-002** | Course Catalog View | `feature/HU-002-course-catalog` |
| **HU-003** | Course Applications | `feature/HU-003-course-applications` |
| **HU-004** | Public Information Pages | `feature/HU-004-public-pages` |
| **HU-005** | Admin Access & Role Redirection | `feature/HU-005-admin-access` |
| **HU-006** | Admin Dashboard & Stats Charts | `feature/HU-006-admin-dashboard` |
| **HU-007** | Request Waitlist & Excel Export | `feature/HU-007-requests-excel` |
| **HU-008** | Courses CRUD & Catalog Management | `feature/HU-008-courses-crud` |

## 4. Commit Message Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(HU-001): add registration form components`
- `fix(UI): correct responsive issues on contact page`
- `docs: update rules.md with modular architecture`
- `style: reformat user stories to markdown`

---
*Following this workflow ensures a traceable and organized development process.*
