# Closet App

Closet App is a React web app for browsing clothing items, creating outfit combinations, and trying outfits on a model image.

## Features

- Browse tops and bottoms in your closet
- Filter clothing by occasion
- Generate outfit combinations
- Adjust the position and size of tops and bottoms in try-on mode
- Hide garments while editing a look
- Save try-on positions in the browser's local storage

## Requirements

- Node.js 18 or newer
- npm

## Getting started

```bash
cd Closet_App
npm install
```

```bash
npm run dev
```

## Project structure

```text
src/
	App.jsx                 Application routes
	ClosetGrid.jsx          Closet browsing interface
	MainPage.jsx            Outfit generation interface
	Tryonoverlay.jsx        Try-on positioning interface
	data/closetItems.js     Closet item data
	lib/                    Outfit, color, and pose utilities
```

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow that builds and deploys the app whenever changes are pushed to `main`.

1. Push the project to GitHub.
2. In the repository, open **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Open the **Actions** tab to monitor the deployment.

The published app will be available at:

```text
https://atran742.github.io/Closet_App/
```

The app uses hash-based routes, so the closet and outfit generator continue to work when their URLs are refreshed on GitHub Pages.