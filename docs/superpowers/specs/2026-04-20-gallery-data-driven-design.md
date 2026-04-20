# Gallery Data-Driven Refactor — Design Spec
**Date:** 2026-04-20
**Status:** Approved

## Problem

`gallery.html` is 1,360 lines of near-identical repetitive HTML. Every image requires 3–4 lines of copy-pasted markup. There are 30+ elements sharing `id="gallery-grid"` (invalid HTML). Adding a new photo means manually editing raw HTML. The file will keep growing unboundedly.

## Goal

Reduce `gallery.html` to ~120 lines by moving all image data into a JS data file and rendering the gallery DOM at page load. No visual or behavioural changes — identical output, identical styling, identical interactions.

---

## Architecture

### Files Changed

| File | Change |
|------|--------|
| `gallery.html` | Shrinks from 1,360 → ~120 lines. Keeps nav, hero, filter tabs, modal, footer. Gallery content replaced with `<div id="gallery-container"></div>`. |
| `gallery-data.js` (new) | Single `const GALLERY_DATA` array — all image data, covers, album titles. |
| `script.js` | Add `renderGallery()` and `itemHTML()` helpers. Fix one `querySelector` in `applyFilter()`. Call order updated in `DOMContentLoaded`. |
| `bg/gallery.html` | Same structural change as `gallery.html` — same data file, Bulgarian UI text only. |

### Data Flow

```
gallery-data.js  →  renderGallery()  →  #gallery-container innerHTML
                                               ↓
                          existing applyFilter() / openModal() work unchanged
```

---

## Data Structure (`gallery-data.js`)

`GALLERY_DATA` is an array of category objects. Two shapes:

### Flat category (aerial, astro, b&w, night)
```js
{
  id: 'aerial',
  label: 'Aerial',
  cover: 'images/Album/Aerial.webp',
  images: [
    { src: 'images/Blur/Aerial/Aerial (1).webp', fullSrc: 'images/Aerial/Aerial (1).webp', alt: 'Aerial 1' },
    ...
  ]
}
```

### Album-based category (cars, events, nature, urban, people)
```js
{
  id: 'cars',
  label: 'Cars',
  cover: 'images/Album/Car.webp',
  albums: [
    {
      title: 'Audi RS6',
      images: [
        { src: 'https://res.cloudinary.com/.../Audi_RS6_1.webp', alt: 'Audi RS6 1' },
        ...
      ]
    },
    ...
  ]
}
```

### Image object fields

| Field | Required | Description |
|-------|----------|-------------|
| `src` | Yes | Thumbnail/blur shown in the grid |
| `fullSrc` | No | High-res version loaded in modal. If absent, `src` is used |
| `alt` | Yes | Alt text |

### Three image variants handled

| Variant | Example categories | `src` | `fullSrc` |
|---|---|---|---|
| Local blur → local full | Aerial, Night, Events, People, Urban | `images/Blur/...` | `images/Category/...` |
| Cloudinary only | Cars | cloudinary URL | *(omitted)* |
| Local blur → cloudinary full | Nature | `images/Blur/Nature/...` | cloudinary URL |

---

## Rendering (`script.js`)

### `renderGallery()`

Builds and injects all gallery HTML once on page load:

```js
function renderGallery() {
  const container = document.getElementById('gallery-container');

  const overviewHTML = `
    <div class="gallery-grid gallery-grid--all-view" id="overview-grid">
      ${GALLERY_DATA.map(cat => `
        <div class="category-overview-item" data-category="overview"
             onclick="filterCategory('${cat.id}')">
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

### `DOMContentLoaded` call order

```js
renderGallery();       // build DOM first
initGalleryFilter();   // wire up filter buttons
initLazyLoading();     // set up IntersectionObserver
```

### One fix in `applyFilter()`

`document.querySelector('.gallery-grid')` → `document.getElementById('overview-grid')`

Reason: current code grabs whichever `.gallery-grid` is first in the DOM to toggle `gallery-grid--all-view`. With dynamic rendering the first grid is reliably `#overview-grid`, so targeting by ID is explicit and safe.

---

## What Does NOT Change

- `styles.css` — untouched. Same class names, same styles.
- Modal logic (`openModal`, `displayCurrentImage`, `navigateImage`)
- Filter logic (`applyFilter`, `filterCategory`, `initGalleryFilter`)
- Lazy loading (`initLazyLoading`)
- All other pages (`index.html`, `prom.html`, `contact.html`)

---

## Benefits

- `gallery.html` shrinks ~90% (1,360 → ~120 lines)
- Duplicate `id="gallery-grid"` bug eliminated
- `loading="lazy"` applied to every image automatically
- Adding a new photo = one line in `gallery-data.js`
- `bg/gallery.html` stays in sync trivially — shares the same data file
