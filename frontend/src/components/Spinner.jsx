import { useEffect, useState } from "react";

const MESSAGES = [
  "Analyzing your photo...",
  "Detecting outfit style...",
  "Identifying fabric...",
  "Almost there...",
];

export default function Spinner() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-nixieCream flex flex-col items-center justify-center px-4 font-nixie">
      <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-nixieCyanDark animate-spin mb-6" />
      <p key={msgIndex} className="text-nixieText font-medium animate-fadeIn">
        {MESSAGES[msgIndex]}
      </p>
      <p className="text-nixieGray text-sm mt-2">This usually takes a few seconds</p>
    </div>
  );
}
