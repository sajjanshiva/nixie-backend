import { useState } from "react";
import { recalculatePrice } from "../api/client";
import ConfidenceBadge from "./ConfidenceBadge";
import StepIndicator from "./StepIndicator";

export default function ResultStep({ data, onUpdate, onContactUs, onAnalyzeAnother }) {
  const [outfitType, setOutfitType] = useState(data.outfitType);
  const [primaryFabric, setPrimaryFabric] = useState(data.primaryFabric);
  // Fixed count, matching whatever the AI returned - no adding/removing slots.
  const [secondaryFabrics, setSecondaryFabrics] = useState(
    data.secondaryFabrics.map((f) => f.name)
  );
  const [confidences] = useState({
    outfit: data.outfitConfidence,
    primary: data.primaryFabricConfidence,
    secondary: data.secondaryFabrics.map((f) => f.confidence),
  });
  const [price, setPrice] = useState(data.price);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState(null);

  async function recalc(nextOutfitType, nextPrimary, nextSecondaries) {
    setRecalculating(true);
    setError(null);
    try {
      const fabrics = [
        { name: nextPrimary, role: "primary" },
        ...nextSecondaries.map((name) => ({ name, role: "secondary" })),
      ];
      const { price: newPrice } = await recalculatePrice(nextOutfitType, fabrics);
      setPrice(newPrice);
    } catch (err) {
      setError(err.message);
    } finally {
      setRecalculating(false);
    }
  }

  function handleOutfitChange(next) {
    setOutfitType(next);
    recalc(next, primaryFabric, secondaryFabrics);
  }

  function handlePrimaryChange(next) {
    setPrimaryFabric(next);
    recalc(outfitType, next, secondaryFabrics);
  }

  function handleSecondaryChange(index, next) {
    const updated = [...secondaryFabrics];
    updated[index] = next;
    setSecondaryFabrics(updated);
    recalc(outfitType, primaryFabric, updated);
  }

  function currentSnapshot() {
    return {
      outfitType,
      primaryFabric,
      secondaryFabrics: secondaryFabrics.map((name) => ({ name })),
      price,
    };
  }

  function handleContactClick() {
    onUpdate(currentSnapshot());
    onContactUs();
  }

  function fabricOptionsExcluding(excludeValues) {
    return data.validFabricTypes.filter((f) => !excludeValues.includes(f));
  }

  return (
    <div className="min-h-screen bg-nixieCream flex flex-col items-center px-4 py-12 font-nixie">
      <StepIndicator current={1} />

      <div className="bg-nixieCard rounded-nixie shadow-md p-8 w-full max-w-xl animate-fadeIn">
        <h2 className="text-2xl text-nixieText font-semibold mb-6">Here's what we found</h2>

        <div className="w-full h-64 bg-nixieCream border border-gray-200 rounded-nixie mb-6 flex items-center justify-center overflow-hidden">
          <img src={data.imageUrl} alt="Your reference" className="max-w-full max-h-full object-contain" />
        </div>

        {/* Outfit Type */}
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm text-nixieGray">Outfit Type</label>
          <ConfidenceBadge value={confidences.outfit} />
        </div>
        <select
          value={outfitType}
          onChange={(e) => handleOutfitChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-4 text-nixieText focus:outline-none focus:ring-2 focus:ring-nixieCyan/50 focus:border-nixieCyanDark transition-shadow"
        >
          {data.allOutfits.map((o) => (
            <option key={o.name} value={o.name}>{o.name}</option>
          ))}
        </select>

        {/* Primary Fabric */}
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm text-nixieGray">Primary Fabric</label>
          <ConfidenceBadge value={confidences.primary} />
        </div>
        <select
          value={primaryFabric}
          onChange={(e) => handlePrimaryChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-4 text-nixieText focus:outline-none focus:ring-2 focus:ring-nixieCyan/50 focus:border-nixieCyanDark transition-shadow"
        >
          {fabricOptionsExcluding(secondaryFabrics).concat(primaryFabric)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .sort()
            .map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* Secondary Fabric(s) - count fixed to whatever the AI detected */}
        {secondaryFabrics.map((fabricName, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-nixieGray">Secondary Fabric {i + 1}</label>
              <ConfidenceBadge value={confidences.secondary[i]} />
            </div>
            <select
              value={fabricName}
              onChange={(e) => handleSecondaryChange(i, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-4 text-nixieText focus:outline-none focus:ring-2 focus:ring-nixieCyan/50 focus:border-nixieCyanDark transition-shadow"
            >
              {fabricOptionsExcluding([primaryFabric, ...secondaryFabrics.filter((_, j) => j !== i)])
                .concat(fabricName)
                .filter((v, idx, arr) => arr.indexOf(v) === idx)
                .sort()
                .map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        ))}

        <div className="bg-nixieCream rounded-nixie p-5 mb-6 text-center border border-gray-100">
          <p className="text-sm text-nixieGray mb-1">Estimated Price</p>
          <p className={`text-3xl font-semibold text-nixieText transition-opacity ${recalculating ? "opacity-40" : "opacity-100"}`}>
            ₹{price.finalPrice.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-nixieGray mt-2">
            This is an estimate only. Final price may vary based on actual fabric, design and customization.
          </p>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="flex-1 border border-gray-300 hover:bg-gray-50 transition-colors text-nixieText font-medium px-4 py-3 rounded-full"
          >
            Analyze Another
          </button>
          <button
            type="button"
            disabled={recalculating}
            onClick={handleContactClick}
            className="flex-1 bg-nixieCyan hover:bg-nixieCyanDark active:scale-[0.99] transition-all text-nixieText font-medium px-4 py-3 rounded-full disabled:opacity-50"
          >
            Contact Us
          </button>
        </div>

        <a
          href="https://www.instagram.com/thenixie.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-nixieGray hover:text-nixieText transition-colors text-sm"
        >
          Follow us on Instagram · @thenixie.in
        </a>
      </div>
    </div>
  );
}
