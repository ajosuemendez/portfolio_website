# Agent Guide

## Project overview

- This repository contains a personal portfolio website. The frontend is an Angular 19 standalone application in `frontend/`.
- Angular starts from `frontend/src/main.ts`; `frontend/src/app/app.routes.ts` defines the routes and lazy-loads the home, about (`/me`), contact (`/email`), work, and CV pages.
- Shared UI is organized under `frontend/src/app/layout/`, `components/`, and `services/`. Static images, fonts, and the CV are under `frontend/src/assets/`.
- `frontend/Dockerfile` builds the frontend development image. The root `docker-compose.yml` exposes the Angular dev server on host port `4200` and mounts the frontend source for live editing.
- `portfolio_website.sln` references a .NET project at `backend/src/SimpleServer.csproj`.

## Developer-owned testing and execution

The repository owner is the developer and is the only person responsible for running and testing this project. Agents must not install, execute, or launch anything.

- Do not run shell commands, scripts, package managers, compilers, linters, tests, or application code.
- Do not run Docker or Docker Compose commands; do not build images, create/start/stop containers, or validate the Compose configuration by executing tools.
- Do not install or update dependencies, tools, or packages, either on the host or in a container. Do not modify dependency lockfiles unless explicitly asked.
- Do not make network requests or perform other actions that execute project code.
- Limit work to reading and editing source/configuration files. Report any checks that the developer should perform instead of performing them.
- The developer is the main tester and decides when and how to run the project. Never claim that tests or runtime validation passed unless the developer reports that they did.

## Change guidance

- Follow the existing Angular standalone-component structure and keep a component's TypeScript, HTML, and CSS together under `frontend/src/app/`.
- Keep Docker development behavior in `docker-compose.yml` and `frontend/Dockerfile`. Avoid runtime dependency installation; dependencies are installed as part of the image build.
- Keep changes focused on the requested work and call out any relevant issue noticed but not addressed.
