import { useEffect, useRef } from "react";

export default function Route({ points, color, active, svgWidth, svgHeight, speed = 100 }) {
  const pathRef = useRef(null); // référence au <path>

  // Génère le 'd' à partir des points et des dimensions du SVG
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

    // Déterminer la durée en fonction de la longueur et de la vitesse
    // speed = pixels / seconde
    const duration = length / speed;

    path.style.transition = "none";
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect(); // force repaint

    // Appliquer la transition avec durée calculée
    path.style.transition = `stroke-dashoffset ${duration}s linear`;
    path.style.strokeDashoffset = active ? 0 : length;
  }, [d, active, speed]);

  return (
    <path
      ref={pathRef}
      d={d}
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={active ? 1 : 0}
    />
  );
}
