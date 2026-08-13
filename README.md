````markdown
# Nixie AI Outfit Analysis & Lead Capture

AI-powered outfit analysis widget for the Nixie Shopify storefront.

Customers upload an outfit image, AI detects the outfit and fabrics, an estimated price is calculated, and the customer can submit their contact details. The information is saved to a Shopify Draft Order as a **lead record** for staff follow-up.

## ✨ Features

- 📷 Upload an outfit reference image
- 🤖 AI-based outfit and fabric detection
- 👗 Detects **1 primary fabric + up to 2 secondary fabrics**
- 🎯 AI confidence scores for outfit and fabrics
- 🔄 Customer can override detected outfit/fabrics
- 💰 Automatic price calculation
- ⚡ Price recalculates immediately when selections are changed
- 📊 Live pricing/outfit/fabric data from Google Sheets
- 🖼️ Reference image stored using ImageKit
- 📝 Customer lead capture
- 🛍️ Lead saved as a Shopify Draft Order
- 💾 Session persistence using browser `sessionStorage`
- 🚫 No login, payment, checkout, or Shopify customer account required

## Architecture

```text
Shopify Storefront
       ↓
React Widget
       ↓
Node.js / Express Backend
       ↓
 ┌──────────────┬──────────────┬──────────────┐
 ↓              ↓              ↓
Gemini       Google Sheets   ImageKit
AI           Pricing Data    Image Storage
       ↓
Shopify Admin API
       ↓
Draft Order / Lead
````

## AI Detection

The AI uses a single analysis call to detect:

* Outfit type
* Primary fabric
* 0–2 secondary fabrics

All outfits from the Google Sheet are provided to the AI. Each outfit can have a short `Description` to help distinguish visually similar outfits.

There is no separate category-detection step.

## Pricing

Multiple fabrics are handled using a primary-dominant pricing model:

```text
combinedFabricWeight =
    primaryFabricWeight
    + 0.35 × secondaryFabricWeights
```

Then:

```text
score =
    combinedFabricWeight
    + outfitWeight
    + metreageWeight
    + liningWeight
```

The score is matched against the configured Price Brackets from Google Sheets.

The final price is calculated as:

```text
price =
    bracket.min
    + 80% × (bracket.max - bracket.min)
```

The `0.35` secondary-fabric factor is defined as:

```text
SECONDARY_FABRIC_DAMPING
```

in `backend/src/services/pricing.js`.

If the customer changes the outfit or fabric, the price is recalculated automatically.

## Google Sheets

The backend reads three tabs:

### Fabric

```text
Fabric
Weight
```

### Outfit

```text
Outfit
Weight
Metreage
Metreage Weight
Lining
Lining Weight
Description
```

### Price Brackets

```text
Price Brackets
Score Min
Score Max
```

Sheet data is loaded on startup and automatically refreshed every 15 minutes by default.

## Shopify Draft Order

The Draft Order is used only as a **lead record**, not as a real purchase.

The following information is stored as custom line-item properties:

```text
Outfit Type
Primary Fabric
Secondary Fabric 1
Secondary Fabric 2
Main Outfit Image
Name
Phone
Email
Address
City
State
Pincode
```

## Project Structure

```text
nixie-outfit-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── test-sheets.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── ...
│   └── package.json
│
├── .gitignore
└── README.md
```

## Setup

### Backend

```bash
cd backend
npm install
```


Start the backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env` from `.env.example`:

```text
VITE_API_BASE_URL=<backend-url>
```

Start development:

```bash
npm run dev
```

## Shopify Build

Build the frontend for Shopify:

```bash
cd frontend
npm run build
```

This generates the static files in:

```text
frontend/dist/
```

The generated widget assets are uploaded to the Shopify theme's **Assets** folder, and `nixie-widget.liquid` is added as a Shopify theme section.

> `VITE_API_BASE_URL` is embedded during the build, so changing the backend URL requires rebuilding the frontend.

## Environment Variables

### Backend

```text
SHOPIFY_STORE_DOMAIN
SHOPIFY_CLIENT_ID
SHOPIFY_CLIENT_SECRET
SHOPIFY_API_VERSION

IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
IMAGEKIT_URL_ENDPOINT

GEMINI_API_KEY
GEMINI_MODEL

GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

PRICING_REFRESH_INTERVAL_MINUTES
PORT
```

### Frontend

```text
VITE_API_BASE_URL
```

**Never commit `.env` files or API credentials to GitHub.**

```

This is the version I'd actually put in the repository. It has the **important project information without turning the README into technical documentation**.
```
