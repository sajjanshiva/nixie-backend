import { useRef, useState } from "react";
import Spinner from "./Spinner";
import StepIndicator from "./StepIndicator";

export default function UploadStep({ onImageSelected, loading, error }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (loading) {
    return <Spinner />;
  }

  function handleFile(file) {
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onImageSelected(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="min-h-screen bg-nixieCream flex flex-col items-center px-4 py-12 font-nixie">
      <StepIndicator current={0} />

      <h1 className="text-3xl md:text-4xl text-nixieText text-center mb-2 font-semibold">
        Seen a dream outfit somewhere?
      </h1>
      <h2 className="text-2xl md:text-3xl text-nixieGray text-center mb-8">
        We will recreate it for you.
      </h2>

      <div className="bg-nixieCard rounded-nixie shadow-md p-6 w-full max-w-xl animate-fadeIn">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-nixie flex flex-col items-center justify-center text-center py-14 px-4 cursor-pointer transition-all overflow-hidden ${
            dragActive ? "border-nixieCyanDark bg-nixieCream/60 scale-[1.01]" : "border-gray-300 hover:border-nixieCyanDark/60"
          }`}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-48 object-contain rounded-lg" />
          ) : (
            <>
              <svg className="w-9 h-9 text-nixieGray mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-nixieText font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-nixieGray text-sm">PNG, JPG, WEBP up to 10MB</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full bg-nixieCyan hover:bg-nixieCyanDark active:scale-[0.99] transition-all text-nixieText font-medium px-8 py-3 rounded-full mt-6"
        >
          Analyze Outfit
        </button>

        <p className="text-xs text-nixieGray text-center mt-3 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your image is secure and private
        </p>
      </div>

      {error && (
        <p className="text-red-600 mt-6 max-w-xl text-center bg-red-50 border border-red-200 rounded-lg px-4 py-2 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
