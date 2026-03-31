# Chevrolet Corvette E-Ray Scrollytelling Experience

A high-performance, ultra-premium scrollytelling landing page built to showcase the internal mechanics and dramatic "explosion" view of a supercar.

This project utilizes **Next.js 15 (App router)**, **HTML5 Canvas**, and **Framer Motion** to deliver a buttery-smooth 60fps frame-by-frame visual experience that links securely to your scrollbar.

## 🚀 Features

- **HTML5 Canvas Sequence Rendering:** Pre-loads and sequentially draws a massive 168-frame image array, optimizing memory and ensuring no layout jank during scrolling.
- **Scroll-linked Animations:** Powered by `framer-motion`'s `useScroll` and `useSpring`, mapping scroll 0-1 metrics directly into frame indices and DOM opacities.
- **Responsive "Contain" Logic:** Dynamically calculates aspect ratios against the viewport to guarantee that intricate floating mechanics (engine blocks, calipers, wiring) are never cropped off-screen on devices of any size.
- **Scrollytelling "Beats" (Transform Links):**
   - **Beat A:** Initial load and text reveal ("RAW PERFORMANCE. UNLEASHED.").
   - **Beat B (25% - 45%):** Body shell lifts, exposing chassis wiring.
   - **Beat C (50% - 75%):** Extreme internal expansion—V8 block and manifolds separate.
   - **Beat D (80% - 100%):** Re-assembly and call-to-action button.
- **Progressive Loading UI:** Elegant startup sequence calculating the precise pre-fetch progress of the heavy frame assets before initializing the scroll canvas.
- **Custom Scrollbar & Aesthetics:** Pure `#000000` dark-mode blending ensuring frame bounds dissolve into the infinite void seamlessly.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Static Export configured)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://motion.dev/)
- **Rendering Interface:** `<canvas>` Context 2D 

## 📦 Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to experience the scroll.

## ☁️ Deployment (Netlify Static Export)

This project is explicitly configured to be hosted as an edge-optimized static site.
It includes a `next.config.ts` enforcing `output: "export"` and a `netlify.toml`.

1. Run the build command locally (or in your CI/CD pipeline):
   ```bash
   npm run build
   ```
2. Next.js will generate a fully static **`out`** directory.
3. Drag and drop the `out` directory to your [Netlify](https://app.netlify.com/drop) dashboard, or connect the GitHub repository directly and Netlify will handle the rest.

---
_Concept and interaction inspired by world-class Awwwards mechanical showcases._
