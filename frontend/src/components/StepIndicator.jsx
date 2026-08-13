const STEPS = ["Photo", "Details", "Contact"];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i <= current ? "bg-nixieCyanDark" : "bg-gray-200"
              }`}
            />
            <span className={`text-[10px] ${i <= current ? "text-nixieText" : "text-nixieGray"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-0.5 -mt-4 transition-colors ${i < current ? "bg-nixieCyanDark" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
