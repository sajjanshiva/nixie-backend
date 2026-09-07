import { useState } from "react";
import { submitLead } from "../api/client";

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
    <div className="min-h-screen bg-nixieCream flex flex-col items-center justify-center px-4 py-8 sm:py-12 font-nixie">
      <div className="bg-white rounded-2xl shadow-sm border border-nixieCyan/20 p-5 sm:p-8 w-full max-w-xl animate-slideUp">
        <h2 className="nixie-card-heading text-nixieCyanDark font-bold mb-1">Get in Touch</h2>
        <p className="text-sm text-nixieGray mb-6">
          Share your details and our stylist team will get back to you.
        </p>

        {FIELDS.map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-xs font-semibold text-nixieGray uppercase tracking-wider mb-1.5">{f.label} *</label>
            <input
              type={f.type}
              value={values[f.key]}
              onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-nixieText focus:outline-none focus:ring-2 focus:ring-nixieCyan/50 focus:border-nixieCyanDark transition-all"
            />
          </div>
        ))}

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-center items-center gap-4 mt-7 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 sm:flex-initial sm:min-w-[220px] h-11 border-2 border-nixieCyanDark text-nixieCyanDark hover:bg-nixieCyan/10 transition-colors font-medium px-8 rounded-none text-sm sm:text-base active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!allFilled || submitting}
            onClick={handleSubmit}
            className="flex-1 sm:flex-initial sm:min-w-[230px] h-11 bg-nixieCyanDark hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all text-white font-medium px-10 rounded-none shadow-[3px_3px_0px_#F5A623] text-sm sm:text-base disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? "Submitting..." : "Submit"}
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