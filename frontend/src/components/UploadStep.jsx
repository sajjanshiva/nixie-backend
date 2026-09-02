import { useRef, useState } from "react";
import Spinner from "./Spinner";
import modelHero from "../assets/model-hero.png";

export default function UploadStep({ onImageSelected, loading, error }) {
  const inputRef = useRef(null);
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
    <div className="w-full h-screen max-h-screen overflow-hidden bg-nixieCream font-nixie flex flex-col md:flex-row">

      {/* ── MOBILE VIEW: Simple, natural full-image layout (Zero crop, edge-to-edge photo + clean text below) ── */}
      <div className="flex md:hidden flex-col h-full overflow-y-auto bg-nixieCream">

        {/* Full uncropped image with clean solid boundaries at top and bottom */}
        <div className="w-full flex-shrink-0 border-y-[3.5px] border-nixieCyanDark">
          <img
            src={modelHero}
            alt="Fashion model"
            className="w-full h-auto block"
          />
        </div>

        {/* Text & Button cleanly below the photo on cream background with comfortable spacing */}
        <div
          className="w-full px-7 py-8 flex flex-col justify-center animate-slideUp"
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-nixieCyanDark mb-2">
            Found a look you can&apos;t stop
          </h1>
          <h1 className="text-2xl sm:text-3xl font-bold italic text-nixieYellow mb-4">
            thinking about?
          </h1>
          <p className="text-nixieText/75 text-sm leading-relaxed mb-7 max-w-sm">
            Upload it here, we&apos;ll tell you what it&apos;ll cost to get the look at Nixie!
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-nixieCyanDark text-nixieCyanDark font-medium px-8 py-3 rounded-none shadow-[3px_3px_0px_#F5A623] hover:bg-nixieCyanDark hover:text-white transition-all text-sm active:translate-x-0.5 active:translate-y-0.5 ${dragActive ? "bg-nixieCyanDark text-white" : ""}`}
            >
              Show us the outfit
            </button>
          </div>

          {error && (
            <p className="text-red-600 mt-4 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden md:flex w-full h-full">

        {/* Left: headline + button */}
        <div className="flex-1 h-full flex flex-col justify-center px-12 lg:px-20 xl:px-28 animate-slideLeft">
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

        {/* Right: model photo — right-aligned flush with edge, no border line, object-contain */}
        <div className="w-[48%] xl:w-[45%] h-full flex items-center justify-end bg-nixieCream animate-slideRight overflow-hidden">
          <img
            src={modelHero}
            alt="Fashion model"
            className="h-full w-auto object-contain object-right-top"
          />
        </div>

      </div>

    </div>
  );
}
