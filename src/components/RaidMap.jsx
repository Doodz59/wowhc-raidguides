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

  // Mode édition activé (pour test) — tu peux le rendre dynamique
  const editMode = false;
const effectiveDisplayMode = editMode ? "full" : displayMode;

  const containerRef = useRef(null);

  // ---- handleMapClick : calcule depuis containerRef (plus fiable) ----
  const handleMapClick = async (e) => {
    if (!editMode) return;

    // Utiliser la bounding box du conteneur (pas e.target)
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const top = ((clientY - rect.top) / rect.height) * 100;
    const left = ((clientX - rect.left) / rect.width) * 100;

    // Clamp pour éviter valeurs hors bornes
    const clampedTop = Math.max(0, Math.min(100, top));
    const clampedLeft = Math.max(0, Math.min(100, left));

    const coords = `{ "top": ${clampedTop.toFixed(0)}, "left": ${clampedLeft.toFixed(0)} }`;
    setClickPos(coords);

    // Pour feedback visuel (dot), on garde aussi les valeurs percent
    setLastClick({ top: clampedTop, left: clampedLeft });

    try {
      await navigator.clipboard.writeText(coords);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Impossible de copier :", err);
    }
  };

  // state local pour afficher un dot au dernier clic (debug / UX)
  const [lastClick, setLastClick] = useState(null);

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

    if (effectiveDisplayMode === "full") {
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

  // MODE SIMPLE
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
    <div className="relative w-full max-w-4xl mx-auto mt-8" ref={containerRef}>

      {/* 🌄 Image du raid */}
      <img
        src={`/images/maps/${raidId}.jpg`}
        alt={`${raid.name} map`}
        className="rounded-lg shadow-lg w-full h-auto block"
        onError={(e) => {
          const t = e.target;
          if (!t.dataset.tryPng) {
            t.dataset.tryPng = "true";
            t.src = `/images/maps/${raidId}.png`;
          }
        }}
      />

      {/* -------------------------
          Overlay d'édition (au-dessus de tout)
          Capte les clics en mode édition et est transparente.
          Z-index suffisamment haut pour être au-dessus des pins/controls.
         ------------------------- */}
      {editMode && (
        <div
          className="absolute inset-0 z-[80] bg-transparent cursor-crosshair"
          onClick={handleMapClick}
          aria-hidden="true"
        />
      )}

      {/* Feedback visuel du dernier clic (dot) */}
      {editMode && lastClick && (
        <div
          className="absolute z-[90] pointer-events-none"
          style={{
            top: `${lastClick.top}%`,
            left: `${lastClick.left}%`,
            transform: "translate(-50%,-50%)",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              boxShadow: "0 0 8px rgba(212,175,55,0.8)",
              background: "#d9534f",
              border: "2px solid #fff",
            }}
          />
        </div>
      )}

      {/* ===================================================== */}
      {/* 🎛️ Onglet d'options (désactivé en mode édition)       */}
      {/* ===================================================== */}
      {!editMode && (
        <div className="absolute top-4 right-4 z-30">

          <button
            onClick={() => setShowOptions((v) => !v)}
            className="raidroute-btn px-5 py-2 flex items-center gap-2 shadow-lg"
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
                  onClick={() =>
                    setDisplayMode(displayMode === "simple" ? "full" : "simple")
                  }
                >
                  <div
                    className={`
                      absolute top-0.5 h-6 w-9 rounded-full transition-all
                      ${
                        displayMode === "simple"
                          ? "left-1 bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                          : "right-1 bg-[#5c4726] shadow-inner"
                      }
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

              {/* BOSS LIST */}
              <details className="group">
                <summary className="cursor-pointer text-yellow-300 font-bold mb-1">
                  Boss
                </summary>

                <div className="pl-2 mt-2 space-y-1">
                  {raid.bosses.map((boss) => (
                    <label
                      key={boss.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{boss.name}</span>
                      <div
                        className="relative w-5 h-5 border border-[#8b6f30] bg-[#1b1a17] rounded cursor-pointer"
                        onClick={() =>
                          setFilters((f) => ({
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

              {/* TRASH LIST */}
              <details className="group">
                <summary className="cursor-pointer text-yellow-300 font-bold mb-1">
                  Trash
                </summary>

                <div className="pl-2 mt-2 space-y-1">
                  {raid.trash.map((trash) => (
                    <label
                      key={trash.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {trash.name}
                        <span className="text-gray-400 ml-1">
                          ({trash.mapPos?.length || 0})
                        </span>
                      </span>

                      <div
                        className="relative w-5 h-5 border border-[#8b6f30] bg-[#1b1a17] rounded cursor-pointer"
                        onClick={() =>
                          setFilters((f) => ({
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

      {/* ROUTES (non éditable) */}
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

      {/* Petit badge "copied" */}
      {copied && (
        <div className="absolute bottom-4 right-4 z-60 px-3 py-2 rounded bg-black/70 text-white text-sm">
          Coordonnées copiées !
        </div>
      )}
    </div>
  );
}
