# ABC Mills Pte Ltd - Responsive Static Website

## 🏗️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Semantic structure, SEO |
| CSS3 | Custom properties, Grid, Flexbox, animations |
| Vanilla JavaScript | Interactivity, slider, form validation, scroll animations |
| Google Fonts | Playfair Display + DM Sans |

---

## 📁 File Structure

```
abc_mills_website/
├── index.html          # Home page
├── about.html          # About Us page
├── products.html       # Products & Services page
├── gallery.html        # Gallery page
├── others.html         # Others (FAQs, Testimonials, Certifications)
├── contact.html        # Contact Us page
├── dummy-shop.html     # Mock e-commerce page
├── css/
│   └── style.css      
├── js/    
│   └── main.js      
└── img/
    └── banner
    └── products 
    └── gallery

```

---

## 🎨 Design Highlights

### Color Palette
- **Primary**: #c62828 (Spice Red)
- **Accent**: #f9a825 (Saffron Gold)
- **Background**: #faf8f5 (Warm Cream)
- **Text**: #1a1a1a (Dark)

### Key Features
- **Hero Banner Slider** - Auto-rotating with dot navigation (3 slides)
- **Scroll Animations** - IntersectionObserver for fade-in effects
- **Mobile Hamburger Menu** - Accessible with ARIA attributes
- **FAQ Accordion** - Toggle functionality with keyboard support
- **Contact Form** - Client-side validation with error/success states
- **Product Cards** - Hover effects with gradient backgrounds + emoji icons
- **Gallery Grid** - Responsive masonry-style layout with hover zoom

---

## ♿ Accessibility Features

- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels and roles throughout
- Keyboard-navigable FAQ accordion
- Form validation with clear error messages
- Focus states on interactive elements
- Alt text for all images
- `aria-expanded` for toggle buttons
- `aria-live` for dynamic content updates

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|-----------|--------|
| > 900px | Desktop - Multi-column layouts |
| 640px - 900px | Tablet - 2-column grids |
| < 640px | Mobile - Single column, hamburger menu |
| < 400px | Small mobile - Simplified grids |

---

## 🚀 How to Run

1. Extract the zip file
2. Open any `.html` file in a browser
3. Navigate between pages using the navbar
4. Test responsiveness using browser DevTools

---
