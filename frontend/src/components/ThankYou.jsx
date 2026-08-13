export default function ThankYou({ onAnalyzeAnother }) {
  return (
    <div className="min-h-screen bg-nixieCream flex flex-col items-center justify-center px-4 py-16 font-nixie text-center">
      <div className="bg-nixieCard rounded-nixie shadow-md p-10 w-full max-w-xl animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-nixieCyan flex items-center justify-center mx-auto mb-6 animate-popIn">
          <svg className="w-10 h-10 text-nixieText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl md:text-3xl text-nixieText font-semibold mb-2">
          Thanks, we'll be in touch!
        </h2>
        <p className="text-nixieGray text-sm mb-8 max-w-sm mx-auto">
          Our team has received your outfit details and will reach out to you shortly.
        </p>

        <div className="bg-nixieCream rounded-nixie p-5 mb-8 text-left border border-gray-100">
          <p className="text-sm font-medium text-nixieText mb-3">What happens next</p>
          <ul className="space-y-2.5 text-sm text-nixieGray">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-nixieCyanDark mt-1.5 shrink-0" />
              Our stylist team will review your uploaded photo and details
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-nixieCyanDark mt-1.5 shrink-0" />
              We'll reach out on your phone or email to confirm the final design
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-nixieCyanDark mt-1.5 shrink-0" />
              You'll get a final, confirmed price before anything is made
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="bg-nixieCyan hover:bg-nixieCyanDark active:scale-[0.99] transition-all text-nixieText font-medium px-8 py-3 rounded-full mb-4"
        >
          Analyze Another Outfit
        </button>

        <a
          href="https://www.instagram.com/thenixie.in"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-nixieGray hover:text-nixieText transition-colors text-sm"
        >
          Follow us on Instagram · @thenixie.in
        </a>
      </div>
    </div>
  );
}
