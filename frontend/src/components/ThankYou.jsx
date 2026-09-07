export default function ThankYou({ onAnalyzeAnother }) {
  const steps = [
    {
      title: "We review your photo",
      desc: "Our stylist team personally goes through your uploaded outfit reference.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a3 3 0 0 0-3 3c0 1.3.8 2.4 2 2.8L3 15a2 2 0 0 0 1.2 3h15.6a2 2 0 0 0 1.2-3L13 8.8C14.2 8.4 15 7.3 15 6a3 3 0 0 0-3-3z" />
          <path d="M9 18v3" />
          <path d="M15 18v3" />
        </svg>
      ),
    },
    {
      title: "We reach out to you",
      desc: "We'll contact you on your phone or email to confirm the final design.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          <path d="M14 3h7v7" />
          <path d="M10 14L21 3" />
        </svg>
      ),
    },
    {
      title: "You approve the price",
      desc: "You get a final confirmed price before we start making anything.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-nixieCream flex flex-col items-center justify-center px-4 py-12 font-nixie text-center relative">

      <div className="w-full max-w-lg relative z-10">

        {/* Clean Checkmark Badge (NO bubbles) */}
        <div className="animate-popIn mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-nixieCyanDark flex items-center justify-center shadow-md">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
              <path className="animate-checkDraw" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="animate-stagger1 mb-8">
          <h2 className="nixie-card-heading font-bold text-nixieCyanDark tracking-tight mb-2">
            You&apos;re all set!
          </h2>
          <p className="text-nixieGray text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Our stylist team has received your outfit details.<br />
            We&apos;ll reach out to you shortly.
          </p>
        </div>

        {/* Connected Journey Card (NO numbers, NO emojis, pure luxury SVG line icons) */}
        <div className="animate-stagger2 bg-white/90 backdrop-blur-sm border border-nixieCyanDark/15 rounded-2xl p-6 sm:p-7 shadow-sm mb-8 text-left relative overflow-hidden">
          
          {/* Subtle decorative top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nixieCyanDark via-nixieCyan to-nixieYellow" />

          <p className="text-xs uppercase tracking-wider font-semibold text-nixieCyanDark mb-5">
            What happens next
          </p>

          <div className="relative space-y-6">
            {/* Continuous vertical timeline connector line */}
            <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-nixieCyanDark via-nixieCyan to-nixieYellow/40" />

            {steps.map((s, idx) => (
              <div key={idx} className="relative z-10 flex items-start gap-4 group">
                {/* Icon node */}
                <div className="w-11 h-11 rounded-full bg-nixieCream border-2 border-nixieCyanDark flex items-center justify-center text-nixieCyanDark shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-nixieCyanDark group-hover:text-white">
                  {s.icon}
                </div>
                {/* Content */}
                <div className="pt-0.5">
                  <h3 className="font-semibold text-nixieText text-sm sm:text-base tracking-tight mb-0.5">
                    {s.title}
                  </h3>
                  <p className="text-nixieGray text-xs sm:text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CTA Button + Instagram */}
        <div className="animate-stagger3 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="w-full sm:w-auto bg-nixieCyanDark hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all text-white font-medium px-10 py-3.5 rounded-none shadow-[4px_4px_0px_#F5A623] text-base"
          >
            Check another outfit
          </button>
          <a
            href="https://www.instagram.com/thenixie.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-nixieGray hover:text-nixieCyanDark transition-colors text-sm group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Follow us · @thenixie.in
          </a>
        </div>

      </div>
    </div>
  );
}
