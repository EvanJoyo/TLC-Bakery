# TLC Bakery - Static Website (Netlify-ready)

This package contains a simple static website for **TLC Bakery** (clean minimalist theme).
It uses plain HTML/CSS/JS and stores the shopping cart in the browser's localStorage.

## What is inside
- `index.html` — Home page
- `menu.html` — Product catalog with image sliders (Swiper) and Add-to-Cart buttons
- `cart.html` — Cart page: edit qty, remove items, send order to WhatsApp
- `style.css` — Central styles
- `script.js` — Product data and cart logic
- `netlify.toml` — Basic Netlify config
- `images/` — (not included) If you want to use local images, create this folder and place images there.

## WhatsApp number
The site is configured to send orders to: **+62811182103**
You can change the number in `script.js` (variable `WHATSAPP_NUMBER`).

## Deploy to Netlify (quick)
1. Create a GitHub repository and push this folder, OR
2. Go to Netlify > "Add new site" > "Deploy site" > "Drag and drop" and upload the zip file.
3. Netlify will host the static site and give you a public URL. You can set a custom domain in Site settings.

## Notes
- Images in the product list are loaded from Unsplash URLs. If you want to use local images, replace URLs in `script.js` with `images/yourfile.jpg` and upload the `images/` folder.
- LocalStorage must be enabled in the browser to persist the cart across pages.
