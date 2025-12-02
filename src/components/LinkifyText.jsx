import React from "react";
import { Link } from "react-router-dom";

export default function LinkifyText({ text, raid }) {
  // Sécurité : forcer text en string pour éviter les crashs
  const safeText = typeof text === "string" ? text : String(text ?? "");

  // Construire un dictionnaire pour tous les liens possibles
  const links = {};

  raid.bosses.forEach(b => {
    links[b.name] = `/raid/${raid.id}/boss/${b.id}`;
  });

  raid.trash.forEach(t => {
    links[t.name] = `/raid/${raid.id}/trash/${t.id}`;
  });

  // Fonction pour échapper les caractères spéciaux dans la regex
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Regex pour matcher tous les noms connus (échappés)
  const pattern = new RegExp(
    Object.keys(links)
      .map(name => escapeRegex(name))
      .join("|"),
    "g"
  );

  const parts = safeText.split(pattern);
  const matches = safeText.match(pattern) || [];

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches[i] && (
            <Link
              to={links[matches[i]]}
              className="text-gold underline hover:text-yellow-400"
            >
              {matches[i]}
            </Link>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
