import { useRef, useState } from "react";
import Spinner from "./Spinner";
import modelHero from "../assets/model-hero.png";

export default function UploadStep({ onImageSelected, loading, error }) {
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  if (loading) {
    return <Spinner />;
  }

  function handleFile(file) {
    if (!file) return;
    onImageSelected(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="w-full h-screen max-h-[768px] min-h-[550px] bg-nixieCream font-nixie flex flex-col md:flex-row overflow-hidden">

      {/* ── MOBILE VIEW: Simple, natural full-image layout (Zero crop, edge-to-edge photo + clean text below) ── */}
      <div className="nixie-mobile flex md:hidden flex-col h-full overflow-y-auto bg-nixieCream">

        {/* Full uncropped image with clean solid boundaries at top and bottom */}
        <div className="w-full flex-shrink-0 border-y-[3.5px] border-nixieCyanDark">
          <img
            src={modelHero}
            alt="Fashion model"
            className="w-full h-auto block"
          />
        </div>

        {/* Content below image */}
        <div className="flex-1 flex flex-col justify-center px-6 pt-5 pb-8 text-center">
          <div className="max-w-sm mx-auto">
            <h1 className="text-3xl font-bold leading-tight text-nixieCyanDark mb-1">
              Found a look you<br />can&apos;t stop
            </h1>
            <h1 className="text-3xl font-bold italic text-nixieYellow mb-4">
              thinking about?
            </h1>
            <p className="text-nixieText/75 text-sm leading-relaxed mb-6">
              Upload it here, we&apos;ll tell you what it&apos;ll cost to get the look at Nixie!
            </p>

            <input
              ref={mobileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <button
              type="button"
              onClick={() => mobileInputRef.current?.click()}
              className="w-full border-2 border-nixieCyanDark text-nixieCyanDark font-medium py-3.5 rounded-none shadow-[3px_3px_0px_#F5A623] hover:bg-nixieCyanDark hover:text-white transition-all text-base active:translate-x-0.5 active:translate-y-0.5"
            >
              Show us the outfit
            </button>

            {error && (
              <p className="text-red-600 mt-4 text-xs bg-red-50 border border-red-200 rounded px-3 py-2 animate-fadeIn">
                {error}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="nixie-desktop hidden md:flex w-full h-full justify-between">

        {/* Left: headline + button */}
        <div className="flex-1 h-full flex flex-col justify-center px-8 lg:px-16 xl:px-24 animate-slideLeft">
          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-nixieCyanDark mb-1">
              Found a look you<br />can&apos;t stop
            </h1>
            <h1 className="text-4xl lg:text-5xl font-bold italic text-nixieYellow mb-6">
              thinking about?
            </h1>
            <p className="text-nixieText/75 text-base leading-relaxed mb-10">
              Upload it here, we&apos;ll tell you what it&apos;ll cost to get the look at Nixie!
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className="inline-block"
            >
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-nixieCyanDark text-nixieCyanDark font-medium px-8 py-3.5 rounded-none shadow-[4px_4px_0px_#F5A623] hover:bg-nixieCyanDark hover:text-white transition-all duration-200 text-base active:translate-x-0.5 active:translate-y-0.5 ${
                  dragActive ? "bg-nixieCyanDark text-white" : ""
                }`}
              >
                Show us the outfit
              </button>
            </div>

            {error && (
              <p className="text-red-600 mt-6 text-sm bg-red-50 border border-red-200 rounded px-4 py-2 animate-fadeIn">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Right: model photo — full uncropped photo, scaled to height, flush to the right edge */}
        <div className="h-full flex items-center justify-end shrink-0 animate-slideRight overflow-hidden">
          <img
            src={modelHero}
            alt="Fashion model"
            className="h-full w-auto object-contain object-right-top block"
          />
        </div>

      </div>

    </div>
  );
}
