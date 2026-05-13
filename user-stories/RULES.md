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
  - `PascalCase` for Vue components and TypeScript classes.
  - `camelCase` for variables, functions, and instances.
  - `kebab-case` for CSS classes and file names (except components).

## 2. Design System & Styling
- **CSS Variables**: All colors, spacing, and typography tokens must be defined as CSS variables (e.g., `--primary-color`, `--font-main`) in a global stylesheet (e.g., `src/assets/main.css`).
- **Dynamic Themes**: The system must allow changing the color palette at any time by simply updating the central variable definitions.
- **Avoid Magic Numbers**: Use predefined tokens for margins, padding, and font sizes.

## 3. Security & Clean Code
- **No Hardcoding**: 
  - Never hardcode sensitive information (API keys, secrets).
  - Use `.env` files for environment-specific configurations.
  - Avoid hardcoding repetitive values; use constants where appropriate.
- **Best Practices**:
  - Write small, focused, and reusable components.
  - Keep logic out of templates; use computed properties and Composition API hooks.
  - Use TypeScript types and interfaces for all data structures.

## 4. Architecture & Principles
- **DRY (Don't Repeat Yourself)**: Avoid repetitive code. Abstract shared logic into composables or utility functions.
- **SOLID Principles**:
  - **Single Responsibility**: Each component or function should have one clear purpose.
  - **Open/Closed**: Design for extension without needing to modify existing source code.
  - **Liskov Substitution**: Ensure derived classes/types can stand in for their bases.
  - **Interface Segregation**: Keep interfaces small and specific to the client's needs.
  - **Dependency Inversion**: Depend on abstractions (interfaces/types), not on concrete implementations.
- **State Management**: Use **Pinia** for global state management and maintain a clean separation between state and UI.

## 5. Development Workflow
- **Linting & Formatting**: Ensure code passes `pnpm lint` and is formatted with `pnpm format` before committing.
- **Modularity**: Organize the `src` directory logically (components, views, stores, services, utils).

---
*Following these rules ensures the scalability, maintainability, and quality of the Course Flow project.*
