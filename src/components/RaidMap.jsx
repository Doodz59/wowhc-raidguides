import { useState } from "react";
import RaidPin from "./RaidPin";

export default function RaidMap({ raidId, raid }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [clickPos, setClickPos] = useState(null);
  const [copied, setCopied] = useState(false);


  const editMode = false; // pin location tool


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

    console.log("📍 Coordonnées copiées :", coords);
  };


  const pins = [
    ...raid.bosses.map((boss) => ({
      id: boss.id,
      name: boss.name,
      type: "boss",
      positions: boss.mapPos ? [boss.mapPos] : [],
      image: boss.image?.[0],
      raidId,
      mainMechanic: boss.mainMechanic || "",
    })),
    ...raid.trash.map((trash) => ({
      id: trash.id,
      name: trash.name,
      type: "trash",
      positions: trash.mapPos || [],
      image: trash.image?.[0],
      raidId,
      mainMechanic: trash.mainMechanic || "",
    })),
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-8">

      <img
        src={`/images/maps/${raidId}.jpg`}
        alt={`${raid.name} map`}
        className={`rounded-lg shadow-lg w-full h-auto ${
          editMode ? "cursor-crosshair" : ""
        }`}
        onClick={handleMapClick}
      />

  
      {pins.map((pin) =>
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

  
      {editMode && clickPos && (
        <div className="fixed bottom-5 left-5 bg-black/80 text-yellow-300 px-3 py-2 rounded-md text-sm font-mono border border-yellow-500 shadow-lg z-50">
          <div>{clickPos}</div>
          {copied && (
            <div className="text-green-400 text-xs mt-1 animate-pulse">
              📋 Coordinates copied!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
