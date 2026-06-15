# Resume Parser

A lightweight, client-side resume parsing app that turns pasted text or `.txt` uploads into structured candidate data using Anthropic Claude.

## Overview

This project was built during my Pinnacle Labs AI Internship and focuses on a simple workflow: paste resume text, extract useful fields, and review the result in a clean tabbed interface. The output can be copied as JSON or downloaded for reuse in HR or ATS tools.

## Features

- Accepts pasted resume text or `.txt` uploads
- Sends content to the Claude API for structured extraction
- Extracts name, contact details, summary, skills, experience, education, certifications, and achievements
- Displays results in a clean UI with separate tabs
- Lets you copy or download the parsed JSON

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- Anthropic Claude API (`claude-sonnet-4-20250514`)
- Google Fonts (`Inter`)

The app is intentionally framework-free so it stays easy to read, easy to run, and does not require a build step.

## Run Locally

Open `index.html` directly in your browser, or serve the folder with any static server.

```bash
git clone https://github.com/the-sparsh-shukla/Resume_Parser.git
cd Resume_Parser
```

If you want a local server:

```bash
python -m http.server 3000
```

Then open `http://localhost:3000`.

## Setup

1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com).
2. Paste the key into the app.
3. Parse a resume and review the generated JSON.

The key is stored only in your browser and is never sent to this repository.

## GitHub Pages

This repository includes a GitHub Pages workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

To publish the site:

1. Push changes to the `main` branch.
2. Open repository settings on GitHub.
3. Go to Pages and select GitHub Actions as the source.

After deployment, GitHub will provide the public site URL.

## Project Structure

```
Resume_Parser/
├── index.html
├── README.md
├── src/
│   ├── app.js
│   └── style.css
└── .gitignore
```

## Notes

- The app currently supports `.txt` input only.
- All parsing happens in the browser after the Claude API request.
- The UI is designed to be simple, readable, and easy to extend.

## License

MIT

## Author

Sparsh Shukla
