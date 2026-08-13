import { useState } from "react";
import { submitLead } from "../api/client";
import StepIndicator from "./StepIndicator";

const FIELDS = [
  { key: "name", label: "Name", type: "text" },
  { key: "phone", label: "Phone Number", type: "tel" },
  { key: "email", label: "Email ID", type: "email" },
  { key: "address", label: "Address Line 1", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "pincode", label: "Pincode", type: "text" },
];

export default function ContactForm({ data, onBack, onSubmitted }) {
  const [values, setValues] = useState({
    name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const allFilled = FIELDS.every((f) => values[f.key].trim());

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await submitLead({
        outfitType: data.outfitType,
        finalPrice: data.price.finalPrice,
        primaryFabric: data.primaryFabric,
        secondaryFabrics: data.secondaryFabrics || [],
        mainImageUrl: data.imageUrl,
        ...values,
      });
      onSubmitted();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-nixieCream flex flex-col items-center px-4 py-12 font-nixie">
      <StepIndicator current={2} />

      <div className="bg-nixieCard rounded-nixie shadow-md p-8 w-full max-w-xl animate-fadeIn">
        <h2 className="text-2xl text-nixieText font-semibold mb-1">Get in Touch</h2>
        <p className="text-sm text-nixieGray mb-6">
          Share your details and our team will get back to you.
        </p>

        {FIELDS.map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm text-nixieGray mb-1">{f.label} *</label>
            <input
              type={f.type}
              value={values[f.key]}
              onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-nixieText focus:outline-none focus:ring-2 focus:ring-nixieCyan/50 focus:border-nixieCyanDark transition-shadow"
            />
          </div>
        ))}

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-300 hover:bg-gray-50 transition-colors text-nixieText font-medium px-4 py-3 rounded-full"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!allFilled || submitting}
            onClick={handleSubmit}
            className="flex-1 bg-nixieCyan hover:bg-nixieCyanDark active:scale-[0.99] transition-all text-nixieText font-medium px-4 py-3 rounded-full disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Get in Touch"}
          </button>
        </div>

        <p className="text-xs text-nixieGray text-center flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          We respect your privacy. Your details are safe with us.
        </p>
      </div>
    </div>
  );
}