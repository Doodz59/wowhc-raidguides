import { useState, useRef } from "react";
import RaidPin from "./RaidPin";
import RaidRoutes from "./RaidRoutes";

export default function RaidMap({ raidId, raid }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [clickPos, setClickPos] = useState(null);
  const [copied, setCopied] = useState(false);

  // Mode simplifié par défaut
  const [displayMode, setDisplayMode] = useState("simple");

  // Menu déroulant des options
  const [showOptions, setShowOptions] = useState(false);

  // Filtres individuels trash + boss
  const [filters, setFilters] = useState({
    trash: raid.trash.reduce((acc, t) => ({ ...acc, [t.id]: true }), {}),
    bosses: raid.bosses.reduce((acc, b) => ({ ...acc, [b.id]: true }), {}),
  });

  const editMode = false;
  const containerRef = useRef(null);

  const handleMapClick = async (e) => {
    if (!editMode) return;

    const rect = e.target.getBoundingClientRect();
    const top = ((e.clientY - rect.top) / rect.height) * 100;
    const left = ((e.clientX - rect.left) / rect.width) * 100;

    const coords = `{ "top": ${top.toFixed(0)}, "left": ${left.toFixed(0)} }`;
    setClickPos(coords);

    try {
      await navigator.clipboard.writeText(coords);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Impossible de copier :", err);
    }
  };

  // ---------------------------------------------------------
  // 🎯 Calcul dynamique des pins
  // ---------------------------------------------------------
  const computePins = () => {
    const bossPins = raid.bosses
      .filter((b) => filters.bosses[b.id])
      .map((boss) => ({
        id: boss.id,
        name: boss.name,
        type: "boss",
        positions: boss.mapPos ? [boss.mapPos] : [],
        image: boss.image?.[0],
        raidId,
        mainMechanic: boss.mainMechanic || "",
      }));

    if (displayMode === "full") {
      const trashPins = raid.trash
        .filter((t) => filters.trash[t.id])
        .map((trash) => ({
          id: trash.id,
          name: trash.name,
          type: "trash",
          positions: trash.mapPos || [],
          image: trash.image?.[0],
          raidId,
          mainMechanic: trash.mainMechanic || "",
        }));

      return [...bossPins, ...trashPins];
    }

    // Mode SIMPLIFIÉ → 1 trash max + filtré
    const simpleTrash = raid.trash
      .filter((t) => filters.trash[t.id])
      .map((trash) => ({
        id: trash.id,
        name: trash.name,
        type: "trash",
        positions:
          trash.mapPos && trash.mapPos.length > 0 ? [trash.mapPos[0]] : [],
        image: trash.image?.[0],
        raidId,
        mainMechanic: trash.mainMechanic || "",
      }));

    return [...bossPins, ...simpleTrash];
  };

  const displayedPins = computePins();

  // ---------------------------------------------------------

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-8" ref={containerRef}>
      
      {/* 🌄 Image du raid */}
      <img
        src={`/images/maps/${raidId}.jpg`}
        alt={`${raid.name} map`}
        className="rounded-lg shadow-lg w-full h-auto"
        onClick={handleMapClick}
        onError={(e) => {
          const t = e.target;
          if (!t.dataset.tryPng) {
            t.dataset.tryPng = "true";
            t.src = `/images/maps/${raidId}.png`;
          }
        }}
      />

      {/* ===================================================== */}
      {/* 🎛️ ONGLET DEROULEMENT : OPTIONS                     */}
      {/* ===================================================== */}

      {!editMode && (
        <div className="absolute top-4 right-4 z-30">

  {/* BOUTON OPTIONS */}
<button
  onClick={() => setShowOptions(v => !v)}
  className="
    raidroute-btn
    px-5 py-2
    flex items-center gap-2
    shadow-lg
  "
>
  ⚙️ Options
</button>

{showOptions && (
  <div
    className="
      mt-3 p-4 w-72
      bg-[rgba(10,8,5,0.92)]
      text-[#f3e5ab]
      rounded-lg
      border border-[rgba(212,175,55,0.3)]
      shadow-[0_0_15px_rgba(212,175,55,0.3)]
      backdrop-blur-md
      font-[Lora]
      space-y-4
    "
  >

    {/* SWITCH FULL / SIMPLE */}
    <div className="flex items-center justify-between">
      <span className="text-sm">Affichage :</span>

      <div
        className="relative w-20 h-7 bg-[#2a2215] border border-[#8b6f30] rounded-full cursor-pointer shadow-inner"
        onClick={() => setDisplayMode(displayMode === "simple" ? "full" : "simple")}
      >
        <div
          className={`
            absolute top-0.5 h-6 w-9 rounded-full transition-all
            ${displayMode === "simple"
              ? "left-1 bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.8)]"
              : "right-1 bg-[#5c4726] shadow-inner"}
          `}
        ></div>

        <span className="absolute left-2 top-1 text-[0.65rem] uppercase text-[#1b1508] font-bold">
          Simp
        </span>
        <span className="absolute right-2 top-1 text-[0.65rem] uppercase text-[#cbbf93] font-bold">
          Full
        </span>
      </div>
    </div>

    {/* CATEGORIES AVEC ACCORDÉON */}
    {/* Boss */}
    <details className="group">
      <summary className="cursor-pointer text-yellow-300 font-bold mb-1">
        Boss
      </summary>

      <div className="pl-2 mt-2 space-y-1">
        {raid.bosses.map(boss => (
          <label key={boss.id} className="flex justify-between items-center text-sm">
            <span>{boss.name}</span>

            {/* CHECKBOX STYLISÉE */}
            <div
              className="relative w-5 h-5 border border-[#8b6f30] bg-[#1b1a17] rounded cursor-pointer"
              onClick={() =>
                setFilters(f => ({
                  ...f,
                  bosses: {
                    ...f.bosses,
                    [boss.id]: !f.bosses[boss.id],
                  },
                }))
              }
            >
              {filters.bosses[boss.id] && (
                <div className="absolute inset-0 bg-[#d4af37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
              )}
            </div>
          </label>
        ))}
      </div>
    </details>

    {/* Trash */}
    <details className="group">
      <summary className="cursor-pointer text-yellow-300 font-bold mb-1">
        Trash
      </summary>

      <div className="pl-2 mt-2 space-y-1">
        {raid.trash.map(trash => (
          <label key={trash.id} className="flex justify-between items-center text-sm">
            <span>
              {trash.name}
              <span className="text-gray-400 ml-1">
                ({trash.mapPos?.length || 0})
              </span>
            </span>

            {/* CHECKBOX STYLISÉE */}
            <div
              className="relative w-5 h-5 border border-[#8b6f30] bg-[#1b1a17] rounded cursor-pointer"
              onClick={() =>
                setFilters(f => ({
                  ...f,
                  trash: {
                    ...f.trash,
                    [trash.id]: !f.trash[trash.id],
                  },
                }))
              }
            >
              {filters.trash[trash.id] && (
                <div className="absolute inset-0 bg-[#d4af37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
              )}
            </div>
          </label>
        ))}
      </div>
    </details>

  </div>
)}


        </div>
      )}

      {/* ROUTES */}
      {!editMode && <RaidRoutes raidId={raidId} containerRef={containerRef} />}

      {/* PINS */}
      {displayedPins.map((pin) =>
        pin.positions.map((pos, i) => (
          <RaidPin
            key={`${pin.id}-${i}`}
            pin={{ ...pin, ...pos }}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            uniqueKey={`${pin.id}-${i}`}
          />
        ))
      )}
    </div>
  );
}
