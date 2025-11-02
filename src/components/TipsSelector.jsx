import { useState } from "react"

export default function TipsSelector({ onChange }) {
  const [mode, setMode] = useState("general")
  const [playerClass, setPlayerClass] = useState("")

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (newMode === "general") onChange({ mode: newMode, playerClass: "" })
  }

  const handleClassChange = (e) => {
    const selectedClass = e.target.value
    setPlayerClass(selectedClass)
    onChange({ mode, playerClass: selectedClass })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 p-4 rounded-md border border-gold/30">
      <div className="flex gap-3">
        <button
          onClick={() => handleModeChange("general")}
          className={`px-4 py-2 rounded-md ${mode === "general" ? "bg-gold text-black" : "bg-gray-700 text-gray-300"}`}
        >
          General Tips
        </button>
        <button
          onClick={() => handleModeChange("class")}
          className={`px-4 py-2 rounded-md ${mode === "class" ? "bg-gold text-black" : "bg-gray-700 text-gray-300"}`}
        >
          Class Tips
        </button>
      </div>

      {mode === "class" && (
        <select
          value={playerClass}
          onChange={handleClassChange}
          className="bg-gray-800 border border-gold/40 rounded-md px-3 py-2 text-gray-200"
        >
          <option value="">Select your class</option>
          <option value="warrior">Warrior</option>
          <option value="rogue">Rogue</option>
          <option value="hunter">Hunter</option>
          <option value="mage">Mage</option>
          <option value="warlock">Warlock</option>
          <option value="priest">Priest</option>
          <option value="paladin">Paladin</option>
          <option value="druid">Druid</option>
          <option value="shaman">Shaman</option>
        </select>
      )}
    </div>
  )
}
