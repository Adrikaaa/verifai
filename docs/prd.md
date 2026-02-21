Here is a clean, concise **PRD for verif.Ai** — optimized for a landing page, browser extension, and future mobile app (Stitch).
No extra fluff, just a solid Product Requirements Document you can paste into Notion/Jira.

---

# **📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)**

## **Product Name:** verif.Ai

## **Type:** Content Authenticity SaaS (Web + Extension + Mobile)

## **Version:** MVP v1.0

---

# **1. Problem Statement**

AI-generated images, videos, audio, and text are becoming indistinguishable from real content.
Users need a simple, fast way to **verify authenticity before sharing, publishing, or acting on content.**

---

# **2. Solution Overview**

verif.Ai is a SaaS platform that provides:

* Instant authenticity checks
* Multi-modal AI detection (image, video, audio, text)
* Explainable reports
* Browser extension for one-click verification
* Clean, premium landing page for conversion
* Mobile app (later) for on-the-go checks

---

# **3. Target Users**

1. **Journalists / Media agencies** – verify news images & videos
2. **Brands & marketers** – detect fake ads or impersonations
3. **Educators / Schools** – spot AI-generated assignments
4. **Recruiters** – detect AI resumes & video interviews
5. **General users / creators** – verify viral content

---

# **4. Core Features (MVP)**

## **4.1 Content Verification Engine**

Input types:

* Image (png/jpg/webp)
* Video (mp4)
* Audio (mp3/wav)
* Text (paste)
* URL input (Instagram/Twitter/YouTube link)

Output:

* Authenticity score (0–100%)
* Risk label (Low / Medium / High)
* Short explanation of signals detected

---

## **4.2 Landing Page (Marketing Site)**

Sections required:

* Hero section (headline + CTA)
* How it works (3-step process)
* Features (cards)
* Use Cases (grid)
* Pricing (tiered)
* Footer (links)

Goals:

* Convert visitors to sign up
* Collect emails / free-tier registrations

---

## **4.3 Dashboard (Web App)**

Features:

* Upload content or paste link
* View verification results
* History of scans (10 entries free plan)
* User profile & subscription

---

## **4.4 Browser Extension (v1)**

Popup UI:

* Upload or paste link
* “Scan this page” button
* Display a mini authenticity report

Supported platforms:

* Chrome
* Edge

---

## **4.5 API (Basic v1)**

Endpoints:

* `/verify/image`
* `/verify/video`
* `/verify/text`
* `/verify/link`

API returns:

```
{
  "score": 82,
  "risk": "High",
  "explanation": "GAN artifacts detected"
}
```

---

# **5. Non-Functional Requirements**

* Fast response (goal < 3 seconds for images/text)
* Secure file upload (short-lived URL or in-memory)
* Dark mode UI only (MVP)
* Mobile-responsive design
* High uptime (99%+)

---

# **6. Pricing (MVP)**

### **Free**

* 20 checks/month
* Basic report

### **Pro – $19/mo**

* 1,000 checks
* Detailed explanations
* Browser extension
* History: 100 scans

### **Business – $99+/mo**

* API access
* Team workspace
* Monitoring alerts

---

# **7. Success Metrics (KPIs)**

* 20%+ landing page → sign-up conversion
* Average scan time < 3 sec
* 1000 monthly active users within 90 days
* 5%+ Pro conversion rate
* Extension install → scan rate > 25%

---

# **8. Tech Stack (Recommended)**

**Frontend**

* Next.js + Tailwind
* ShadCN UI
* Framer motion animations

**Backend**

* FastAPI or Node.js
* PostgreSQL or Supabase
* Redis for queueing

**AI**

* Image classifier
* Video frame scanner
* Text detector
* Audio deepfake model

**Extension**

* Manifest V3
* React-lite UI

---

# **9. Roadmap**

## **MVP (0–4 weeks)**

* Landing page
* Image + text detection
* Dashboard basic
* Extension basic

## **V2 (4–8 weeks)**

* Video + audio detection
* Full report explanation
* Pricing & billing
* API v1

## **V3 (8–12 weeks)**

* Mobile app (Stitch)
* Real-time web scanning
* Team accounts

USE EASY TO UNDERSTAND CODE