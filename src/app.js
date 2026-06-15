// app.js - resume parser main logic
// sparsh shukla - pinnacle labs internship 2026
// started writing this after figuring out the claude api docs

// sample resume to test with
const sampleResume = `Priya Sharma
Full Stack Developer
Email: priya.sharma@gmail.com | Phone: +91-98765-43210
Location: Pune, Maharashtra
LinkedIn: linkedin.com/in/priyasharma

ABOUT
Passionate developer with 4 years of experience building web applications. 
Love working with React and Node.js. Looking for backend-heavy roles.

EXPERIENCE

Senior Software Developer | Infosys, Pune
Jan 2022 - Present
- Leading a team of 5 to build a healthcare platform (50k+ users)
- Cut page load time by 40% using lazy loading and CDN
- Set up CI/CD pipelines with GitHub Actions + Docker

Software Developer | StartupXYZ, Bangalore  
Aug 2020 - Dec 2021
- Built REST APIs with Node.js serving 1M+ requests/month
- Made 3 React dashboards for clients
- Added Stripe payments and JWT auth

SKILLS
JavaScript, TypeScript, Python, React, Next.js, Node.js, Express
PostgreSQL, MongoDB, Redis, Docker, AWS, Git, Tailwind CSS

EDUCATION
B.Tech Computer Science | PICT Pune | 2020 | CGPA: 8.7

CERTIFICATIONS
- AWS Certified Developer Associate (2023)
- Google Cloud Professional (2022)

ACHIEVEMENTS
- Won Smart India Hackathon 2021
- Spoke at ReactIndia 2023`;


// keep parsed result globally so copy/download can use it
let parsedResult = null;


// runs when page loads
window.onload = function() {
  // sample button
  document.getElementById('sampleBtn').onclick = function() {
    document.getElementById('resumeText').value = sampleResume;
  };

  // file upload
  document.getElementById('fileInput').onchange = function(e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(ev) {
      document.getElementById('resumeText').value = ev.target.result;
    };
    reader.readAsText(file);
  };

  // drag and drop on the upload box
  let dropZone = document.getElementById('dropZone');

  dropZone.ondragover = function(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#1a7a52';
    dropZone.style.background = '#f0faf5';
  };

  dropZone.ondragleave = function() {
    dropZone.style.borderColor = '#ccc';
    dropZone.style.background = '';
  };

  dropZone.ondrop = function(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    dropZone.style.background = '';
    let file = e.dataTransfer.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function(ev) {
        document.getElementById('resumeText').value = ev.target.result;
      };
      reader.readAsText(file);
    }
  };

  // main parse button
  document.getElementById('parseBtn').onclick = parseResume;

  // load api key from localstorage if they came back
  let savedKey = localStorage.getItem('apiKey');
  if (savedKey) {
    document.getElementById('apiKey').value = savedKey;
  }
};


// main function - sends resume to claude and gets back structured data
async function parseResume() {
  let resumeText = document.getElementById('resumeText').value.trim();
  let apiKey = document.getElementById('apiKey').value.trim();

  // validation
  if (!resumeText) {
    showError('Please paste a resume or upload a file first.');
    return;
  }

  if (!apiKey) {
    showError('Please enter your Anthropic API key.');
    return;
  }

  // save api key so user doesnt have to type it every time
  localStorage.setItem('apiKey', apiKey);

  // hide error, show loading
  hideError();
  setLoading(true);
  updateLoadingText('Sending to Claude...');

  // build the prompt - took me a while to get this right
  let prompt = `You are a resume parser. Read the resume below carefully and extract all the information.

Return ONLY a JSON object with this structure (no extra text, no code blocks):
{
  "name": "full name",
  "initials": "2-3 uppercase letters like PS or JD",
  "title": "job title or role",
  "email": "email address or null",
  "phone": "phone number or null",
  "location": "city/country or null",
  "linkedin": "linkedin url or null",
  "github": "github url or null",
  "summary": "write a 2 sentence summary of this person in third person",
  "yearsExp": number,
  "skillCount": number,
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "role": "job title",
      "company": "company name",
      "duration": "date range",
      "description": "what they did in 2-3 sentences"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "college name",
      "year": "year or null",
      "grade": "gpa/marks or null"
    }
  ],
  "certifications": ["cert 1", "cert 2"],
  "achievements": ["achievement 1"]
}

If something is not in the resume, use null for strings and empty array [] for lists.

Resume:
${resumeText}`;

  try {
    updateLoadingText('Claude is reading the resume...');

    let response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    // check if request worked
    if (!response.ok) {
      let errData = await response.json();
      let msg = errData?.error?.message || 'API request failed';

      // common errors
      if (response.status === 401) {
        throw new Error('Invalid API key. Double check your key from console.anthropic.com');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Wait a minute and try again.');
      } else {
        throw new Error(msg);
      }
    }

    updateLoadingText('Extracting info...');

    let data = await response.json();
    
    // get the text from response
    let rawText = '';
    for (let block of data.content) {
      if (block.type === 'text') {
        rawText += block.text;
      }
    }

    // sometimes claude adds ```json ``` around it even when told not to
    // so strip that out
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed = JSON.parse(rawText);
    parsedResult = parsed;

    setLoading(false);
    showResults(parsed);

  } catch(err) {
    setLoading(false);
    showError('Error: ' + err.message);
    console.error(err);
  }
}


// renders all the results into the right panel
function showResults(data) {
  // hide empty state, show content
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('resultContent').style.display = 'block';

  // profile header (name + title + summary)
  let initials = data.initials || getInitials(data.name);
  document.getElementById('profileBox').innerHTML = `
    <div class="avatar-circle">${initials}</div>
    <div>
      <div class="profile-name">${safe(data.name) || 'Unknown'}</div>
      <div class="profile-title">${safe(data.title) || ''}</div>
      <div class="profile-summary">${safe(data.summary) || ''}</div>
    </div>
  `;

  // stats row
  document.getElementById('statsRow').innerHTML = `
    <div class="stat-box">
      <div class="stat-num">${data.yearsExp ?? '–'}</div>
      <div class="stat-label">Years Exp</div>
    </div>
    <div class="stat-box">
      <div class="stat-num">${data.skillCount || (data.skills ? data.skills.length : 0)}</div>
      <div class="stat-label">Skills</div>
    </div>
    <div class="stat-box">
      <div class="stat-num">${data.education ? data.education.length : 0}</div>
      <div class="stat-label">Degrees</div>
    </div>
  `;

  // contact tab
  let contactHTML = '';
  let contactFields = [
    ['Email', data.email ? `<a href="mailto:${safe(data.email)}">${safe(data.email)}</a>` : null],
    ['Phone', data.phone ? safe(data.phone) : null],
    ['Location', data.location ? safe(data.location) : null],
    ['LinkedIn', data.linkedin ? `<a href="${fixURL(data.linkedin)}" target="_blank">${safe(data.linkedin)}</a>` : null],
    ['GitHub', data.github ? `<a href="${fixURL(data.github)}" target="_blank">${safe(data.github)}</a>` : null],
  ];

  for (let [key, val] of contactFields) {
    if (val) {
      contactHTML += `
        <div class="info-item">
          <span class="key">${key}</span>
          <span class="val">${val}</span>
        </div>
      `;
    }
  }
  document.getElementById('tab-contact').innerHTML = contactHTML || '<p style="color:#aaa;font-size:13px;padding:10px 0">No contact info found</p>';

  // skills tab
  let skillsHTML = '<div class="skills-list">';
  if (data.skills && data.skills.length > 0) {
    for (let skill of data.skills) {
      skillsHTML += `<span class="skill-pill">${safe(skill)}</span>`;
    }
  } else {
    skillsHTML += '<p style="color:#aaa;font-size:13px">No skills found</p>';
  }
  skillsHTML += '</div>';
  document.getElementById('tab-skills').innerHTML = skillsHTML;

  // experience tab
  let expHTML = '';
  if (data.experience && data.experience.length > 0) {
    for (let exp of data.experience) {
      expHTML += `
        <div class="exp-block">
          <div class="exp-role">${safe(exp.role)}</div>
          <div class="exp-company">${safe(exp.company)}</div>
          <div class="exp-duration">${safe(exp.duration)}</div>
          <div class="exp-desc">${safe(exp.description)}</div>
        </div>
      `;
    }
  } else {
    expHTML = '<p style="color:#aaa;font-size:13px;padding:10px 0">No experience found</p>';
  }
  document.getElementById('tab-experience').innerHTML = expHTML;

  // education tab - also show certs and achievements here
  let eduHTML = '';

  if (data.education && data.education.length > 0) {
    for (let edu of data.education) {
      let meta = [edu.year, edu.grade].filter(Boolean).join(' · ');
      eduHTML += `
        <div class="edu-block">
          <div class="edu-degree">${safe(edu.degree)}</div>
          <div class="edu-inst">${safe(edu.institution)}</div>
          ${meta ? `<div class="edu-meta">${safe(meta)}</div>` : ''}
        </div>
      `;
    }
  }

  if (data.certifications && data.certifications.length > 0) {
    eduHTML += '<div class="section-label">Certifications</div>';
    for (let cert of data.certifications) {
      eduHTML += `<div class="cert-item"><span class="cert-dot">✦</span> ${safe(cert)}</div>`;
    }
  }

  if (data.achievements && data.achievements.length > 0) {
    eduHTML += '<div class="section-label">Achievements</div>';
    for (let ach of data.achievements) {
      eduHTML += `<div class="cert-item"><span class="cert-dot" style="color:#e08c00">★</span> ${safe(ach)}</div>`;
    }
  }

  document.getElementById('tab-education').innerHTML = eduHTML || '<p style="color:#aaa;font-size:13px;padding:10px 0">Nothing found</p>';

  // default show contact tab
  showTab('contact');
}


// tab switching
function showTab(tabName) {
  // hide all tab sections
  let allTabs = document.querySelectorAll('.tab-section');
  allTabs.forEach(function(t) {
    t.style.display = 'none';
  });

  // remove active from all buttons
  let allBtns = document.querySelectorAll('.tab-btn');
  allBtns.forEach(function(b) {
    b.classList.remove('active');
  });

  // show the right one
  document.getElementById('tab-' + tabName).style.display = 'block';

  // find which button to make active
  allBtns.forEach(function(b) {
    if (b.getAttribute('onclick') === `showTab('${tabName}')`) {
      b.classList.add('active');
    }
  });
}


// copy the parsed JSON to clipboard
function copyJSON() {
  if (!parsedResult) return;

  let jsonStr = JSON.stringify(parsedResult, null, 2);
  navigator.clipboard.writeText(jsonStr).then(function() {
    // briefly change button text
    let btns = document.querySelectorAll('.btn-secondary');
    btns[0].textContent = '✅ Copied!';
    setTimeout(function() {
      btns[0].textContent = '📋 Copy JSON';
    }, 2000);
  });
}


// download the JSON as a file
function downloadJSON() {
  if (!parsedResult) return;

  let name = (parsedResult.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  let filename = name + '_parsed.json';

  let blob = new Blob([JSON.stringify(parsedResult, null, 2)], { type: 'application/json' });
  let url = URL.createObjectURL(blob);

  let a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}


// reset everything to start over
function resetAll() {
  parsedResult = null;
  document.getElementById('resumeText').value = '';
  document.getElementById('resultContent').style.display = 'none';
  document.getElementById('emptyState').style.display = 'flex';
}


// ---- helper functions ----

function setLoading(on) {
  document.getElementById('parseBtn').disabled = on;
  document.getElementById('parseBtn').textContent = on ? '⏳ Parsing...' : '✨ Parse Resume';
  document.getElementById('loadingDiv').style.display = on ? 'flex' : 'none';
}

function updateLoadingText(msg) {
  document.getElementById('loadingText').textContent = msg;
}

function showError(msg) {
  let el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('errorMsg').style.display = 'none';
}

// escape html to prevent xss
function safe(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// get initials from a name like "Sparsh Shukla" -> "SS"
function getInitials(name) {
  if (!name) return '?';
  let parts = name.trim().split(' ');
  let initials = parts.slice(0, 2).map(function(p) { return p[0]; }).join('');
  return initials.toUpperCase();
}

// add https:// if url doesnt have it
function fixURL(url) {
  if (!url) return '#';
  if (url.startsWith('http')) return url;
  return 'https://' + url;
}
