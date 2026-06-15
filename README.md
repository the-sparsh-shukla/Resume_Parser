# Resume Parser — AI Tool 📄

Built this as **Project 1** for my Pinnacle Labs AI Internship (June 2026).

The idea is simple — paste any resume, and the app uses Claude AI to pull out all the important info (name, skills, experience, contact etc.) and shows it in a clean layout. Also exports to JSON which can be used in HR tools or ATS systems.

---

## What it does

- Paste resume text or upload a `.txt` file
- Sends it to the Claude API
- Extracts: name, contact info, skills, work experience, education, certifications, achievements
- Shows everything in a nice UI with tabs
- Can copy or download the structured JSON

---

## Tech used

- HTML, CSS, JavaScript (no frameworks, kept it simple)
- Anthropic Claude API (`claude-sonnet-4-20250514`)
- Google Fonts (Inter)

I didn't use React or anything like that — wanted to keep it pure JS so the code is easy to read and doesn't need a build step.

---

## How to run it

Just open `index.html` in your browser. No server needed.

```bash
git clone https://github.com/the-sparsh-shukla/resume-parser.git
cd resume-parser
# open index.html in browser
```

If you want a local server:

```bash
python -m http.server 3000
# then go to localhost:3000
```

---

## Setup

You need an Anthropic API key. Get one from [console.anthropic.com](https://console.anthropic.com) (they give free credits).

Paste it in the API key field in the app. It gets saved in your browser's localStorage so you don't have to enter it every time.

> The key never goes to any server other than Anthropic's. This is a purely client-side app.

---

## Project structure

```
resume-parser/
├── index.html       # main page
├── src/
│   ├── app.js       # all the logic — api calls, rendering, tabs etc
│   └── style.css    # styles
└── README.md
```

---

## Screenshots

> (add a screenshot of the app here before posting)

---

## What I learned

- How to use the Anthropic Claude API from a browser
- Prompt engineering — getting Claude to return clean JSON reliably
- Handling API errors (auth errors, rate limits etc)
- CSS Grid for the two-panel layout

---

## Things I'd add if I had more time

- [ ] PDF support (currently only .txt)
- [ ] Side-by-side comparison of two resumes
- [ ] Score the resume against a job description
- [ ] Better mobile UI

---

## License

MIT — feel free to use/modify

---

*Made by Sparsh Shukla · Pinnacle Labs AI Internship 2026*
