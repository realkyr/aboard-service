# Data Wow A Board Assignment Backend (NestJS)

This repository contains the backend service for the Data Wow assignment, built with [NestJS](https://nestjs.com/). The project utilizes a Git submodule and several useful scripts for development and production workflows.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- **NestJS Framework**: Modular and scalable backend service.
- **Submodule Integration**: Includes a shared types submodule for reusable type definitions.
- **Development Utilities**: Preconfigured with ESLint, Prettier, and Jest for linting, formatting, and testing.
- **External Libraries**: Integrates Firebase Admin, Axios, and Meilisearch for extended functionality.

---

## Prerequisites

Ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org/) (v16+)
- [Yarn](https://classic.yarnpkg.com/lang/en/) for package management
- [Git](https://git-scm.com/) for version control

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/realkyr/<REPOSITORY_NAME>.git
   ```

2. **Initialize and update the submodule**:
   ```bash
   git submodule update --init --recursive
   ```

3. **Install dependencies**:
   ```bash
   yarn install
   ```

4. **Set up environment variables**:  
   Copy the provided `.env` file and configure it with your environment-specific values.

   ```bash
   cp .env.example .env
   ```
5. **Get Google Service Account Key**:
   Download the service account key from the Firebase Console and save it as `src/config/service-account.json`.
---

## Running the App

### Development

Start the application in development mode with hot-reload:

```bash
yarn dev
```

The application will run on the default NestJS port (e.g., `http://localhost:3000`).

### Production

1. **Build the project**:
   ```bash
   yarn build
   ```

2. **Run the production build**:
   ```bash
   yarn start:prod
   ```

---

## Scripts

The following scripts are available in the `package.json`:

- `yarn dev`: Start the app in development mode with hot-reload.
- `yarn build`: Compile the project to the `dist` directory.
- `yarn start`: Start the app in standard mode.
- `yarn start:prod`: Start the production build.
- `yarn lint`: Run ESLint to analyze and fix code.
- `yarn test`: Run unit tests with Jest.
- `yarn test:e2e`: Run end-to-end tests.

---

## Project Structure

```
.
├── src
│   ├── app.module.ts          # Root application module
│   ├── main.ts                # Application entry point
│   ├── modules                # Feature modules
│   │   ├── <feature>          # Feature-specific code
│   ├── ...
│   ├── config                 # Configuration files
│   │   ├── service-account.json  # Firebase service account key
│   └── common                 # Shared utilities and constants
├── shared-types               # Submodule for reusable types
├── .env                       # Environment variables
├── package.json               # Project metadata and scripts
├── tsconfig.json              # TypeScript configuration
├── README.md                  # Documentation
└── yarn.lock                  # Yarn dependency lockfile
```

---

## License

This project is licensed under the [MIT License](./LICENSE). You are free to use, modify, and distribute this project as per the license.

---

If you have any questions or encounter issues, please create an issue in this repository or contact the maintainers.
```