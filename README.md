# FastMeal 

### Table of Contents

1. [About The App](#1-about-the-app)
2. [Project Structure](#2-project-structure)
3. [Getting Started](#3-getting-started)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
4. [Environment Variables](#4-environment-variables)
5. [API Overview](#5-api-overview)
6. [Scripts](#6-scripts)

## 1. About The App

Fast meal is a mobile app that helps you cook fast from what you already have at home. List your ingredients (or pick them from your virtual fridge), apply quick filters like "15 min" or "high protein", and get AI-generated recipe ideas with full instructions, nutrition info, substitutions, and tips.

#### Key Features

- **Recipe generation** — Turn ingredients into multiple recipe ideas powered by OpenAI
- **My Fridge** — Track products with quantity, units, and expiration dates; get reminders when items expire
- **Saved recipes** — Bookmark recipes you want to keep
- **Shopping list** — Add missing ingredients from recipes or manually
- **Settings** — Diet & lifestyle filters, fitness mode, gluten-free, dark mode, metric/imperial units
- **Localization** — English and Croatian

#### App Built With

| Layer | Stack |
|-------|-------|
| Frontend (`fast-meal/`) | Expo, React Native, TypeScript, Expo Router, NativeWind, i18next |
| Backend (`meal-backend/`) | Next.js, TypeScript, MongoDB (Mongoose), OpenAI API |

## 2. Project Structure

```
fast-meal/      → Expo mobile app (iOS, Android, web)
meal-backend/   → Next.js API server (runs on port 3001)
```

## 3. Getting Started

### Prerequisites

- Node.js 24 or higher (see `fast-meal/.nvmrc`)
- npm
- MongoDB instance
- OpenAI-compatible API key and base URL
- For mobile development: Expo Go or a dev client; Xcode (iOS) and/or Android Studio (Android) for native builds

### Backend Setup

#### 1. Install dependencies

```bash
cd meal-backend
npm install
```

#### 2. Create environment file

```bash
cp .env.example .env
```

Fill in the required values in `.env`.

#### 3. Run the development server

```bash
npm run dev
```

The API runs at [http://localhost:3001](http://localhost:3001).

### Frontend Setup

#### 1. Install dependencies

```bash
cd fast-meal
npm install
```

#### 2. Create environment file

```bash
cp .env.example .env
```

Set `EXPO_PUBLIC_API_BASE_URL` to your backend URL (e.g. `http://localhost:3001`).

#### 3. Start the Expo dev server

```bash
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## 4. Environment Variables

### Backend (`meal-backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_API_BASE_URL` | Yes | OpenAI API base URL |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `DISABLE_DAILY_GENERATION_LIMIT` | No | Set to `true` to disable the per-device daily recipe limit (useful for local development) |

### Frontend (`fast-meal/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_BASE_URL` | Yes | Backend API URL (e.g. `http://localhost:3001`) |
| `EXPO_PUBLIC_TEST_EXPIRATION_NOTIFICATIONS` | No | Set to `true` to test fridge expiration notifications |

## 5. API Overview

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/generate-recipe` | POST | Generate recipe ideas from ingredients and preferences |
| `/api/fridge-products` | GET, POST, DELETE | Manage fridge inventory per device |
| `/api/recipes` | GET, POST, DELETE | Save and retrieve favorite recipes |
| `/api/devices` | POST | Register device and check daily generation quota |

## 6. Scripts

### Frontend (`fast-meal/`)

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in browser |
| `npm run lint` | Run Biome linter |

### Backend (`meal-backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

[back to top](#FastMeal)
