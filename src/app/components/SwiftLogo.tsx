import React from "react";

interface SwiftLogoProps {
  className?: string;
  size?: number;
  color?: string;
  withGlow?: boolean;
}

export default function SwiftLogo({
  className = "",
  size = 28,
  color = "#64EE84",
  withGlow = false,
}: SwiftLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {withGlow && (
        <div
          className="absolute inset-0 blur-[10px] opacity-70 rounded-full pointer-events-none scale-125"
          style={{ backgroundColor: color }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm transition-transform duration-300"
      >
        {/* Swift Precision Lightning Bolt Polygon */}
        <polygon
          points="56,5 73,5 58,39 96,53 44,95 27,95 42,61 4,47"
          fill={color}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
