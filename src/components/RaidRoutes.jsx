import { useState, useEffect, useRef } from "react";
import routesData from "../data/routes.json";
import Route from "./Route";

export default function RaidRoutes({ raidId }) {
  const [activeRoute, setActiveRoute] = useState(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const routes = routesData[raidId] || [];

  useEffect(() => {
    const updateDimensions = () => {
      if (!svgRef.current) return;
      setDimensions({
        width: svgRef.current.clientWidth,
        height: svgRef.current.clientHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="absolute inset-0 z-10">
      {/* --- SVG des routes --- */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
        {routes.map((route) => (
          <Route
            key={route.id}
            points={route.points}
            color={route.color}
            active={activeRoute === route.id}
            svgWidth={dimensions.width}
            svgHeight={dimensions.height}
            speed={600}
          />
        ))}
      </svg>

      {/* --- Boutons de sélection --- */}
      <div className="absolute top-4 left-4 flex gap-4 pointer-events-auto z-20">
        {routes.map((route) => {
          const isActive = activeRoute === route.id;

          return (
            <button
              key={route.id}
              onClick={() => setActiveRoute(isActive ? null : route.id)}
              onMouseEnter={() => setActiveRoute(route.id)}
              onMouseLeave={() => setActiveRoute(null)}
              className={`raidroute-btn ${isActive ? "active" : ""}`}
            >
              {route.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
