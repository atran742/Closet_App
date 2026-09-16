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

