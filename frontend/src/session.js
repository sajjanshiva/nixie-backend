export const STEPS = {
  UPLOAD: "upload",
  RESULT: "result",
  CONTACT: "contact",
  THANK_YOU: "thank_you",
};

const STORAGE_KEY = "nixieOrderState";

const STORAGE_VERSION = 2;

function isValidOrderData(d) {
  return (
    !!d &&
    typeof d === "object" &&
    typeof d.outfitType === "string" &&
    typeof d.primaryFabric === "string" &&
    Array.isArray(d.secondaryFabrics) &&
    Array.isArray(d.allOutfits) &&
    Array.isArray(d.validFabricTypes) &&
    typeof d.price?.finalPrice === "number"
  );
}

export function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    const usable =
      saved?.version === STORAGE_VERSION &&
      Object.values(STEPS).includes(saved.step) &&
      isValidOrderData(saved.orderData);

    if (!usable) {
      clearSession();
      return null;
    }
    return { step: saved.step, orderData: saved.orderData };
  } catch {
    clearSession();
    return null;
  }
}

export function saveToSession(state) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, version: STORAGE_VERSION })
    );
  } catch {
    // sessionStorage can fail (private browsing, quota) - non-fatal.
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* non-fatal */
  }
}
