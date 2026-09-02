export default function ThankYou({ onAnalyzeAnother }) {
  return (
    <div className="min-h-screen bg-nixieCream flex flex-col items-center justify-center px-4 py-16 font-nixie text-center overflow-hidden">

      {/* Decorative background circles */}
      <div className="fixed top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-nixieCyan/10 animate-breathe pointer-events-none" />
      <div className="fixed bottom-[-60px] left-[-60px] w-48 h-48 rounded-full bg-nixieCyan/10 animate-breathe pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="w-full max-w-md relative z-10">

        {/* Animated check icon */}
        <div className="animate-stagger1">
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer pulse ring */}
            <div className="absolute inset-0 rounded-full bg-nixieCyan/20 animate-pulseRing" />
            {/* Inner circle */}
            <div className="relative w-24 h-24 rounded-full bg-nixieCyanDark flex items-center justify-center animate-popIn">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}>
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="animate-stagger2">
          <h2 className="text-3xl md:text-4xl font-bold text-nixieCyanDark mb-2">
            You&apos;re all set!
          </h2>
          <p className="text-nixieGray text-base mb-8">
            Our team has received your outfit details.<br />
            We&apos;ll reach out to you shortly.
          </p>
        </div>

        {/* What happens next cards */}
        <div className="animate-stagger3 space-y-3 mb-10 text-left">
          {[
            {
              icon: "🔍",
              title: "We review your photo",
              desc: "Our stylist team personally goes through your uploaded outfit reference.",
            },
            {
              icon: "📞",
              title: "We reach out to you",
              desc: "We'll contact you on your phone or email to confirm the final design.",
            },
            {
              icon: "✅",
              title: "You approve the price",
              desc: "You get a final confirmed price before we start making anything.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white rounded-xl px-5 py-4 shadow-sm border border-nixieCyan/10"
            >
              <span className="text-2xl mt-0.5 shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-nixieText text-sm">{item.title}</p>
                <p className="text-nixieGray text-xs mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA + Instagram */}
        <div className="animate-stagger4 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="bg-nixieCyanDark hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all text-white font-medium px-10 py-3.5 rounded-none shadow-[4px_4px_0px_#F5A623] text-base"
          >
            Check another outfit
          </button>
          <a
            href="https://www.instagram.com/thenixie.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-nixieGray hover:text-nixieCyanDark transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Follow us · @thenixie.in
          </a>
        </div>
      </div>
    </div>
  );
}
