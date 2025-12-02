import { useEffect, useRef } from "react";

export default function Route({
  points,
  color = "brown", 
  active,
  svgWidth,
  svgHeight,
  speed = 120,
}) {
  const segmentRefs = useRef([]);
  const timeoutsRef = useRef([]);

  // Construire les segments individuels
  const buildSegments = () => {
    if (!svgWidth || !svgHeight || !points || points.length < 2) return [];
    
    const segments = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      const x1 = (p1.x / 100) * svgWidth;
      const y1 = (p1.y / 100) * svgHeight;
      const x2 = (p2.x / 100) * svgWidth;
      const y2 = (p2.y / 100) * svgHeight;
      
      segments.push({
        d: `M ${x1} ${y1} L ${x2} ${y2}`,
        isTransition: p1.transitionToNext || false,
      });
    }
    
    return segments;
  };

  const segments = buildSegments();

  useEffect(() => {
    // Nettoyer tous les timeouts précédents
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    if (segments.length === 0) return;

    // Calculer la longueur totale et les longueurs de chaque segment
    const segmentLengths = segmentRefs.current.map((ref) => 
      ref ? ref.getTotalLength() : 0
    );
    const totalLength = segmentLengths.reduce((sum, len) => sum + len, 0);
    
    // Calculer les délais cumulés pour chaque segment
    let cumulativeLength = 0;
    const delays = segmentLengths.map((len) => {
      const delay = cumulativeLength / speed;
      cumulativeLength += len;
      return delay;
    });

    // Animer chaque segment
    segmentRefs.current.forEach((path, index) => {
      if (!path) return;

      const length = segmentLengths[index];
      const duration = length / speed;
      const delay = delays[index];
      const isTransition = segments[index].isTransition;

      // Reset - TOUS les segments commencent cachés de la même manière
      path.style.transition = "none";
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.getBoundingClientRect(); // Force reflow

      if (active) {
        // Animer avec délai
        const timeoutId = setTimeout(() => {
          // Pour les transitions, changer le strokeDasharray avant d'animer
          if (isTransition) {
            path.style.strokeDasharray = "8 8";
            // Calculer un offset de départ pour les pointillés
            const dashLength = 8;
            const gapLength = 8;
            const totalDashPattern = dashLength + gapLength;
            const numRepeats = Math.ceil(length / totalDashPattern);
            path.style.strokeDashoffset = `${numRepeats * totalDashPattern}`;
          }
          
          path.style.transition = `stroke-dashoffset ${duration}s ease-out`;
          path.style.strokeDashoffset = 0;
        }, delay * 1000);
        
        timeoutsRef.current.push(timeoutId);
      } else {
        // Réinitialiser - tout caché
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      }
    });

    // Cleanup function
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [segments.length, active, speed, svgWidth, svgHeight]);

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
    <g>
      {segments.map((segment, index) => {
        const isTransition = segment.isTransition;

        return (
          <path
            key={index}
            ref={(el) => (segmentRefs.current[index] = el)}
            d={segment.d}
            stroke={strokeColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={active ? 1 : 0}
            style={{
              filter: `
                drop-shadow(0 0 5px ${glow1})
                drop-shadow(0 0 10px ${glow2})
              `,
              transition: "opacity 0.5s ease-in-out",
              animation: active 
                ? "routePulse 2.5s ease-in-out infinite alternate" 
                : "none",
            }}
          />
        );
      })}
    </g>
  );
}