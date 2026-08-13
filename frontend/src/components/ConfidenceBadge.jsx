export default function ConfidenceBadge({ value }) {
  let color = "bg-green-50 text-green-700 border-green-200";
  if (value < 60) color = "bg-red-50 text-red-700 border-red-200";
  else if (value < 85) color = "bg-yellow-50 text-yellow-700 border-yellow-200";

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${color}`}>
      {value}% Confidence
    </span>
  );
}
