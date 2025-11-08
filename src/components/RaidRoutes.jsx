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

      <div className="absolute top-4 left-4 flex gap-3 pointer-events-auto z-20">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => setActiveRoute(activeRoute === route.id ? null : route.id)}
            onMouseEnter={() => setActiveRoute(route.id)}
            onMouseLeave={() => setActiveRoute(null)}
            className="px-4 py-2 rounded-xl text-white font-medium transition border-2 border-white hover:border-yellow-400"
            style={{ backgroundColor: route.color }}
          >
            {route.name}
          </button>
        ))}
      </div>
    </div>
  );
}
