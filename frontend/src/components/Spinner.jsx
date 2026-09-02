import { useEffect, useState } from "react";

const MESSAGES = [
  "Analyzing your photo…",
  "Detecting outfit style…",
  "Identifying fabrics…",
  "Calculating your price…",
];

export default function Spinner() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    };
    const interval = setInterval(cycle, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen max-h-screen bg-nixieCream flex flex-col items-center justify-center px-6 font-nixie select-none">

      {/* Aesthetic Minimalist Dual Orbit Spinner */}
      <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
        {/* Outer smooth spinning ring */}
        <div className="absolute inset-0 rounded-full border-[2px] border-nixieCyanDark/15 border-t-nixieCyanDark animate-spin" />

        {/* Inner counter-rotating accent ring */}
        <div
          className="absolute w-10 h-10 rounded-full border-[2px] border-nixieYellow/30 border-b-nixieYellow animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.8s" }}
        />

        {/* Center glowing focal dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-nixieCyanDark animate-pulse" />
      </div>

      {/* Dynamic looping message */}
      <div className="h-9 flex items-center justify-center mb-2">
        <p
          key={msgIndex}
          className="text-nixieText font-medium text-lg text-center tracking-tight transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(5px)",
          }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Subtext */}
      <p className="text-nixieGray text-xs tracking-wide">
        This usually takes a few seconds
      </p>

    </div>
  );
}

