import { Link } from "react-router-dom"; 
import "../styles/theme.css";

export default function RaidPin({ pin, hoveredId, setHoveredId, uniqueKey }) {
  const { id, name, type, top, left, image, raidId, mainMechanic } = pin;

  // Pour le tooltip, on ne l'affiche que si ce pin spécifique est survolé
  const isHovered = hoveredId === uniqueKey;

  // Pour l'effet hover de tous les pins identiques
  const isAnyHovered = hoveredId?.startsWith(id);

  return (
    <div
      className="absolute"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <Link
        to={`/raid/${raidId}/${type}/${id}`}
        onMouseEnter={() => setHoveredId(uniqueKey)}
        onMouseLeave={() => setHoveredId(null)}
        className="group relative flex flex-col items-center"
      >
        {/* === Pin (Cercle) === */}
        <div
          className={`rounded-full border-2 overflow-hidden shadow-lg transition-all duration-200
            ${type === "boss" ? "w-8 h-8 border-gold" : "w-4 h-4 border-gray-500"}
            ${isAnyHovered ? "scale-125 ring-2 ring-gold shadow-gold-glow" : ""}
          `}
        >
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* === Tooltip === */}
        {isHovered && (
          <div className="absolute tooltip-boss-card translate-y-[-110%] translate-x-[-50%] z-50 pointer-events-none">
            <div className="font-semibold text-sm">{name}</div>
            <div className="text-gray-400 text-[0.7rem] mb-1">({type})</div>
            {mainMechanic && <div className="text-gray-300 italic leading-snug">{mainMechanic}</div>}
          </div>
        )}
      </Link>
    </div>
  );
}
