import { useEffect, useRef } from "react";

export default function Route({
  points,
  color = "brown", 
  active,
  svgWidth,
  svgHeight,
  speed = 120,
}) {
  const pathRef = useRef(null);

  const buildPath = () => {
    if (!svgWidth || !svgHeight || !points) return "";
    return points
      .map((p, i) => {
        const x = (p.x / 100) * svgWidth;
        const y = (p.y / 100) * svgHeight;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const d = buildPath();

  useEffect(() => {
    if (!pathRef.current || !d) return;

    const path = pathRef.current;
    const length = path.getTotalLength();
    const duration = length / speed;

    path.style.transition = "none";
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();

    path.style.transition = `stroke-dashoffset ${duration}s ease-out`;
    path.style.strokeDashoffset = active ? 0 : length;
  }, [d, active, speed]);

  // Déterminer le style selon la couleur (marron ou doré)
  const isBrown = color === "brown";
  const strokeColor = isBrown ? "#7b5a2b" : "#d4af37"; // marron ou doré
  const glow1 = isBrown
    ? "rgba(212, 175, 55, 0.4)" // doré léger autour du brun
    : "rgba(123, 90, 43, 0.5)"; // brun doux autour du doré
  const glow2 = isBrown
    ? "rgba(255, 215, 100, 0.2)"
    : "rgba(255, 215, 100, 0.6)";

  return (
    <path
      ref={pathRef}
      d={d}
      stroke={strokeColor}
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={active ? 1 : 0.8}
      style={{
        filter: `
          drop-shadow(0 0 5px ${glow1})
          drop-shadow(0 0 10px ${glow2})
        `,
        transition: "opacity 0.5s ease-in-out",
        animation: active ? "routePulse 2.5s ease-in-out infinite alternate" : "none",
      }}
    />
  );
}
