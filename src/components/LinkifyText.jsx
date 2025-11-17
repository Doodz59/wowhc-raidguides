import React from "react";
import { Link } from "react-router-dom";

export default function LinkifyText({ text, raid }) {
  // Construire un dictionnaire pour tous les liens possibles
  const links = {};

  raid.bosses.forEach(b => {
    links[b.name] = `/raid/${raid.id}/boss/${b.id}`;
  });
  raid.trash.forEach(t => {
    links[t.name] = `/raid/${raid.id}/trash/${t.id}`;
  });

  // Regex pour matcher tous les noms connus
  const pattern = new RegExp(Object.keys(links).join("|"), "g");

  const parts = text.split(pattern);

  const matches = text.match(pattern) || [];

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
