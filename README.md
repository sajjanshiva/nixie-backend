# Nixie AI Outfit Analysis & Lead Capture - v3

## What changed from v2

- **Removed the category-detection step entirely.** v2 did 2 AI calls (category
  first, then outfit+fabric narrowed to that category). v3 does ONE AI call
  against the full outfit list. Deliberate trade-off (simpler UX, faster,
  one less screen) confirmed with the tech lead - this reintroduces some of
  the outfit-confusion risk the two-stage design was meant to reduce, so the
  Description column on each outfit matters more now, not less.
- **UI polish across every screen**: animated spinner with rotating status
  text during the AI call, a 3-dot step indicator (Photo / Details /
  Contact), color-coded confidence badges (green/yellow/red), smooth
  fade-in transitions, better focus states on inputs, and a redesigned
  Thank You screen with an animated checkmark and a "what happens next" list.
- **Hardened lead submission**: `category` is no longer a hard-required
  field for Draft Order creation - it's looked up automatically from the
  detected outfit's sheet row for staff reference only, and now defaults to
  "Unknown" instead of blocking submission if that cell happens to be blank
  in the sheet. Outfit/fabric/price remain required, since those come
  directly from AI detection and are never missing in practice.

## Flow

```
Step 1: Upload photo -> single AI call (outfit + primary/secondary fabric(s), all 124 outfits)
Step 2: Result screen - outfit, primary fabric, secondary fabric(s), price, confidence badges
        -> "Analyze Another" | "Contact Us" | Instagram link
Step 3: "Get in Touch" form: Name, Phone, Email, Address, City, State, Pincode
        -> Back (to Step 2)
Step 4: Submit -> Draft Order created (all data as custom line item properties)
Step 5: "Thanks, we'll be in touch!"
```

No login, no category step, no measurements, no checkout/payment.

## Setup

Same as before - `npm install` in both `backend/` and `frontend/`, copy
`.env.example` to `.env`, fill in real credentials, run `test-sheets.js`
before starting the backend.

## Google Sheet requirements (unchanged from v2)

The **Outfit** tab needs `Category` and `Description` columns filled in.
`Category` is used only for lead record labeling now (not for narrowing the
AI's outfit list, since that step was removed) - a blank cell here no longer
breaks anything, but `Description` still directly affects AI accuracy since
it's the only thing helping Gemini distinguish 124 outfits in one prompt.

Outfits tagged `Manual Review` are automatically excluded from what the AI
can detect (`pricing.getAllOutfits()` filters them out) - if the sheet no
longer has any such rows, this is a harmless no-op.

## Multi-fabric pricing (unchanged from v2)

```
combinedFabricWeight = primaryFabricWeight + 0.35 * sum(secondaryFabricWeights)
score = combinedFabricWeight + outfit.weight + outfit.metreageWeight + outfit.liningWeight
finalPrice = bracket.priceMin + 80% * (bracket.priceMax - bracket.priceMin)
```

The `0.35` lives as `SECONDARY_FABRIC_DAMPING` in `backend/src/services/pricing.js`.

## Known issue carried over from v2 - still needs a decision

With 2 max-weight secondary fabrics, 30 of 124 outfits can score above the
Price Brackets table's current ceiling (27.8). The code fails loudly rather
than guessing a price. Needs the Price Brackets top bracket extended, with a
confirmed new ceiling score/price from whoever owns pricing strategy.
