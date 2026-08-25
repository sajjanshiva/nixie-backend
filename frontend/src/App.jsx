import { useEffect, useState } from "react";
import UploadStep from "./components/UploadStep";
import ResultStep from "./components/ResultStep";
import ContactForm from "./components/ContactForm";
import ThankYou from "./components/ThankYou";
import { analyzeOutfit } from "./api/client";
import { STEPS, loadFromSession, saveToSession, clearSession } from "./session";

export default function App() {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const saved = loadFromSession();
    if (saved) {
      setStep(saved.step);
      setOrderData(saved.orderData);
    }
  }, []);

  function persist(nextStep, nextOrderData) {
    setStep(nextStep);
    setOrderData(nextOrderData);
    saveToSession({ step: nextStep, orderData: nextOrderData });
  }

  async function handleImageSelected(file) {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeOutfit(file);
      persist(STEPS.RESULT, result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleResultUpdated(updates) {
    persist(STEPS.RESULT, { ...orderData, ...updates });
  }

  function handleGoToContact() {
    persist(STEPS.CONTACT, orderData);
  }

  function handleBackToResult() {
    persist(STEPS.RESULT, orderData);
  }

  function handleSubmitted() {
    clearSession();
    setOrderData(null);
    setStep(STEPS.THANK_YOU);
  }

  function handleAnalyzeAnother() {
    clearSession();
    setOrderData(null);
    setError(null);
    setStep(STEPS.UPLOAD);
  }

  switch (step) {
    case STEPS.UPLOAD:
      return <UploadStep onImageSelected={handleImageSelected} loading={loading} error={error} />;

    case STEPS.RESULT:
      return (
        <ResultStep
          data={orderData}
          onUpdate={handleResultUpdated}
          onContactUs={handleGoToContact}
          onAnalyzeAnother={handleAnalyzeAnother}
        />
      );

    case STEPS.CONTACT:
      return (
        <ContactForm
          data={orderData}
          onBack={handleBackToResult}
          onSubmitted={handleSubmitted}
        />
      );

    case STEPS.THANK_YOU:
      return <ThankYou onAnalyzeAnother={handleAnalyzeAnother} />;

    default:
      return null;
  }
}
