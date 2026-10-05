import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { VIDEO } from "../config";

// Film grain + vignette that sit over the whole edit.
export const Texture: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={VIDEO.width} height={VIDEO.height} style={{ opacity: 0.07, mixBlendMode: "screen" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.32) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
