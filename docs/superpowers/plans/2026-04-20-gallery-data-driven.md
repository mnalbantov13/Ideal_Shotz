# Gallery Data-Driven Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 1,200 lines of repetitive static HTML in `gallery.html` with a JS data file + `renderGallery()` function, eliminating duplicate IDs and automatically applying `loading="lazy"` to every image.

**Architecture:** A new `gallery-data.js` defines all categories, albums, and image paths as a structured array. A `renderGallery()` function in `script.js` reads that array and injects identical HTML into `#gallery-container` on page load — before `initGalleryFilter()` runs. All existing filter, modal, and lazy-load logic is unchanged.

**Tech Stack:** Vanilla HTML/CSS/JS, no build tools, no framework, Cloudinary CDN for car/nature images.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `gallery-data.js` | Create | Single source of truth for all gallery image data |
| `script.js` | Modify | Add `renderGallery()`, `itemHTML()`, fix one querySelector, update call order |
| `gallery.html` | Modify | Replace 1,200-line gallery HTML with `<div id="gallery-container">`, add script tag |
| `bg/gallery.html` | Modify | Same structural change as `gallery.html`, references `../gallery-data.js` |

---

## Task 1: Create `gallery-data.js`

**Files:**
- Create: `gallery-data.js`

> No test framework exists — verification is manual in the browser (Task 5).

- [ ] **Step 1: Create the file with the full GALLERY_DATA array**

Create `gallery-data.js` in the project root with this exact content. Image order must match the current HTML exactly (some albums use non-sequential numbering).

```js
const GALLERY_DATA = [
  {
    id: 'aerial',
    label: 'Aerial',
    cover: 'images/Album/Aerial.webp',
    images: [
      { src: 'images/Blur/Aerial/Aerial (1).webp',  fullSrc: 'images/Aerial/Aerial (1).webp',  alt: 'Aerial 1' },
      { src: 'images/Blur/Aerial/Aerial (2).webp',  fullSrc: 'images/Aerial/Aerial (2).webp',  alt: 'Aerial 2' },
      { src: 'images/Blur/Aerial/Aerial (4).webp',  fullSrc: 'images/Aerial/Aerial (4).webp',  alt: 'Aerial 4' },
      { src: 'images/Blur/Aerial/Aerial (5).webp',  fullSrc: 'images/Aerial/Aerial (5).webp',  alt: 'Aerial 5' },
      { src: 'images/Blur/Aerial/Aerial (6).webp',  fullSrc: 'images/Aerial/Aerial (6).webp',  alt: 'Aerial 6' },
      { src: 'images/Blur/Aerial/Aerial (8).webp',  fullSrc: 'images/Aerial/Aerial (8).webp',  alt: 'Aerial 8' },
      { src: 'images/Blur/Aerial/Aerial (9).webp',  fullSrc: 'images/Aerial/Aerial (9).webp',  alt: 'Aerial 9' },
      { src: 'images/Blur/Aerial/Aerial (10).webp', fullSrc: 'images/Aerial/Aerial (10).webp', alt: 'Aerial 10' },
      { src: 'images/Blur/Aerial/Aerial (11).webp', fullSrc: 'images/Aerial/Aerial (11).webp', alt: 'Aerial 11' },
      { src: 'images/Blur/Aerial/Aerial (12).webp', fullSrc: 'images/Aerial/Aerial (12).webp', alt: 'Aerial 12' },
      { src: 'images/Blur/Aerial/Aerial (13).webp', fullSrc: 'images/Aerial/Aerial (13).webp', alt: 'Aerial 13' },
      { src: 'images/Blur/Aerial/Aerial (14).webp', fullSrc: 'images/Aerial/Aerial (14).webp', alt: 'Aerial 14' },
      { src: 'images/Blur/Aerial/Aerial (15).webp', fullSrc: 'images/Aerial/Aerial (15).webp', alt: 'Aerial 15' },
      { src: 'images/Blur/Aerial/Aerial (16).webp', fullSrc: 'images/Aerial/Aerial (16).webp', alt: 'Aerial 16' },
      { src: 'images/Blur/Aerial/Aerial (17).webp', fullSrc: 'images/Aerial/Aerial (17).webp', alt: 'Aerial 17' },
      { src: 'images/Blur/Aerial/Aerial (18).webp', fullSrc: 'images/Aerial/Aerial (18).webp', alt: 'Aerial 18' },
      { src: 'images/Blur/Aerial/Aerial (19).webp', fullSrc: 'images/Aerial/Aerial (19).webp', alt: 'Aerial 19' },
    ]
  },
  {
    id: 'astro',
    label: 'Astro',
    cover: 'images/Album/Astro.webp',
    images: [
      { src: 'images/Blur/Astro/Astro (1).webp', fullSrc: 'images/Astro/Astro (1).webp', alt: 'Astro 1' },
      { src: 'images/Blur/Astro/Astro (3).webp', fullSrc: 'images/Astro/Astro (3).webp', alt: 'Astro 3' },
      { src: 'images/Blur/Astro/Astro (4).webp', fullSrc: 'images/Astro/Astro (4).webp', alt: 'Astro 4' },
      { src: 'images/Blur/Astro/Astro (2).webp', fullSrc: 'images/Astro/Astro (2).webp', alt: 'Astro 2' },
    ]
  },
  {
    id: 'bandw',
    label: 'B&W',
    cover: 'images/Album/BandW.webp',
    images: [
      { src: 'images/Blur/BandW/BandW (1).webp', fullSrc: 'images/BandW/BandW (1).webp', alt: 'BandW 1' },
      { src: 'images/Blur/BandW/BandW (2).webp', fullSrc: 'images/BandW/BandW (2).webp', alt: 'BandW 2' },
      { src: 'images/Blur/BandW/BandW (4).webp', fullSrc: 'images/BandW/BandW (4).webp', alt: 'BandW 3' },
      { src: 'images/Blur/BandW/BandW (3).webp', fullSrc: 'images/BandW/BandW (3).webp', alt: 'BandW 4' },
      { src: 'images/Blur/BandW/BandW (5).webp', fullSrc: 'images/BandW/BandW (5).webp', alt: 'BandW 5' },
      { src: 'images/Blur/BandW/BandW (6).webp', fullSrc: 'images/BandW/BandW (6).webp', alt: 'BandW 6' },
    ]
  },
  {
    id: 'cars',
    label: 'Cars',
    cover: 'images/Album/Car.webp',
    albums: [
      {
        title: 'Audi RS6',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_RS6_1.webp', alt: 'Audi RS6 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_RS6_2.webp', alt: 'Audi RS6 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_RS6_3.webp', alt: 'Audi RS6 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_RS6_4.webp', alt: 'Audi RS6 4' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_RS6_5.webp', alt: 'Audi RS6 5' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_RS6_6.webp', alt: 'Audi RS6 6' },
        ]
      },
      {
        title: 'Mclaren 720S',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mclaren_1.webp', alt: 'Mclaren 720S 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mclaren_2.webp', alt: 'Mclaren 720S 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mclaren_3.webp', alt: 'Mclaren 720S 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mclaren_4.webp', alt: 'Mclaren 720S 4' },
        ]
      },
      {
        title: 'Audi SQ8',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_SQ8_1.webp', alt: 'Audi SQ8 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_SQ8_2.webp', alt: 'Audi SQ8 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_SQ8_3.webp', alt: 'Audi SQ8 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Audi_SQ8_4.webp', alt: 'Audi SQ8 4' },
        ]
      },
      {
        title: 'BMW 640D',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_640D_1.webp', alt: 'BMW 640D 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_640D_2.webp', alt: 'BMW 640D 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_640D_3.webp', alt: 'BMW 640D 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_640D_4.webp', alt: 'BMW 640D 4' },
        ]
      },
      {
        title: 'BMW 325xi',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_325xi_1.webp', alt: 'BMW 325xi 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_325xi_2.webp', alt: 'BMW 325xi 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_325xi_3.webp', alt: 'BMW 325xi 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_325xi_4.webp', alt: 'BMW 325xi 4' },
        ]
      },
      {
        title: 'BMW 328i',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/E46_1.webp', alt: 'BMW 328i 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/E46_2.webp', alt: 'BMW 328i 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/E46_3.webp', alt: 'BMW 328i 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/E46_4.webp', alt: 'BMW 328i 4' },
        ]
      },
      {
        title: 'BMW 335i',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_335i_1.webp', alt: 'BMW 335i 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_335i_2.webp', alt: 'BMW 335i 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_335i_3.webp', alt: 'BMW 335i 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_335i_4.webp', alt: 'BMW 335i 4' },
        ]
      },
      {
        title: 'BMW M8',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_M8_1.webp', alt: 'BMW M8 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_M8_2.webp', alt: 'BMW M8 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_M8_3.webp', alt: 'BMW M8 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_M8_4.webp', alt: 'BMW M8 4' },
        ]
      },
      {
        title: 'BMW X5',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_X5_1.webp', alt: 'BMW X5 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_X5_2.webp', alt: 'BMW X5 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_X5_3.webp', alt: 'BMW X5 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BMW_X5_4.webp', alt: 'BMW X5 4' },
        ]
      },
      {
        title: 'Mercedes C63S',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_C63S_1.webp', alt: 'Mercedes C63S 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_C63S_2.webp', alt: 'Mercedes C63S 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_C63S_3.webp', alt: 'Mercedes C63S 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_C63S_4.webp', alt: 'Mercedes C63S 4' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_C63S_5.webp', alt: 'Mercedes C63S 5' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_C63S_6.webp', alt: 'Mercedes C63S 6' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_C63S_7.webp', alt: 'Mercedes C63S 7' },
        ]
      },
      {
        title: 'Mercedes E63S',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_E63S_3.webp', alt: 'Mercedes E63S 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_E63S_1.webp', alt: 'Mercedes E63S 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_E63S_2.webp', alt: 'Mercedes E63S 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_E63S_4.webp', alt: 'Mercedes E63S 4' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mercedes_E63S_5.webp', alt: 'Mercedes E63S 5' },
        ]
      },
      {
        title: 'Mercedes G Brabus 700',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/v1760456284/G_Brabus_700_1.webp', alt: 'G Brabus 700 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/v1760456282/G_Brabus_700_2.webp', alt: 'G Brabus 700 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/v1760456282/G_Brabus_700_4.webp', alt: 'G Brabus 700 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/v1760456282/G_Brabus_700_3.webp', alt: 'G Brabus 700 4' },
        ]
      },
      {
        title: 'Mini Cooper S',
        images: [
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mini_Cooper_S_1.webp', alt: 'Mini Cooper S 1' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mini_Cooper_S_2.webp', alt: 'Mini Cooper S 2' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mini_Cooper_S_3.webp', alt: 'Mini Cooper S 3' },
          { src: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Mini_Cooper_S_4.webp', alt: 'Mini Cooper S 4' },
        ]
      },
    ]
  },
  {
    id: 'event',
    label: 'Events',
    cover: 'images/Album/Events.webp',
    albums: [
      {
        title: 'Born2Ride Fest 2025',
        images: [
          { src: 'images/Blur/Events/B2R (1).webp', fullSrc: 'images/Events/B2R (1).webp', alt: 'Born2Ride 1' },
          { src: 'images/Blur/Events/B2R (2).webp', fullSrc: 'images/Events/B2R (2).webp', alt: 'Born2Ride 2' },
          { src: 'images/Blur/Events/B2R (3).webp', fullSrc: 'images/Events/B2R (3).webp', alt: 'Born2Ride 3' },
          { src: 'images/Blur/Events/B2R (4).webp', fullSrc: 'images/Events/B2R (4).webp', alt: 'Born2Ride 4' },
          { src: 'images/Blur/Events/B2R (5).webp', fullSrc: 'images/Events/B2R (5).webp', alt: 'Born2Ride 5' },
          { src: 'images/Blur/Events/B2R (6).webp', fullSrc: 'images/Events/B2R (6).webp', alt: 'Born2Ride 6' },
        ]
      },
      {
        title: 'Prom 2024',
        images: [
          { src: 'images/Blur/Events/Prom (1).webp', fullSrc: 'images/Events/Prom (1).webp', alt: 'Prom 1' },
          { src: 'images/Blur/Events/Prom (2).webp', fullSrc: 'images/Events/Prom (2).webp', alt: 'Prom 2' },
          { src: 'images/Blur/Events/Prom (3).webp', fullSrc: 'images/Events/Prom (3).webp', alt: 'Prom 3' },
          { src: 'images/Blur/Events/Prom (4).webp', fullSrc: 'images/Events/Prom (4).webp', alt: 'Prom 4' },
          { src: 'images/Blur/Events/Prom (5).webp', fullSrc: 'images/Events/Prom (5).webp', alt: 'Prom 5' },
          { src: 'images/Blur/Events/Prom (6).webp', fullSrc: 'images/Events/Prom (6).webp', alt: 'Prom 6' },
          { src: 'images/Blur/Events/Prom (7).webp', fullSrc: 'images/Events/Prom (7).webp', alt: 'Prom 7' },
        ]
      },
      {
        title: 'Gumball 3000',
        images: [
          { src: 'images/Events/Gumball (1).webp', alt: 'Gumball 1' },
          { src: 'images/Events/Gumball (3).webp', alt: 'Gumball 3' },
          { src: 'images/Events/Gumball (4).webp', alt: 'Gumball 4' },
          { src: 'images/Events/Gumball (5).webp', alt: 'Gumball 5' },
          { src: 'images/Events/Gumball (2).webp', alt: 'Gumball 2' },
        ]
      },
      {
        title: 'BMW Fest 2025',
        images: [
          { src: 'images/Blur/Events/BMW (1).webp', fullSrc: 'images/Events/BMW (1).webp', alt: 'BMW Fest 1' },
          { src: 'images/Blur/Events/BMW (2).webp', fullSrc: 'images/Events/BMW (2).webp', alt: 'BMW Fest 2' },
          { src: 'images/Blur/Events/BMW (3).webp', fullSrc: 'images/Events/BMW (3).webp', alt: 'BMW Fest 3' },
          { src: 'images/Blur/Events/BMW (4).webp', fullSrc: 'images/Events/BMW (4).webp', alt: 'BMW Fest 4' },
          { src: 'images/Blur/Events/BMW (5).webp', fullSrc: 'images/Events/BMW (5).webp', alt: 'BMW Fest 5' },
          { src: 'images/Blur/Events/BMW (6).webp', fullSrc: 'images/Events/BMW (6).webp', alt: 'BMW Fest 6' },
        ]
      },
      {
        title: 'Baptism',
        images: [
          { src: 'images/Blur/Events/Baptism (1).webp', fullSrc: 'images/Events/Baptism (1).webp', alt: 'Baptism 1' },
          { src: 'images/Blur/Events/Baptism (2).webp', fullSrc: 'images/Events/Baptism (2).webp', alt: 'Baptism 2' },
          { src: 'images/Blur/Events/Baptism (3).webp', fullSrc: 'images/Events/Baptism (3).webp', alt: 'Baptism 3' },
          { src: 'images/Blur/Events/Baptism (4).webp', fullSrc: 'images/Events/Baptism (4).webp', alt: 'Baptism 4' },
        ]
      },
      {
        title: 'Serres',
        images: [
          { src: 'images/Blur/Events/Serres (1).webp', fullSrc: 'images/Events/Serres (1).webp', alt: 'Serres 1' },
          { src: 'images/Blur/Events/Serres (2).webp', fullSrc: 'images/Events/Serres (2).webp', alt: 'Serres 2' },
          { src: 'images/Blur/Events/Serres (3).webp', fullSrc: 'images/Events/Serres (3).webp', alt: 'Serres 3' },
          { src: 'images/Blur/Events/Serres (4).webp', fullSrc: 'images/Events/Serres (4).webp', alt: 'Serres 4' },
        ]
      },
      {
        title: 'Sejong Culture Academy',
        images: [
          { src: 'images/Blur/Events/Korea (1).webp', fullSrc: 'images/Events/Korea (1).webp', alt: 'Korea 1' },
          { src: 'images/Blur/Events/Korea (2).webp', fullSrc: 'images/Events/Korea (2).webp', alt: 'Korea 2' },
          { src: 'images/Blur/Events/Korea (3).webp', fullSrc: 'images/Events/Korea (3).webp', alt: 'Korea 3' },
          { src: 'images/Blur/Events/Korea (4).webp', fullSrc: 'images/Events/Korea (4).webp', alt: 'Korea 4' },
        ]
      },
    ]
  },
  {
    id: 'nature',
    label: 'Nature',
    cover: 'images/Album/Nature.webp',
    albums: [
      {
        title: 'Transfagarasan, Romania',
        images: [
          { src: 'images/Blur/Nature/Fag (1).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Fag_1.webp', alt: 'Transfagarasan 1' },
          { src: 'images/Blur/Nature/Fag (3).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Fag_3.webp', alt: 'Transfagarasan 3' },
          { src: 'images/Blur/Nature/Fag (5).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Fag_5.webp', alt: 'Transfagarasan 5' },
        ]
      },
      {
        title: 'North America',
        images: [
          { src: 'images/Blur/Nature/NA (1).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_1.webp', alt: 'North America 1' },
          { src: 'images/Blur/Nature/NA (2).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_2.webp', alt: 'North America 2' },
          { src: 'images/Blur/Nature/NA (4).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_4.webp', alt: 'North America 4' },
          { src: 'images/Blur/Nature/NA (3).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_3.webp', alt: 'North America 3' },
          { src: 'images/Blur/Nature/NA (9).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_9.webp', alt: 'North America 9' },
          { src: 'images/Blur/Nature/NA (5).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_5.webp', alt: 'North America 5' },
          { src: 'images/Blur/Nature/NA (6).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_6.webp', alt: 'North America 6' },
          { src: 'images/Blur/Nature/NA (7).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_7.webp', alt: 'North America 7' },
          { src: 'images/Blur/Nature/NA (8).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/NA_8.webp', alt: 'North America 8' },
        ]
      },
      {
        title: 'Bulgaria',
        images: [
          { src: 'images/Blur/Nature/BG (1).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BG_1.webp', alt: 'Bulgaria 1' },
          { src: 'images/Blur/Nature/BG (3).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BG_3.webp', alt: 'Bulgaria 3' },
          { src: 'images/Blur/Nature/BG (4).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BG_4.webp', alt: 'Bulgaria 4' },
          { src: 'images/Blur/Nature/BG (2).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/BG_2.webp', alt: 'Bulgaria 2' },
        ]
      },
      {
        title: 'South America',
        images: [
          { src: 'images/Blur/Nature/SA (1).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/SA_1.webp', alt: 'South America 1' },
          { src: 'images/Blur/Nature/SA (2).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/SA_2.webp', alt: 'South America 2' },
          { src: 'images/Blur/Nature/SA (3).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/SA_3.webp', alt: 'South America 3' },
          { src: 'images/Blur/Nature/SA (4).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/SA_4.webp', alt: 'South America 4' },
          { src: 'images/Blur/Nature/SA (5).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/SA_5.webp', alt: 'South America 5' },
          { src: 'images/Blur/Nature/SA (6).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/SA_6.webp', alt: 'South America 6' },
          { src: 'images/Blur/Nature/SA (9).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/SA_9.webp', alt: 'South America 9' },
        ]
      },
      {
        title: 'Transalpina, Romania',
        images: [
          { src: 'images/Blur/Nature/Alpina (2).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Alpina_2.webp', alt: 'Transalpina 2' },
          { src: 'images/Blur/Nature/Alpina (1).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Alpina_1.webp', alt: 'Transalpina 1' },
          { src: 'images/Blur/Nature/Alpina (3).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Alpina_3.webp', alt: 'Transalpina 3' },
          { src: 'images/Blur/Nature/Alpina (4).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/Alpina_4.webp', alt: 'Transalpina 4' },
        ]
      },
      {
        title: 'Germany',
        images: [
          { src: 'images/Blur/Nature/DE (1).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/DE_1.webp', alt: 'Germany 1' },
          { src: 'images/Blur/Nature/DE (2).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/DE_2.webp', alt: 'Germany 2' },
          { src: 'images/Blur/Nature/DE (3).webp', fullSrc: 'https://res.cloudinary.com/dtezleq3h/image/upload/w_auto,f_auto/v1760027584/DE_3.webp', alt: 'Germany 3' },
        ]
      },
    ]
  },
  {
    id: 'night',
    label: 'Night',
    cover: 'images/Album/Night.webp',
    images: [
      { src: 'images/Blur/Night/Night (1).webp',  fullSrc: 'images/Night/Night (1).webp',  alt: 'Night 1' },
      { src: 'images/Blur/Night/Night (2).webp',  fullSrc: 'images/Night/Night (2).webp',  alt: 'Night 2' },
      { src: 'images/Blur/Night/Night (3).webp',  fullSrc: 'images/Night/Night (3).webp',  alt: 'Night 3' },
      { src: 'images/Blur/Night/Night (4).webp',  fullSrc: 'images/Night/Night (4).webp',  alt: 'Night 4' },
      { src: 'images/Blur/Night/Night (5).webp',  fullSrc: 'images/Night/Night (5).webp',  alt: 'Night 5' },
      { src: 'images/Blur/Night/Night (6).webp',  fullSrc: 'images/Night/Night (6).webp',  alt: 'Night 6' },
      { src: 'images/Blur/Night/Night (7).webp',  fullSrc: 'images/Night/Night (7).webp',  alt: 'Night 7' },
      { src: 'images/Blur/Night/Night (8).webp',  fullSrc: 'images/Night/Night (8).webp',  alt: 'Night 8' },
      { src: 'images/Blur/Night/Night (12).webp', fullSrc: 'images/Night/Night (12).webp', alt: 'Night 12' },
      { src: 'images/Blur/Night/Night (9).webp',  fullSrc: 'images/Night/Night (9).webp',  alt: 'Night 9' },
      { src: 'images/Blur/Night/Night (10).webp', fullSrc: 'images/Night/Night (10).webp', alt: 'Night 10' },
      { src: 'images/Blur/Night/Night (11).webp', fullSrc: 'images/Night/Night (11).webp', alt: 'Night 11' },
    ]
  },
  {
    id: 'people',
    label: 'People',
    cover: 'images/Album/People.webp',
    albums: [
      {
        title: 'Iva',
        images: [
          { src: 'images/Blur/People/Iva (1).webp', fullSrc: 'images/People/Iva (1).webp', alt: 'Iva 1' },
          { src: 'images/Blur/People/Iva (2).webp', fullSrc: 'images/People/Iva (2).webp', alt: 'Iva 2' },
          { src: 'images/Blur/People/Iva (3).webp', fullSrc: 'images/People/Iva (3).webp', alt: 'Iva 3' },
          { src: 'images/Blur/People/Iva (4).webp', fullSrc: 'images/People/Iva (4).webp', alt: 'Iva 4' },
          { src: 'images/Blur/People/Iva (5).webp', fullSrc: 'images/People/Iva (5).webp', alt: 'Iva 5' },
          { src: 'images/Blur/People/Iva (6).webp', fullSrc: 'images/People/Iva (6).webp', alt: 'Iva 6' },
        ]
      },
      {
        title: 'Lusi',
        images: [
          { src: 'images/Blur/People/Lusi (1).webp', fullSrc: 'images/People/Lusi (1).webp', alt: 'Lusi 1' },
          { src: 'images/Blur/People/Lusi (2).webp', fullSrc: 'images/People/Lusi (2).webp', alt: 'Lusi 2' },
          { src: 'images/Blur/People/Lusi (3).webp', fullSrc: 'images/People/Lusi (3).webp', alt: 'Lusi 3' },
          { src: 'images/Blur/People/Lusi (4).webp', fullSrc: 'images/People/Lusi (4).webp', alt: 'Lusi 4' },
          { src: 'images/Blur/People/Lusi (5).webp', fullSrc: 'images/People/Lusi (5).webp', alt: 'Lusi 5' },
          { src: 'images/Blur/People/Lusi (6).webp', fullSrc: 'images/People/Lusi (6).webp', alt: 'Lusi 6' },
        ]
      },
      {
        title: 'AsWarrior',
        images: [
          { src: 'images/Blur/People/ASW (1).webp', fullSrc: 'images/People/ASW (1).webp', alt: 'AsWarrior 1' },
          { src: 'images/Blur/People/ASW (2).webp', fullSrc: 'images/People/ASW (2).webp', alt: 'AsWarrior 2' },
          { src: 'images/Blur/People/ASW (3).webp', fullSrc: 'images/People/ASW (3).webp', alt: 'AsWarrior 3' },
          { src: 'images/Blur/People/ASW (4).webp', fullSrc: 'images/People/ASW (4).webp', alt: 'AsWarrior 4' },
          { src: 'images/Blur/People/ASW (5).webp', fullSrc: 'images/People/ASW (5).webp', alt: 'AsWarrior 5' },
          { src: 'images/Blur/People/ASW (6).webp', fullSrc: 'images/People/ASW (6).webp', alt: 'AsWarrior 6' },
        ]
      },
    ]
  },
  {
    id: 'urban',
    label: 'Urban',
    cover: 'images/Album/Urban.webp',
    albums: [
      {
        title: 'Berlin, Germany',
        images: [
          { src: 'images/Blur/Urban/Berlin (1).webp', fullSrc: 'images/Urban/Berlin (1).webp', alt: 'Berlin 1' },
          { src: 'images/Blur/Urban/Berlin (2).webp', fullSrc: 'images/Urban/Berlin (2).webp', alt: 'Berlin 2' },
          { src: 'images/Blur/Urban/Berlin (3).webp', fullSrc: 'images/Urban/Berlin (3).webp', alt: 'Berlin 3' },
        ]
      },
      {
        title: 'Bucharest, Romania',
        images: [
          { src: 'images/Blur/Urban/Bucharest (1).webp', fullSrc: 'images/Urban/Bucharest (1).webp', alt: 'Bucharest 1' },
          { src: 'images/Blur/Urban/Bucharest (2).webp', fullSrc: 'images/Urban/Bucharest (2).webp', alt: 'Bucharest 2' },
          { src: 'images/Blur/Urban/Bucharest (4).webp', fullSrc: 'images/Urban/Bucharest (4).webp', alt: 'Bucharest 4' },
        ]
      },
      {
        title: 'Budapest, Hungary',
        images: [
          { src: 'images/Blur/Urban/Budapest (1).webp', fullSrc: 'images/Urban/Budapest (1).webp', alt: 'Budapest 1' },
          { src: 'images/Blur/Urban/Budapest (2).webp', fullSrc: 'images/Urban/Budapest (2).webp', alt: 'Budapest 2' },
          { src: 'images/Blur/Urban/Budapest (3).webp', fullSrc: 'images/Urban/Budapest (3).webp', alt: 'Budapest 3' },
          { src: 'images/Blur/Urban/Budapest (4).webp', fullSrc: 'images/Urban/Budapest (4).webp', alt: 'Budapest 4' },
          { src: 'images/Blur/Urban/Budapest (5).webp', fullSrc: 'images/Urban/Budapest (5).webp', alt: 'Budapest 5' },
          { src: 'images/Blur/Urban/Budapest (6).webp', fullSrc: 'images/Urban/Budapest (6).webp', alt: 'Budapest 6' },
        ]
      },
      {
        title: 'Corvin, Romania',
        images: [
          { src: 'images/Blur/Urban/Corvin (1).webp', fullSrc: 'images/Urban/Corvin (1).webp', alt: 'Corvin 1' },
          { src: 'images/Blur/Urban/Corvin (5).webp', fullSrc: 'images/Urban/Corvin (5).webp', alt: 'Corvin 5' },
          { src: 'images/Blur/Urban/Corvin (2).webp', fullSrc: 'images/Urban/Corvin (2).webp', alt: 'Corvin 2' },
          { src: 'images/Blur/Urban/Corvin (3).webp', fullSrc: 'images/Urban/Corvin (3).webp', alt: 'Corvin 3' },
          { src: 'images/Blur/Urban/Corvin (4).webp', fullSrc: 'images/Urban/Corvin (4).webp', alt: 'Corvin 4' },
          { src: 'images/Blur/Urban/Corvin (6).webp', fullSrc: 'images/Urban/Corvin (6).webp', alt: 'Corvin 6' },
        ]
      },
      {
        title: 'Kyoto, Japan',
        images: [
          { src: 'images/Blur/Urban/Kyoto (1).webp', fullSrc: 'images/Urban/Kyoto (1).webp', alt: 'Kyoto 1' },
          { src: 'images/Blur/Urban/Kyoto (2).webp', fullSrc: 'images/Urban/Kyoto (2).webp', alt: 'Kyoto 2' },
          { src: 'images/Blur/Urban/Kyoto (3).webp', fullSrc: 'images/Urban/Kyoto (3).webp', alt: 'Kyoto 3' },
          { src: 'images/Blur/Urban/Kyoto (4).webp', fullSrc: 'images/Urban/Kyoto (4).webp', alt: 'Kyoto 4' },
          { src: 'images/Blur/Urban/Kyoto (5).webp', fullSrc: 'images/Urban/Kyoto (5).webp', alt: 'Kyoto 5' },
          { src: 'images/Blur/Urban/Kyoto (6).webp', fullSrc: 'images/Urban/Kyoto (6).webp', alt: 'Kyoto 6' },
        ]
      },
      {
        title: 'Mannheim, Germany',
        images: [
          { src: 'images/Blur/Urban/Mannheim (1).webp', fullSrc: 'images/Urban/Mannheim (1).webp', alt: 'Mannheim 1' },
          { src: 'images/Blur/Urban/Mannheim (2).webp', fullSrc: 'images/Urban/Mannheim (2).webp', alt: 'Mannheim 2' },
          { src: 'images/Blur/Urban/Mannheim (3).webp', fullSrc: 'images/Urban/Mannheim (3).webp', alt: 'Mannheim 3' },
          { src: 'images/Blur/Urban/Mannheim (4).webp', fullSrc: 'images/Urban/Mannheim (4).webp', alt: 'Mannheim 4' },
          { src: 'images/Blur/Urban/Mannheim (5).webp', fullSrc: 'images/Urban/Mannheim (5).webp', alt: 'Mannheim 5' },
          { src: 'images/Blur/Urban/Mannheim (6).webp', fullSrc: 'images/Urban/Mannheim (6).webp', alt: 'Mannheim 6' },
        ]
      },
      {
        title: 'Osaka, Japan',
        images: [
          { src: 'images/Blur/Urban/Osaka (1).webp', fullSrc: 'images/Urban/Osaka (1).webp', alt: 'Osaka 1' },
          { src: 'images/Blur/Urban/Osaka (2).webp', fullSrc: 'images/Urban/Osaka (2).webp', alt: 'Osaka 2' },
          { src: 'images/Blur/Urban/Osaka (3).webp', fullSrc: 'images/Urban/Osaka (3).webp', alt: 'Osaka 3' },
          { src: 'images/Blur/Urban/Osaka (4).webp', fullSrc: 'images/Urban/Osaka (4).webp', alt: 'Osaka 4' },
          { src: 'images/Blur/Urban/Osaka (5).webp', fullSrc: 'images/Urban/Osaka (5).webp', alt: 'Osaka 5' },
          { src: 'images/Blur/Urban/Osaka (6).webp', fullSrc: 'images/Urban/Osaka (6).webp', alt: 'Osaka 6' },
        ]
      },
      {
        title: 'Rio de Janeiro, Brasil',
        images: [
          { src: 'images/Blur/Urban/Rio (1).webp', fullSrc: 'images/Urban/Rio (1).webp', alt: 'Rio 1' },
          { src: 'images/Blur/Urban/Rio (2).webp', fullSrc: 'images/Urban/Rio (2).webp', alt: 'Rio 2' },
          { src: 'images/Blur/Urban/Rio (3).webp', fullSrc: 'images/Urban/Rio (3).webp', alt: 'Rio 3' },
          { src: 'images/Blur/Urban/Rio (4).webp', fullSrc: 'images/Urban/Rio (4).webp', alt: 'Rio 4' },
        ]
      },
      {
        title: 'Rome, Italy',
        images: [
          { src: 'images/Blur/Urban/Rome (1).webp', fullSrc: 'images/Urban/Rome (1).webp', alt: 'Rome 1' },
          { src: 'images/Blur/Urban/Rome (2).webp', fullSrc: 'images/Urban/Rome (2).webp', alt: 'Rome 2' },
          { src: 'images/Blur/Urban/Rome (3).webp', fullSrc: 'images/Urban/Rome (3).webp', alt: 'Rome 3' },
        ]
      },
      {
        title: 'Sibiu, Romania',
        images: [
          { src: 'images/Blur/Urban/Sibiu (1).webp', fullSrc: 'images/Urban/Sibiu (1).webp', alt: 'Sibiu 1' },
          { src: 'images/Blur/Urban/Sibiu (2).webp', fullSrc: 'images/Urban/Sibiu (2).webp', alt: 'Sibiu 2' },
          { src: 'images/Blur/Urban/Sibiu (3).webp', fullSrc: 'images/Urban/Sibiu (3).webp', alt: 'Sibiu 3' },
        ]
      },
      {
        title: 'Vienna, Austria',
        images: [
          { src: 'images/Blur/Urban/Vienna (1).webp', fullSrc: 'images/Urban/Vienna (1).webp', alt: 'Vienna 1' },
          { src: 'images/Blur/Urban/Vienna (2).webp', fullSrc: 'images/Urban/Vienna (2).webp', alt: 'Vienna 2' },
          { src: 'images/Blur/Urban/Vienna (3).webp', fullSrc: 'images/Urban/Vienna (3).webp', alt: 'Vienna 3' },
          { src: 'images/Blur/Urban/Vienna (4).webp', fullSrc: 'images/Urban/Vienna (4).webp', alt: 'Vienna 4' },
          { src: 'images/Blur/Urban/Vienna (5).webp', fullSrc: 'images/Urban/Vienna (5).webp', alt: 'Vienna 5' },
          { src: 'images/Blur/Urban/Vienna (6).webp', fullSrc: 'images/Urban/Vienna (6).webp', alt: 'Vienna 6' },
        ]
      },
    ]
  },
];
```

---

## Task 2: Update `script.js`

**Files:**
- Modify: `script.js`

Three changes: add `renderGallery()` + `itemHTML()`, fix one `querySelector` in `applyFilter()`, and call `renderGallery()` first in `DOMContentLoaded`.

- [ ] **Step 1: Add `renderGallery()` and `itemHTML()` before `initGalleryFilter()`**

Insert these two functions anywhere before the `initGalleryFilter` function definition (e.g., right after line 61, the closing `}`  of `DOMContentLoaded`):

```js
function renderGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  const overviewHTML = `
    <div class="gallery-grid gallery-grid--all-view" id="overview-grid">
      ${GALLERY_DATA.map(cat => `
        <div class="category-overview-item" data-category="overview" onclick="filterCategory('${cat.id}')">
          <img src="${cat.cover}" alt="${cat.label} Category" loading="lazy">
          <div class="category-overlay">
            <div class="category-content"><h3>${cat.label}</h3></div>
          </div>
        </div>
      `).join('')}
    </div>`;

  const gridsHTML = GALLERY_DATA.map(cat => {
    if (cat.images) {
      return `
        <div class="gallery-grid">
          ${cat.images.map(img => itemHTML(img, cat.id)).join('')}
        </div>`;
    } else {
      return cat.albums.map(album => `
        <h3 class="album-title" data-category="${cat.id}">${album.title}</h3>
        <div class="gallery-grid">
          ${album.images.map(img => itemHTML(img, cat.id)).join('')}
        </div>
      `).join('');
    }
  }).join('');

  container.innerHTML = overviewHTML + gridsHTML;
}

function itemHTML(img, category) {
  const fullSrcAttr = img.fullSrc ? `data-src="${img.fullSrc}"` : '';
  return `
    <div class="gallery-item" data-category="${category}" onclick="openModal(this)">
      <img src="${img.src}" ${fullSrcAttr} alt="${img.alt}" loading="lazy">
    </div>`;
}
```

- [ ] **Step 2: Call `renderGallery()` first in `DOMContentLoaded`**

In `script.js` around line 9, the `DOMContentLoaded` listener starts with `initNavigation()`. Add `renderGallery()` as the very first call:

```js
document.addEventListener('DOMContentLoaded', function() {
    renderGallery();       // ← add this line first
    initNavigation();
    initGalleryFilter();
    // ... rest unchanged
```

- [ ] **Step 3: Fix `querySelector` in `applyFilter()`**

In `applyFilter()` (around line 162), find this line:

```js
const galleryGrid = document.querySelector('.gallery-grid');
```

Replace it with:

```js
const galleryGrid = document.getElementById('overview-grid');
```

This targets the overview grid explicitly instead of whichever `.gallery-grid` happens to be first in the DOM.

---

## Task 3: Update `gallery.html`

**Files:**
- Modify: `gallery.html`

Two changes: replace the gallery grid content with `#gallery-container`, and add the `gallery-data.js` script tag.

- [ ] **Step 1: Replace gallery content with the container div**

In `gallery.html`, the gallery content spans from line 93 to line 1283 — this is everything inside `<section class="gallery-section"><div class="container">` after the filter tabs `</div>` and before the closing `</div></section>`.

Replace this entire block (from the first `<div class="gallery-grid" id="gallery-grid">` at line 93 through the closing `</div>` of the container at line 1283) with a single line:

```html
            <div id="gallery-container"></div>
```

The section should look like this after the change:

```html
    <section class="gallery-section">
        <div class="container">
            <div class="filter-tabs">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="aerial">Aerial</button>
                <button class="filter-btn" data-filter="astro">Astro</button>
                <button class="filter-btn" data-filter="bandw">B&W</button>
                <button class="filter-btn" data-filter="cars">Cars</button>
                <button class="filter-btn" data-filter="event">Events</button>
                <button class="filter-btn" data-filter="nature">Nature</button>
                <button class="filter-btn" data-filter="night">Night</button>
                <button class="filter-btn" data-filter="people">People</button>
                <button class="filter-btn" data-filter="urban">Urban</button>
            </div>

            <div id="gallery-container"></div>

        </div>
    </section>
```

- [ ] **Step 2: Add `gallery-data.js` script tag**

Near the bottom of `gallery.html`, just before the existing `<script src="script.js?v=1.0.46">` line, add:

```html
    <script src="gallery-data.js?v=1.0.46"></script>
    <script src="script.js?v=1.0.46"></script>
```

---

## Task 4: Update `bg/gallery.html`

**Files:**
- Modify: `bg/gallery.html`

Same two changes as Task 3. The Bulgarian page uses `../` prefix for all assets since it lives in the `bg/` subdirectory.

- [ ] **Step 1: Replace gallery content with the container div**

In `bg/gallery.html`, find the same gallery grid content block (starts after the filter tabs `</div>`, ends before the modal section). Replace the entire block with:

```html
            <div id="gallery-container"></div>
```

The section should look like this after the change:

```html
    <section class="gallery-section">
        <div class="container">
            <div class="filter-tabs">
                <button class="filter-btn active" data-filter="all">Всички</button>
                <button class="filter-btn" data-filter="aerial">Aerial</button>
                <button class="filter-btn" data-filter="astro">Astro</button>
                <button class="filter-btn" data-filter="bandw">B&W</button>
                <button class="filter-btn" data-filter="cars">Cars</button>
                <button class="filter-btn" data-filter="event">Събития</button>
                <button class="filter-btn" data-filter="nature">Природа</button>
                <button class="filter-btn" data-filter="night">Нощ</button>
                <button class="filter-btn" data-filter="people">Хора</button>
                <button class="filter-btn" data-filter="urban">Градски</button>
            </div>

            <div id="gallery-container"></div>

        </div>
    </section>
```

- [ ] **Step 2: Add `gallery-data.js` script tag**

Near the bottom of `bg/gallery.html`, just before `<script src="../script.js?v=1.0.46">`, add:

```html
    <script src="../gallery-data.js?v=1.0.46"></script>
    <script src="../script.js?v=1.0.46"></script>
```

---

## Task 5: Manual Verification

**Files:** None — browser testing only.

Open `gallery.html` in a browser (use a local server or open directly). Check each item below.

- [ ] **Step 1: Check "All" view**

Page loads showing 9 overview cards (Aerial, Astro, B&W, Cars, Events, Nature, Night, People, Urban). No individual photos visible.

- [ ] **Step 2: Check filter buttons**

Click each filter button. The correct category photos and album titles appear. Click "All" again — overview cards return, photos hide.

- [ ] **Step 3: Check overview card click**

Click one of the 9 overview cards (e.g., "Cars"). The filter switches to that category and photos appear.

- [ ] **Step 4: Check modal**

Click any photo. Modal opens showing the image. Previous/next buttons navigate within the category. Clicking outside or pressing the X closes it.

- [ ] **Step 5: Check lazy loading**

Open browser DevTools → Network tab → filter by "Img". Scroll down through a category. Images further down the page should start loading only as they enter the viewport, not all at once on page load.

- [ ] **Step 6: Check `bg/gallery.html`**

Open `bg/gallery.html`. Same checks as steps 1–5. Bulgarian filter labels should show ("Всички", etc.). Images and categories load correctly.

- [ ] **Step 7: Verify no console errors**

Open DevTools → Console. No errors should appear on page load or during any filtering/modal interaction.
