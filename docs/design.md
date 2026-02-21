Based on the Dribbble shot by Salman Hamza, your design for **Verify.Ai** should lean into the **"Cyber-Authenticity"** aesthetic. This style uses deep shadows and light beams to create a sense of trust and high-tech security.

Here is a deep-dive design analysis and how to apply it to your project:

---

## 1. Visual Language: The "Trust-Tech" Aesthetic

The Dribbble reference uses a **Dark Navy palette** ( or ) which feels more professional and secure than pure black.

* **Glassmorphism:** All cards and sections should use a semi-transparent background (`backdrop-blur-md` in Tailwind). This makes the UI feel "light" despite the dark background.
* **Neon Accents:** Use a single "Action Color"—Electric Blue or Cyan (). This is used for buttons, active states, and the "Detection Line" in your scanner.
* **Glow & Light Beams:** Use radial gradients in the background (e.g., a faint purple or blue glow behind the main CTA) to give the page depth and a premium feel.

---

## 2. Layout Strategy: The Bento Box

Modern AI SaaS designs (including your reference) rely on the **Bento Grid**. This is perfect for **Verify.Ai** because you have different types of data (Image, Video, Audio).

### Landing Page Sections:

* **The Hero (First Fold):**
* **Headline:** "Truth in the Age of AI."
* **Input Box:** Instead of a task list, place a prominent "Paste Link or Upload" area. Use a glowing border that pulses when a file is dragged over it.


* **The Feature Bento (Second Fold):**
* **Large Card:** AI Video Detection (show a "Scanning" frame).
* **Small Card:** Browser Extension stats (e.g., "Verified 1M+ images").
* **Medium Card:** Authenticity Report sample (showing the 82% score).



---

## 3. UI Components for "Verify.Ai"

| Component | Design Treatment | Action |
| --- | --- | --- |
| **Buttons** | Rounded-full, high contrast. | Use `box-shadow` to create a subtle outer glow. |
| **Input Fields** | Darker than background, thin 1px border. | Border turns Electric Blue on focus. |
| **Progress Bars** | Linear gradients (Green to Red). | Use for the "AI Probability" score. |
| **Badges** | Solid pill shapes. | "Verified," "Likely AI," "Human Created." |

---

## 4. Mobile & Extension "Stitch"

To keep the design consistent across your "stitch" (the connection between mobile, web, and extension):

* **Mobile UI:** Focus on the "Camera View." Use a transparent overlay (HUD) with scanning lines over the camera feed.
* **Extension UI:** Keep it as a "Micro-Dashboard." It should only show the Core Score and an "Open Full Report" button that leads back to the web app.

---

## 5. Implementation Pro-Tip (Frontend)

To match that "Dribbble quality" without spending weeks on CSS:

1. **Tailwind CSS:** Use it for the utility-first styling.
2. **Magic UI / Aceternity UI:** These are modern component libraries that have "Bento Grids" and "Retro Grids" pre-built in the exact style of your Dribbble link.
3. **Framer Motion:** Use this for the "Scanning" line animation. It’s just a `div` moving  from 0% to 100% on a loop.

