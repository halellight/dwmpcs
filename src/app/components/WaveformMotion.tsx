import React from "react";
import { motion } from "motion/react";

interface WaveformMotionProps {
  isPlaying: boolean;
  color?: string;
}

export default function WaveformMotion({
  isPlaying,
  color = "#64EE84",
}: WaveformMotionProps) {
  const bars = [14, 28, 42, 20, 36, 48, 24, 40, 18, 32, 44, 22, 16];

  return (
    <div className="flex items-center gap-1 h-8 px-2 py-1 bg-black/40 rounded-lg">
      {bars.map((height, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={
            isPlaying
              ? {
                  height: [
                    `${Math.max(6, height * 0.3)}px`,
                    `${height}px`,
                    `${Math.max(8, height * 0.5)}px`,
                  ],
                  opacity: [0.6, 1, 0.7],
                }
              : {
                  height: `${Math.max(6, height * 0.4)}px`,
                  opacity: 0.5,
                }
          }
          transition={{
            duration: 0.5 + (i % 4) * 0.15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: (i * 0.05) % 0.4,
          }}
        />
      ))}
    </div>
  );
}
