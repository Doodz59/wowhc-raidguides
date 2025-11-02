import { createContext, useContext, useState } from "react"

const RaidContext = createContext()

export function RaidProvider({ children }) {
  const [tipsMode, setTipsMode] = useState({ mode: "general", playerClass: "" })

  return (
    <RaidContext.Provider value={{ tipsMode, setTipsMode }}>
      {children}
    </RaidContext.Provider>
  )
}

export function useRaid() {
  return useContext(RaidContext)
}
