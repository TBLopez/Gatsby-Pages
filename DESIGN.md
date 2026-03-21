# Design System Strategy: The Editorial Curator

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

Unlike standard portfolio templates that rely on rigid grids and heavy borders, this system treats the screen as a high-end gallery wall. It is designed to feel intentional, quiet, and authoritative. We achieve a "premium" feel by leaning into **intentional asymmetry** and **tonal depth** rather than structural lines. By utilizing generous white space (inspired by the "plenty of whitespace" requirement) and high-contrast typography scales, we shift the focus from the interface to the work itself. The layout should feel "breathed into existence," using overlapping elements and subtle glassmorphism to create a sense of sophisticated layering.

---

## 2. Colors & Surface Architecture
The palette is rooted in deep obsidian tones and crisp whites, accented by a sophisticated "Sunset Gold" (`secondary`) and a "Technical Cobalt" (`primary`).

**Color Palette:**
- Primary: `#5A67D8` (Technical Cobalt)
- Secondary: `#F6AD55` (Sunset Gold)
- Tertiary/Neutral: `#141821` (Obsidian)
- Background: `#f9f9ff`
- Surface: `#f9f9ff`
- Surface Container Low: `#f1f3ff`
- Surface Container Highest: `#dfe2ef`
- Inverse Surface: `#2c303a`

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** 
To define boundaries, you must use background color shifts. For example, a `surface-container-low` section should sit directly against a `surface` background. This creates a "soft edge" that feels more high-end and less like a "bootstrap" template.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine paper or frosted glass.
*   **Base:** `surface` (#f9f9ff)
*   **Low Emphasis:** `surface-container-low` (#f1f3ff) for large background sections.
*   **High Emphasis:** `surface-container-highest` (#dfe2ef) for elevated interactive cards.
*   **Inversion:** Use `inverse_surface` (#2c303a) for "Dark Mode" callouts within a light layout to create dramatic editorial breaks.

### The "Glass & Gradient" Rule
To add visual "soul," primary CTAs and hero headers should utilize a subtle linear gradient transitioning from `primary` (#404dbe) to `primary_container` (#5a67d8) at a 135-degree angle. For floating navigation or over-image menus, apply **Glassmorphism**: use `surface` at 70% opacity with a `backdrop-blur` of 12px.

---

## 3. Typography: The Editorial Voice
We use **Inter** as our typographic workhorse, standing in for the system-ui to provide a more polished, deliberate geometric feel.

*   **Display Scales (`display-lg` to `display-sm`):** These are your "Art Gallery" titles. Use `display-lg` (3.5rem) with a `-0.02em` letter-spacing. These should often be placed asymmetrically—perhaps bleeding off the grid or aligned to a non-standard column—to break the "template" look.
*   **Headline & Title:** Use `headline-lg` (2rem) for project titles. The high contrast between a massive `display` quote and a clean `title-md` subheader creates the "high-end" editorial rhythm.
*   **Body & Labels:** `body-lg` is your primary storytelling tool. Keep line lengths between 45-65 characters to maintain readability and "premium" whitespace.

---

## 4. Elevation & Depth
In this system, depth is a whisper, not a shout. We move away from traditional Material shadows in favor of **Tonal Layering.**

*   **The Layering Principle:** Place a `surface-container-lowest` card (#ffffff) on top of a `surface-container-low` (#f1f3ff) background. This creates a natural, soft lift without a single pixel of shadow.
*   **Ambient Shadows:** If an element must "float" (e.g., a modal), use a shadow color tinted with the `on_surface` tone: `rgba(24, 28, 37, 0.06)` with a 40px blur and 10px offset.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism Depth:** When using the Glassmorphism effect, the `outline` (#767684) should be used at 10% opacity as a "specular highlight" on the top edge of the container only.

---

## 5. Components

### Buttons
*   **Primary:** A gradient fill (`primary` to `primary_container`). Use `rounded-md` (0.375rem). Text is `on_primary`. 
*   **Secondary:** Ghost style. No background, no border. Use `primary` text with a subtle `surface-container-high` background on hover.
*   **Tertiary:** All caps `label-md` with an arrow icon. Focus on the micro-interaction (e.g., the arrow moving 4px to the right on hover).

### Cards & Projects
*   **The "No-Divider" Rule:** Never use lines to separate content. Use the **Spacing Scale `12` (4rem)** to create "islands" of content. 
*   **Composition:** Project cards should use `surface-container-lowest`. Use asymmetrical padding: more padding at the bottom (Scale `8`) than the top (Scale `5`) to create an editorial "weighted" look.

### Input Fields
*   **Styling:** Background-only inputs using `surface-container-high`. 
*   **States:** On focus, transition the background to `surface_bright` and add a 1px "Ghost Border" using `primary` at 30% opacity.

### Featured Work List
*   Instead of a standard list, use a "Hover-Reveal" pattern. Items are separated by whitespace (Scale `6`). On hover, the background of the row shifts to `surface-container-low`, and a thumbnail image follows the cursor.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use the Spacing Scale `20` (7rem) for section margins. Space is your most expensive asset; use it generously.
*   **DO** mix font weights. Use `display-lg` at 700 weight next to `body-lg` at 400 weight to create visual hierarchy.
*   **DO** use `secondary_container` (#ffb55c) sparingly as a "Highlight" color—perfect for small chips or a single word in a paragraph to draw the eye.

### Don’t:
*   **DON'T** use 100% black (#000000) for text. Use `on_surface` (#181c25) to keep the contrast sophisticated and readable.
*   **DON'T** use shadows on every card. Reserve elevation for the highest-level interactions (e.g., the final "Contact" CTA).
*   **DON'T** align everything to the center. Use a "Left-Heavy" layout with "Floating" elements on the right to create an avant-garde feel.
*   **DON'T** use divider lines. If the content feels messy, increase the spacing scale rather than adding a line.
