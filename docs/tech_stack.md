
## 1. Frontend (The "Dribbble" Face)

To achieve the dark-blue, neon-glowing, bento-box aesthetic of your reference:

* **Framework:** **Next.js 16+** (Using App Router and Server Components for instant loading).
* **Styling:** **Tailwind CSS** + **Framer Motion** (For the scanning animations and smooth transitions).
* **UI Library:** **Aceternity UI** or **Magic UI**. These libraries specialize in the "modern SaaS" look with pre-built components like "Moving Borders," "Glow Effects," and "Bento Grids."

## 2. Backend (The AI Engine)

Since you are processing media (images/videos) and text, you need high-performance Python-based tools.

* **Primary API:** **FastAPI**. It is 7.5x faster than Django and perfectly handles the asynchronous nature of AI model inference.
* **Runtime:** **Node.js (Express)** *Optional*. Only use this if you want a separate lightweight microservice to handle user auth and real-time notifications/webhooks.

## 3. The "Stitch" (Extension & Mobile)

* **Browser Extension:** **WXT** or **Plasmo**. These frameworks allow you to build Chrome/Brave extensions using React. They handle all the annoying "Manifest v3" configurations for you.
* **Mobile App:** **Flutter 3.27+**.
* *Why?* It uses the **Impeller** engine, which delivers 120 FPS performance—critical for showing high-quality "Scanning HUD" overlays on the camera feed.



## 4. AI & Data Layer

* **Detection APIs (The Brains):** * **Text:** **GPTZero API** or **Proofademic** (rated #1 in 2026 for institutional reliability).
* **Image/Video:** **Hive AI** or **Reality Defender** APIs for deepfake detection.


* **Database:** **PostgreSQL** (with **Prisma ORM**). It’s the "safe bet" for SaaS in 2026.
* **Storage:** **AWS S3** or **Google Cloud Storage** (to store the images/videos users upload for verification).

---

### Summary Table

| Layer | Technology | Why? |
| --- | --- | --- |
| **Frontend** | Next.js + Tailwind | Fastest way to hit that "Dribbble" quality. |
| **Backend** | FastAPI (Python) | Best for AI/ML library integration. |
| **Mobile** | Flutter | Smooth 120Hz animations for the "Scanner" look. |
| **Extension** | WXT Framework | Simplifies complex browser APIs. |
| **AI Models** | GPTZero / Hive AI | High accuracy; don't reinvent the wheel for the MVP. |

