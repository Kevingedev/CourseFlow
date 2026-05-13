# Project Rules & Best Practices - Course Flow

This document outlines the mandatory rules and standards to follow during the development of the **Course Flow** project.

## 1. Language & Naming
- **Strict English**: All code components must be written in English. This includes:
  - Variable and function names.
  - Class and component names.
  - Comments and documentation.
  - Commit messages.
  - Branch names.
- **Naming Conventions**:
  - `PascalCase`: Vue components and TypeScript classes.
  - `camelCase`: Variables, functions, and instances.
  - `kebab-case`: CSS classes and file names (except components).

## 2. Modular Architecture
- **Layered Structure**: The project must follow a modular and layered architecture within the `src` directory:
  - `views/`: Page-level components.
  - `components/`: Reusable UI elements.
  - `services/`: Logic for API calls and external data handling.
  - `stores/`: Global state management using **Pinia**.
  - `composables/`: Reusable stateful logic hooks.
  - `utils/`: Pure utility functions.
  - `types/` or `interfaces/`: TypeScript definitions.
- **Module Separation**: Features should be grouped logically to allow independent development and testing.

## 3. Pinia & Composables
- **State Management (Pinia)**:
  - Use Pinia for state that needs to be shared across multiple components or views (e.g., authentication, user profile, course catalog).
  - Keep stores focused and modular (e.g., `useAuthStore`, `useCourseStore`).
- **Logic Reuse (Composables)**:
  - Extract complex logic, stateful patterns, or side effects into **Composables**.
  - Use composables for local component logic that can be reused (e.g., `usePagination`, `useFormValidation`).
  - Favor Composition API over Options API.

## 4. Design System & Styling
- **CSS Variables**: All colors, spacing, and typography tokens must be defined as CSS variables (e.g., `--primary-color`, `--font-main`) in a global stylesheet.
- **Dynamic Themes**: The system must allow changing the color palette at any time by simply updating the central variable definitions.
- **Avoid Magic Numbers**: Use predefined tokens for margins, padding, and font sizes.

## 5. Security & Clean Code
- **No Hardcoding**: 
  - Never hardcode sensitive information (API keys, secrets).
  - Use `.env` files for environment-specific configurations.
  - Avoid hardcoding repetitive values; use constants where appropriate.
- **Best Practices**:
  - Write small, focused, and reusable components.
  - Keep logic out of templates; use computed properties.
  - Use TypeScript types and interfaces for all data structures.

## 6. Architecture & Principles
- **DRY (Don't Repeat Yourself)**: Avoid repetitive code. Abstract shared logic into composables or utils.
- **SOLID Principles**:
  - **Single Responsibility**: Each module, component, or function should have one clear purpose.
  - **Open/Closed**: Design for extension without modification.
  - **Liskov Substitution**: Derived types must be substitutable for their base types.
  - **Interface Segregation**: Clients should not be forced to depend on methods they do not use.
  - **Dependency Inversion**: High-level modules should not depend on low-level modules; both should depend on abstractions.

## 7. Development Workflow
- **Linting & Formatting**: Ensure code passes `pnpm lint` and is formatted with `pnpm format` before committing.
- **Modularity**: Maintain a clean and organized directory structure.

---
*Following these rules ensures the scalability, maintainability, and quality of the Course Flow project.*
