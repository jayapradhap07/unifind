# Campus Lost & Found Portal (UniFind)

A modern, responsive, privacy-conscious web application designed for college students and campus security desks to report lost belongings, post found items, search listings, and safely reunite possessions with their rightful owners.

Built strictly using **HTML5, CSS3, Vanilla JavaScript, and Browser LocalStorage**. No frameworks, libraries, external databases, or backend servers required.

---

## 📸 Key Features & Capabilities

### 1. Home Dashboard
- **Welcome Hero Section:** Distinct quick-access calls-to-action ("I Lost an Item" and "I Found an Item") and an integrated instant search bar.
- **Live Campus Statistics:** Real-time counters showing *Total Reports*, *Items Still Lost*, *Found Awaiting Claim*, and *Reunited With Owners*. Clicking any stat card instantly navigates to the Browse view with that status pre-filtered.
- **Recently Reported Items:** Displays the newest campus listings in a responsive card grid.
- **How UniFind Works:** A 3-step visual workflow explaining reporting, rule-based matching, and secure desk handovers.

### 2. Comprehensive Browse & Search System
- **Multi-criteria Filtering:** Filter seamlessly by:
  - Text search (matches item title, description, location, and report ID)
  - Report status (*All*, *Lost Only*, *Found Only*, *Returned*)
  - Category (*ID Card*, *Electronics*, *Books*, *Bags*, *Keys*, *Water Bottles*, *Accessories*, *Other*)
  - Campus Location (*Central Library*, *Student Center*, *Science Complex*, *Engineering Hall*, *Main Cafeteria*, *Sports Arena*, *North Quad*, *Campus Shuttle*, *Other*)
- **Multi-mode Sorting:** Sort listings by *Newest First*, *Oldest First*, or *Alphabetical (A-Z)*.
- **Clear Filters & Empty State:** Instant reset button and an informative empty state with actionable recovery prompts if no listings match.

### 3. Report an Item (Add & Edit Form)
- Dual-mode form for creating new reports or editing existing reports.
- Dynamic toggle between *Lost* and *Found* with context-aware labels.
- Required field validation with clear inline error indicators.
- **Client-Side Image Optimization:** Images uploaded by students are automatically downscaled to 600px max dimensions and compressed via HTML5 Canvas before saving as Base64 data strings. This completely prevents browser LocalStorage 5MB quota errors.
- **Category SVG Fallbacks:** Clean, custom SVG vector art placeholders for each category when no photo is provided.
- **Privacy Warning Banner:** Clear alerts reminding students never to post credit cards, device passwords, or unmasked government IDs.

### 4. Item Details & Safe Claim Modal
- Complete item description, location, specific room details, category badge, and date.
- **Masked Contact Protocol:** Student emails and phone numbers are never exposed in public cards.
- **Verified Inquire / Claim Dialog:** In-app inquiry modal allowing owners to describe unique identifying marks or arrange safe handover at the Central Library Circulation Desk or Campus Security Office.
- **Return Workflow:** One-click "Mark as Returned" action that updates the listing status and live dashboard statistics immediately.

### 5. My Reports Management
- Dedicated tab displaying listings submitted from the current browser session.
- Sub-filters for *All*, *Lost*, *Found*, and *Returned*.
- Report owner controls: **Edit Listing**, **Mark as Returned**, and **Delete Report**.
- Confirmation modal before deleting any report to prevent accidental loss.

### 6. Unique Feature: Smart Item Matching ("Possible Matches")
A rule-based JavaScript matching algorithm that assists students in discovering potential matches:
- When viewing a **Lost** item, the system scans all active **Found** items (and vice-versa).
- **Match Score Formula (0 to 100 points):**
  1. **Category Match (+35 points):** Candidate item shares the exact same category.
  2. **Location Match (+25 points):** Exact campus location match (or +15 points for matching building/area in location details).
  3. **Keyword Overlap (+8 to +25 points):** Tokenizes title and description into lowercase words, strips common English stopwords, and calculates matching meaningful tokens (e.g. "MacBook", "hydro", "lanyard").
  4. **Date Proximity (+5 to +15 points):** Items reported within ±2 days get +15 points, ±7 days get +10 points, ±14 days get +5 points.
- Listings with a score of **35% or higher** appear under the **"Possible Matches"** section inside the details modal, along with match percentage pills and specific reason badges (e.g., `Category: Electronics`, `Location: Central Library`, `Reported ±2 days apart`).
- **Transparency Notice:** Clearly informs users that suggestions are automated rule-based indicators, not confirmed artificial intelligence or biometric identification.

### 7. Campus Safety & Guidelines Guide
- Guidelines for verifying ownership (e.g., unlocking device screens, checking syllabus in notebooks, identifying unique scratches).
- List of verified physical handover locations and campus security emergency extensions.

---

## 📂 Project Structure

```
campus-lost-found/
├── index.html       # Semantic HTML5 single-page application structure
├── style.css        # Responsive CSS3 styles (Navy/Teal theme, Flexbox/Grid, Modals)
├── script.js        # Vanilla JavaScript (LocalStorage persistence, matching engine, filters)
└── README.md        # Documentation, setup guide, and architectural explanation
```

---

## 🚀 How to Run Locally

Because the portal is built entirely with standards-compliant HTML5, CSS3, and Vanilla JavaScript, **no npm install, build steps, or backend server are required**.

### Option A: Direct Browser Launch (Fastest)
1. Navigate to the project directory: `d:\lost and found` (or `campus-lost-found/`).
2. Double-click `index.html` or right-click and choose **Open with** -> **Google Chrome / Microsoft Edge / Mozilla Firefox / Safari**.

### Option B: Local Web Server (Recommended for Best Experience)
If you prefer running via a local web server:

**Using Python 3:**
```bash
# In your terminal inside the project directory:
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**Using VS Code Live Server:**
Right-click `index.html` inside VS Code and select **"Open with Live Server"**.

**Using Node.js (`npx serve`):**
```bash
npx serve .
```

---

## 🧪 Demonstration & Testing Walkthrough

1. **Dashboard & KPIs:**
   - Observe the live counters (Total, Lost, Found, Returned).
   - Click the "Items Still Lost" stat card to jump to Browse filtered by "Lost".
2. **Smart Item Matching in Action:**
   - On the dashboard or browse page, click on **"Space Gray MacBook Pro 14\""** (Lost).
   - Look at the bottom of the modal: notice that **"Apple MacBook Pro in Black Sleeve"** is automatically suggested with a **High Match Score** (e.g. 85-95%) due to matching category, location, and keywords!
   - Click the suggested match card to view the found item's details.
3. **Report an Item:**
   - Click "Report Lost Item" or "Report Found Item".
   - Test validation by clicking "Publish Report" with empty inputs — note the helpful red validation indicators.
   - Upload an image (drag & drop or browse) and observe the preview and auto-resizing.
   - Submit the form and notice the immediate success toast notification and entry in Browse & My Reports.
4. **My Reports, Edit, and Delete:**
   - Navigate to **"My Reports"**.
   - Notice sample items marked as "My Report".
   - Click the **Edit icon** on an item to modify its location or description.
   - Click **"Mark as Returned"** and check how the status changes and stats increment.
   - Click the **Delete icon** to see the deletion confirmation modal in action.
5. **Resetting Sample Data:**
   - Click the **"Reset Sample Data"** button in the top banner at any time to restore the original demonstration items.

---

## 🔒 Privacy & Safety Implementation

- **No Public Contact Exposure:** Student email addresses and phone numbers are never printed in plaintext on public item cards. Instead, masked badges (e.g., `s***@campus.edu`) and safe campus desk routing are utilized.
- **Student ID Protection:** Sensitive student ID numbers in titles or descriptions are masked automatically (e.g., `STU-****-8842`).
- **Local Browser Sandboxing:** All data is strictly persisted in the user's browser `window.localStorage`. The application makes no unprompted network calls to external databases, protecting user privacy during mini-project evaluations.

---

## ⚠️ Known Limitations & Future Roadmap

- **Browser-Local Persistence:** Listings are stored per browser profile. In a production deployment, this would be backed by a campus REST API (e.g., Node.js/Express, Python/FastAPI) and a PostgreSQL database with campus Single Sign-On (SSO / OAuth2).
- **LocalStorage Storage Limits:** Browser LocalStorage has a 5MB threshold. The application mitigates this by resizing uploaded images to 600px (~40-60KB each), allowing dozens of photo reports to be stored safely without quota exceptions.
- **Rule-Based Matching Scope:** The smart matching engine evaluates keyword tokens and proximity. For an enterprise production service, vector embeddings or semantic image similarity could be added via an authenticated backend service.

---

## 📜 License & Academic Integrity
Created for educational demonstrations, collegiate software engineering coursework, and student union service prototypes. Free to use, adapt, and build upon.
