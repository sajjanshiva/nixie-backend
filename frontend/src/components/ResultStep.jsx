export default function ResultStep({ data, onContactUs, onAnalyzeAnother }) {
  // Build fabric description text
  const fabricParts = [data.primaryFabric];

  if (data.secondaryFabrics && data.secondaryFabrics.length > 0) {
    fabricParts.push(...data.secondaryFabrics.map((f) => f.name));
  }

  const fabricText =
    fabricParts.length === 1
      ? fabricParts[0]
      : fabricParts.slice(0, -1).join(", ") +
        " and " +
        fabricParts[fabricParts.length - 1];

  const comment =
    data.aiComment ||
    (data.outfitType
      ? `What a gorgeous ${data.outfitType.toLowerCase()}!`
      : "Such a stunning choice!");

  return (
    <div className="w-full bg-nixieCream font-nixie flex flex-col md:flex-row justify-center overflow-hidden">

      {/* ── MOBILE VIEW: scrollable stacked layout ── */}
      <div className="nixie-mobile flex md:hidden flex-col h-full overflow-y-auto">
        {/* Outfit photo — cleanly padded and framed */}
        <div className="w-full flex items-center justify-center p-6 bg-nixieCream">
          <div className="w-full max-w-[280px] max-h-[320px] overflow-hidden shadow-sm border border-gray-200">
            <img
              src={data.imageUrl}
              alt="Your reference outfit"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Info below */}
        <div className="flex-1 px-6 pb-8 flex flex-col justify-center animate-slideUp">
          <h2 className="text-2xl font-normal italic text-nixieCyanDark leading-snug mb-3">
            {comment}
          </h2>

          <p className="text-nixieText text-sm sm:text-base leading-relaxed mb-5">
            Nixie detected that this is a{" "}
            <span className="font-semibold underline underline-offset-2">
              {data.outfitType}
            </span>{" "}
            made of{" "}
            <span className="font-semibold underline underline-offset-2">
              {fabricText}
            </span>
            .
          </p>

          <div className="mb-6">
            <p className="text-nixieGray text-xs sm:text-sm mb-0.5">
              Making this will cost you
            </p>

            <p className="text-3xl sm:text-4xl font-bold text-nixieCyanDark">
              ₹{data.price.finalPrice.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onContactUs}
              className="bg-nixieCyanDark text-white font-medium px-6 py-3 rounded-none shadow-[3px_3px_0px_#F5A623] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all text-sm"
            >
              Make it for me
            </button>

            <button
              type="button"
              onClick={onAnalyzeAnother}
              className="border-2 border-nixieCyanDark text-nixieCyanDark bg-transparent hover:bg-nixieCyan/10 font-medium px-6 py-3 rounded-none transition-all text-sm active:translate-x-0.5 active:translate-y-0.5"
            >
              Check another outfit
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW (Framed to 1366x768 px) ── */}
      <div className="nixie-desktop hidden md:flex w-full max-w-[1366px] h-[768px] md:max-h-[768px] mx-auto items-center">

        {/* Left Side: Outfit Photo */}
        <div className="w-[45%] h-full flex items-center justify-center p-10 lg:p-14 xl:p-16 animate-slideLeft">
          <div className="max-h-[72vh] max-w-[380px] w-auto h-auto overflow-hidden shadow-md border border-gray-200/80 bg-white">
            <img
              src={data.imageUrl}
              alt="Your reference outfit"
              className="w-full max-h-[72vh] object-cover object-top"
            />
          </div>
        </div>

        {/* Right Side: Analysis & CTAs */}
        <div className="w-[55%] h-full flex flex-col justify-center px-10 lg:px-16 xl:px-20 animate-slideRight">
          <div className="max-w-lg">

            {/* AI Comment heading */}
            <h2 className="text-3xl lg:text-4xl font-normal italic text-nixieCyanDark leading-tight mb-6">
              {comment}
            </h2>

            {/* Detection sentence */}
            <p className="text-nixieText text-base lg:text-lg leading-relaxed mb-8">
              Nixie detected that this is a{" "}
              <span className="font-semibold underline underline-offset-4 decoration-nixieCyanDark/80">
                {data.outfitType}
              </span>{" "}
              made of{" "}
              <span className="font-semibold underline underline-offset-4 decoration-nixieCyanDark/80">
                {fabricText}
              </span>
              .
            </p>

            {/* Price block */}
            <div className="mb-9">
              <p className="text-nixieGray text-sm mb-1">
                Making this will cost you
              </p>

              <p className="text-5xl font-bold text-nixieCyanDark tracking-tight">
                ₹{data.price.finalPrice.toLocaleString("en-IN")}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onContactUs}
                className="bg-nixieCyanDark text-white font-medium px-8 py-3.5 rounded-none shadow-[4px_4px_0px_#F5A623] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all text-base"
              >
                Make it for me
              </button>

              <button
                type="button"
                onClick={onAnalyzeAnother}
                className="border-2 border-nixieCyanDark text-nixieCyanDark bg-transparent hover:bg-nixieCyan/10 font-medium px-8 py-3.5 rounded-none transition-all text-base active:translate-x-0.5 active:translate-y-0.5"
              >
                Check another outfit
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}